#!/usr/bin/env node
// Minimal static server that maps clean URLs to /path/index.html
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = Number(process.env.PORT || 8080);
const ROOT = path.resolve(process.argv[2] || 'site');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'text/xml; charset=utf-8',
};

http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { res.writeHead(400); return res.end('bad url'); }
  let fp = path.join(ROOT, pathname);
  if (fp.startsWith(ROOT + path.sep) === false && fp !== ROOT) { res.writeHead(403); return res.end('forbidden'); }
  const resolve = () => {
    if (!fs.existsSync(fp)) return null;
    const st = fs.statSync(fp);
    if (st.isDirectory()) {
      const idx = path.join(fp, 'index.html');
      return fs.existsSync(idx) ? idx : null;
    }
    return st.isFile() ? fp : null;
  };
  const final = resolve();
  if (!final) { res.writeHead(404); return res.end('Not found: ' + pathname); }
  fs.readFile(final, (e, data) => {
    if (e) { res.writeHead(500); return res.end('error'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(final).toLowerCase()] || 'application/octet-stream', 'Content-Length': data.length });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}`));
