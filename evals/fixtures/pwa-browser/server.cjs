const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
let version = 1;
let writes = 0;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4187');
  const send = (status, type, body, headers = {}) => { res.writeHead(status, { 'Content-Type': type, ...headers }); res.end(body); };
  if (url.pathname === '/control/version' && req.method === 'POST') { version++; return send(200, 'text/plain', String(version)); }
  if (url.pathname === '/control/writes') return send(200, 'text/plain', String(writes), { 'Cache-Control': 'no-store' });
  if (url.pathname === '/app/write' && ['POST', 'PUT'].includes(req.method)) { writes++; return send(200, 'text/plain', 'saved', { 'Cache-Control': 'no-store' }); }
  if (url.pathname === '/app/sw.js') return send(200, 'text/javascript', fs.readFileSync(path.join(root, 'sw.js'), 'utf8').replaceAll('__VERSION__', String(version)), { 'Cache-Control': 'no-store' });
  if (url.pathname === '/app/manifest.webmanifest') return send(200, 'application/manifest+json', JSON.stringify({ name: 'Fixture', short_name: 'Fixture', id: '/app/', start_url: '/app/', scope: '/app/', display: 'standalone' }));
  if (url.pathname === '/app/offline.html') return send(200, 'text/html', '<h1>Offline</h1><p>Reconnect and retry.</p>', { 'Cache-Control': 'no-store' });
  if (url.pathname === '/app/static.123.css') return send(200, 'text/css', 'body { font-family: sans-serif; }');
  if (url.pathname === '/app/tenant-a') {
    const authorized = /(?:^|;\s*)user=A(?:;|$)/.test(req.headers.cookie || '');
    return send(authorized ? 200 : 403, 'text/plain', authorized ? 'A record' : 'Forbidden', { 'Cache-Control': 'no-store' });
  }
  if (url.pathname === '/app/private.json' || url.pathname === '/app/private') {
    const user = /(?:^|;\s*)user=([AB])(?:;|$)/.exec(req.headers.cookie || '')?.[1];
    if (!user) return send(401, 'text/plain', 'Unauthorized', { 'Cache-Control': 'no-store' });
    const body = url.pathname.endsWith('.json') ? JSON.stringify({ user, marker: `PRIVATE-${user}` }) : `<h1>PRIVATE-${user}</h1>`;
    return send(200, url.pathname.endsWith('.json') ? 'application/json' : 'text/html', body, { 'Cache-Control': url.searchParams.has('unsafe') ? 'private, max-age=3600' : 'no-store' });
  }
  if (url.pathname.startsWith('/app/')) return send(200, 'text/html', fs.readFileSync(path.join(root, 'index.html')), { 'Cache-Control': 'no-store' });
  return send(404, 'text/plain', 'Not found');
});
server.listen(4187, '127.0.0.1');
