#!/usr/bin/env node
// Tony Robbins site mirror — downloads server-rendered HTML, all static assets,
// localizes CDN images/videos, and rewrites URLs so the clone serves offline.
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const SITE = path.resolve('site');
const MEDIA = path.join(SITE, '_media');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const ORIGIN = 'https://www.tonyrobbins.com';
const DOWNLOAD_VIDEOS = process.env.VIDEOS !== '0';
const MAX_PAGES = Number(process.env.MAX_PAGES || 32);
const CONCURRENCY = 8;

const seen = new Set();
const mediaMap = new Map();      // decoded original URL -> local absolute path
const assetJobs = [];            // { url, saveRel, isCss }
const assetIndex = new Map();    // href -> true  (dedupe)
const pages = [];                // { saveRel, html }
let totalBytes = 0;

const isSanity = u => u.hostname === 'cdn.sanity.io';
const isVideoCdn = u => u.hostname === 'cdnsnty.tonyrobbins.com';
const isInternal = u => u.hostname === 'www.tonyrobbins.com' || u.hostname === 'tonyrobbins.com';

const ASSET_EXT = /\.(css|js|mjs|json|png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|otf|eot|mp4|webm|txt)$/i;

function log(...a) { console.log(...a); }

// ------------------------------------------------------------------ fetching
function fetchBuf(url, { retries = 3 } = {}) {
  return new Promise((resolve, reject) => {
    const attempt = (tries, redirects) => {
      const mod = url.protocol === 'https:' ? https : http;
      const req = mod.get(url, { headers: { 'User-Agent': UA, 'Accept': '*/*' } }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          res.resume();
          if (redirects > 5) return reject(new Error('too many redirects: ' + url.href));
          const next = new URL(res.headers.location, url);
          return attempt(tries, redirects + 1);
        }
        if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode + ' ' + url.href)); }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
        res.on('error', reject);
      });
      req.on('error', e => {
        if (tries > 0) setTimeout(() => attempt(tries - 1, redirects), 700);
        else reject(e);
      });
      req.setTimeout(30000, () => req.destroy(new Error('timeout ' + url.href)));
    };
    attempt(retries, 0);
  });
}

// ------------------------------------------------------------------ url helpers
function decodeEnt(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
function normalizeUrl(u, base) {
  try { const x = new URL(u, base); x.hash = ''; return x; } catch { return null; }
}
function hrefKey(u) { return u.origin + u.pathname + u.search; }

// Sanity CDN: strip query params, save original asset by filename
function localizeCdn(url) {
  const filename = decodeURIComponent(path.basename(url.pathname));
  if (!filename) return null;
  const local = '/_media/' + filename;
  mediaMap.set(hrefKey(url), local);
  if (!assetIndex.has(url.origin + url.pathname)) {
    assetIndex.set(url.origin + url.pathname, true);
    assetJobs.push({ url: url.origin + url.pathname, saveRel: '_media/' + filename });
  }
  return local;
}

// Same-origin asset (next/static chunks, favicons, fonts) — keep the same path
function enqueueOriginAsset(url) {
  const rel = url.pathname.replace(/^\//, '');
  if (!rel || rel.includes('..')) return null;
  if (assetIndex.has(url.origin + url.pathname + url.search)) return '/' + rel;
  assetIndex.set(url.origin + url.pathname + url.search, true);
  assetJobs.push({ url: url.origin + url.pathname, saveRel: rel, isCss: url.pathname.endsWith('.css') });
  return '/' + rel;
}

function handleAssetUrl(url, base = ORIGIN) {
  const u = normalizeUrl(decodeEnt(url), base);
  if (!u) return null;
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  // next/image optimizer wrapper -> unwrap the real image URL behind it
  if (isInternal(u) && u.pathname === '/_next/image') {
    const src = u.searchParams.get('url');
    if (!src) return null;
    const local = handleAssetUrl(src, u);
    if (local) mediaMap.set(hrefKey(u), local);
    return local;
  }
  if (isSanity(u)) return localizeCdn(u);
  if (isVideoCdn(u)) {
    if (!DOWNLOAD_VIDEOS) return null;
    const filename = decodeURIComponent(path.basename(u.pathname));
    if (!filename) return null;
    const local = '/_media/' + filename;
    mediaMap.set(hrefKey(u), local);
    if (!assetIndex.has(u.origin + u.pathname)) {
      assetIndex.set(u.origin + u.pathname, true);
      assetJobs.push({ url: u.origin + u.pathname, saveRel: '_media/' + filename });
    }
    return local;
  }
  if (isInternal(u) && (u.pathname.startsWith('/_next/') || ASSET_EXT.test(u.pathname))) {
    return enqueueOriginAsset(u);
  }
  // external non-sanity hosts (e.g. player.vimeo) are left hotlinked
  return null;
}

// ------------------------------------------------------------------ extractors
const ATTR_RE = /(?:href|src|poster|data-src|data-poster|content|srcset)="([^"]+)"/gi;
const FLIGHT_RE = /self\.__next_f\.push\(\[[0-9]+,"((?:[^"\\]|\\.)*)"\]\)/g;

