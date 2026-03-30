/**
 * serve.mjs — Minimal static file server for the POC.
 *
 * AudioWorklet requires files to be served over HTTP (not file://),
 * so you must run this server before opening index.html.
 *
 * Usage:  node serve.mjs
 *         Then open: http://localhost:3000
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.css':  'text/css',
  '.md':   'text/markdown',
  '.txt':  'text/plain',
};

const server = http.createServer((req, res) => {
  // Default to index.html
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  // Strip query strings
  urlPath = urlPath.split('?')[0];

  const filePath = path.join(__dirname, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${urlPath}`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server error: ${err.message}`);
      }
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      // Required for SharedArrayBuffer / AudioWorklet in some browsers
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  🚀  POC server running at http://localhost:${PORT}\n`);
  console.log(`  Open the link above in Chrome or Edge.`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
