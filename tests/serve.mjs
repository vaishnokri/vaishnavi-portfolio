import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';

const root = resolve('.');
const types = {
  '.html': 'text/html', '.css': 'text/css',
  '.js': 'text/javascript', '.woff2': 'font/woff2',
};

// Unlike SPA preview fallbacks, incorrect root/subpath asset URLs must 404.
createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pathname === '/favicon.ico') {
    response.writeHead(204).end();
    return;
  }
  const source = pathname.startsWith('/reference/');
  const prefix = source ? '/reference/' : '/vaishnavi-portfolio/';
  const folder = source ? root : resolve(root, 'dist');
  const relative = decodeURIComponent(pathname.slice(prefix.length)) || 'index.html';
  const file = resolve(folder, relative);
  const allowedSource = /^(index\.html|style\.css|script\.js|assets\/fonts\/[\w-]+\.woff2)$/.test(relative);
  if (!pathname.startsWith(prefix) || !file.startsWith(folder + sep) || (source && !allowedSource)) {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(4173, '127.0.0.1');
