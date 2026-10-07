/**
 * ==========================================================================
 * KAVYA GURU — Fast Lightweight Server with SQLite Database Backend
 * Brand: KAVYA GURU | Tagline: Read • Learn • Grow
 * ==========================================================================
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { handleApiRequest } = require('./backend/apiHandler');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const reqUrl = req.url || '/';

  // 1. Dispatch REST API requests
  if (reqUrl.startsWith('/api/')) {
    return handleApiRequest(req, res);
  }

  // 2. Static File Serving
  let reqPath = reqUrl.split('?')[0];
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA hash navigation
      const indexPath = path.join(BASE_DIR, 'index.html');
      fs.readFile(indexPath, (errIndex, content) => {
        if (errIndex) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found - Kavya Guru');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌟 KAVYA GURU — Read • Learn • Grow`);
  console.log(`🗄️  SQLite Database Engine: Online (data/kavya_guru.db)`);
  console.log(`🚀 Server & Backend API running at http://localhost:${PORT}`);
  console.log(`====================================================`);
});
