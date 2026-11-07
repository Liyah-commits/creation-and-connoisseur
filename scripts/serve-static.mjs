/**
 * A small static server for the built site (.vercel/output/static), used by
 * every test. `astro preview` does not work with the Vercel adapter.
 *
 * It behaves like Vercel does for this site:
 *   /x/            -> /x/index.html
 *   /x (no dot)    -> 308 redirect to /x/   (trailingSlash: 'always')
 *   unknown path   -> /404.html with status 404
 * and compresses text responses, as Vercel does, so Lighthouse measures
 * realistic transfer sizes.
 *
 * Usage: node scripts/serve-static.mjs [port]   (default 4321, or $PORT)
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { pipeline } from 'node:stream';
import { createBrotliCompress, createGzip } from 'node:zlib';

const root = resolve('.vercel/output/static');
const port = Number(process.argv[2] ?? process.env.PORT ?? 4321);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};
const compressible = new Set(['.html', '.css', '.js', '.mjs', '.json', '.xml', '.txt', '.svg']);

async function fileAt(path) {
  try {
    const info = await stat(path);
    return info.isFile() ? path : null;
  } catch {
    return null;
  }
}

function send(req, res, status, file, extraHeaders = {}) {
  const ext = extname(file);
  const headers = { 'Content-Type': types[ext] ?? 'application/octet-stream', ...extraHeaders };
  if (file.includes(`${sep}_astro${sep}`)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  else headers['Cache-Control'] = 'public, max-age=0, must-revalidate';

  const accept = String(req.headers['accept-encoding'] ?? '');
  let encoder = null;
  if (compressible.has(ext)) {
    headers.Vary = 'Accept-Encoding';
    if (/\bbr\b/.test(accept)) {
      encoder = createBrotliCompress();
      headers['Content-Encoding'] = 'br';
    } else if (/\bgzip\b/.test(accept)) {
      encoder = createGzip();
      headers['Content-Encoding'] = 'gzip';
    }
  }
  res.writeHead(status, headers);
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(file);
  if (encoder) pipeline(stream, encoder, res, () => {});
  else pipeline(stream, res, () => {});
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }
  const target = normalize(join(root, pathname));
  if (target !== root && !target.startsWith(root + sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  if (pathname.endsWith('/')) {
    const index = await fileAt(join(target, 'index.html'));
    if (index) return send(req, res, 200, index);
  } else {
    const file = await fileAt(target);
    if (file) return send(req, res, 200, file);
    if (!extname(pathname) && (await fileAt(join(target, 'index.html')))) {
      res.writeHead(308, { Location: `${pathname}/${url.search}` }).end();
      return;
    }
  }

  const notFound = await fileAt(join(root, '404.html'));
  if (notFound) return send(req, res, 404, notFound);
  res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://localhost:${port}/`);
});

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
