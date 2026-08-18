import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const SITE = 'site';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const CONCURRENCY = 10;

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.get(url, { headers: { 'User-Agent': UA } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume(); return resolve(fetchBuf(new URL(res.headers.location, url)));
      }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error('HTTP ' + res.statusCode)); }
      const chunks = []; res.on('data', c => chunks.push(c)); res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    });
    req.on('error', reject);
  });
}

const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
);

// Gather all JS paths referenced across all HTML pages
const refPaths = new Set();
const pages = walk(SITE).filter(f => f.endsWith('.html'));
for (const f of pages) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/src="(\/_next\/static\/chunks\/[^"]+\.js)"/g)) {
    refPaths.add(m[1].replace(/^\//, ''));
  }
}

// What's already on disk
const onDisk = new Set(
  walk(path.join(SITE, '_next', 'static', 'chunks'))
    .map(p => path.relative(SITE, p).split(path.sep).join('/'))
);

const missing = [...refPaths].filter(p => !onDisk.has(p));
console.log(`Referenced: ${refPaths.size}  |  On disk: ${onDisk.size}  |  Missing: ${missing.length}`);

if (!missing.length) { console.log('All chunks present.'); process.exit(0); }

let i = 0;
async function worker() {
  while (i < missing.length) {
    const rel = missing[i++];
    const out = path.join(SITE, rel);
    try {
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const buf = await fetchBuf(new URL('https://www.tonyrobbins.com/' + rel));
      fs.writeFileSync(out, buf);
      console.log(`  + ${rel}  (${buf.length} bytes)`);
    } catch (e) {
      console.error(`  ! ${rel}: ${e.message}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log('Patch complete.');