function collectHtmlUrls(html, baseUrl) {
  // 1. normal attributes (href/src/srcset/poster/og:image content)
  let m;
  ATTR_RE.lastIndex = 0;
  while ((m = ATTR_RE.exec(html))) {
    // srcset always holds comma-separated candidates — split them first
    if (/^srcset=/i.test(m[0].trim())) {
      for (const part of decodeEnt(m[1]).split(',')) {
        const cand = part.trim().split(/\s+/)[0];
        if (cand && !/^data:/i.test(cand)) handleAssetUrl(cand, baseUrl);
      }
      continue;
    }
    const val = decodeEnt(m[1]);
    if (/^https?:\/\//i.test(val)) { handleAssetUrl(val, baseUrl); continue; }
    if (/^\/\//.test(val)) { handleAssetUrl('https:' + val, baseUrl); continue; }
    if (/^data:/i.test(val)) continue;
    if (/^\/[^/]/.test(val) || /^\.{1,2}\//.test(val)) {
      if (ASSET_EXT.test(val.split('?')[0])) handleAssetUrl(val, baseUrl);
    }
  }
  // 2. flight-data strings (RSC payload) — JSON-unescape then scan for URLs
  FLIGHT_RE.lastIndex = 0;
  while ((m = FLIGHT_RE.exec(html))) {
    let text;
    try { text = JSON.parse('"' + m[1] + '"'); } catch { continue; }
    const urlRe = /https?:\/\/[^\s"'<>]+/g;
    let u;
    while ((u = urlRe.exec(text))) {
      const val = u[0];
      if (/cdn\.sanity\.io|cdnsnty\.tonyrobbins|_next\//.test(val)) handleAssetUrl(val);
    }
  }
}

function collectCssUrls(css, baseHref) {
  const re = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
  let m;
  while ((m = re.exec(css))) {
    const val = m[2].trim();
    if (!val || /^data:/i.test(val) || /^#/.test(val)) continue;
    const u = normalizeUrl(val, baseHref);
    if (!u || (u.protocol !== 'http:' && u.protocol !== 'https:')) continue;
    if (isSanity(u) || isVideoCdn(u)) { localizeCdn(u); continue; }
    if (isInternal(u)) enqueueOriginAsset(u);
  }
}

// ------------------------------------------------------------------ page crawl
const PAGE_SEEDS = [
  '/', '/the-story', '/the-system', '/the-science', '/programs', '/events',
  '/events-calendar', '/results-coaching', '/business-coaching', '/start',
  '/podcasts', '/collections/all', '/documentary', '/the-mission', '/free-resources',
  '/blog', '/network', '/newsletters', '/coaching', '/community',
];

function shouldClone(pathname) {
  if (pathname === '/' || pathname === '/en') return true;
  const clean = pathname.replace(/\/+$/, '');
  if (!clean) return false;
  if (PAGE_SEEDS.some(s => s === clean)) return true;
  if (/^\/(events|podcasts)\//.test(clean)) return true;
  return false;
}

function pageRel(pathname) {
  if (pathname === '/' || pathname === '/index') return 'index.html';
  const clean = pathname.replace(/\/+$/, '') + '/index.html';
  return clean.replace(/^\//, '');
}

async function crawlPages() {
  const queue = [...PAGE_SEEDS];
  const seenPages = new Set();
  while (queue.length && seenPages.size < MAX_PAGES) {
    const p = queue.shift();
    const key = p.replace(/\/+$/, '') || '/';
    if (seenPages.has(key)) continue;
    seenPages.add(key);
    const url = new URL(key, ORIGIN);
    let buf;
    try { buf = await fetchBuf(url); } catch (e) { log('  ! page fail', key, e.message); continue; }
    const html = buf.toString('utf8');
    pages.push({ saveRel: pageRel(url.pathname), html });
    collectHtmlUrls(html, url.href);
    // internal links
    const linkRe = /href="(\/[^"#?]*)/g;
    let m;
    while ((m = linkRe.exec(html))) {
      const t = m[1].replace(/\/+$/, '') || '/';
      if (t && shouldClone(t) && !seenPages.has(t) && !queue.includes(t)) queue.push(t);
    }
    log(`  [page ${seenPages.size}/${MAX_PAGES}] ${key}`);
  }
}

// ------------------------------------------------------------------ asset phase
async function downloadAssets() {
  log(`Downloading ${assetJobs.length} assets…`);
  let i = 0;
  async function worker() {
    while (i < assetJobs.length) {
      const job = assetJobs[i++];
      const out = path.join(SITE, job.saveRel);
      try {
        fs.mkdirSync(path.dirname(out), { recursive: true });
        const buf = await fetchBuf(new URL(job.url));
        totalBytes += buf.length;
        fs.writeFileSync(out, buf);
        if (job.isCss) {
          const css = buf.toString('utf8');
          collectCssUrls(css, job.url);
          fs.writeFileSync(out, css); // save unmodified copy now; rewrite pass applies media swaps
        }
      } catch (e) {
        log('  ! asset fail', job.url, e.message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  log(`Downloaded assets: ~${(totalBytes / 1048576).toFixed(1)} MB`);
}

// ------------------------------------------------------------------ rewrite
function rewriteMedia(text) {
  for (const [orig, local] of mediaMap) {
    if (text.indexOf(orig) !== -1) text = text.split(orig).join(local);
    const encAmp = orig.replace(/&/g, '&amp;');
    if (encAmp !== orig && text.indexOf(encAmp) !== -1) text = text.split(encAmp).join(local);
    // inside RSC flight JSON, & is escaped as &
    const encU = orig.replace(/&/g, '\\u0026');
    if (encU !== orig && text.indexOf(encU) !== -1) text = text.split(encU).join(local);
  }
  return text;
}

async function rewriteFiles() {
  for (const p of pages) {
    const out = path.join(SITE, p.saveRel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, rewriteMedia(p.html));
  }
  // rewrite CSS files that contain sanity urls
  const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : (e.name.endsWith('.css') ? [path.join(dir, e.name)] : [])) : [];
  for (const f of walk(SITE)) {
    const txt = fs.readFileSync(f, 'utf8');
    if (/cdn\.sanity\.io/.test(txt)) fs.writeFileSync(f, rewriteMedia(txt));
  }
}

// ------------------------------------------------------------------ main
async function main() {
  log('Crawling pages…');
  await crawlPages();
  log(`Pages captured: ${pages.length}`);
  // asset phase may discover more assets from CSS (fonts) — loop until stable
  for (let r = 0; r < 4; r++) {
    const before = assetJobs.length;
    await downloadAssets();
    if (assetJobs.length === before) break;
  }
  log('Rewriting references…');
  await rewriteFiles();
  log('Done. Output in ./site');
}

main().catch(e => { console.error(e); process.exit(1); });
