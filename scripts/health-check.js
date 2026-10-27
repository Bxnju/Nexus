const http = require('node:http');
const port = Number(process.argv[2]);
const id = process.argv[3];
http.get(`http://localhost:${port}/health`, response => {
  let body = ''; response.on('data', chunk => body += chunk);
  response.on('end', () => { try { const data = JSON.parse(body); process.exit(data.id === id ? 0 : 1); } catch { process.exit(1); } });
}).on('error', () => process.exit(1));
