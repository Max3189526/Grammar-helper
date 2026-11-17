const http = require('http');
const fs = require('fs');
const path = require('path');
const { requestOpenAI } = require('./src/openai-request');

const PORT = Number(process.env.PORT || 3000);
const root = path.join(__dirname, 'public');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  return Object.fromEntries(fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter(Boolean).map(line => {
    const index = line.indexOf('=');
    return index < 0 ? [line, ''] : [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
}

const env = loadEnv();
const apiKey = env.OPENAI_API_KEY;
const model = 'gpt-5.6-luna';

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveFile(req, res) {
  const requested = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.normalize(path.join(root, requested));
  if (!filePath.startsWith(root)) return sendJson(res, 404, { error: 'Not found' });
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
  fs.readFile(filePath, (error, content) => {
    if (error) return sendJson(res, 404, { error: 'Not found' });
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'text/plain; charset=utf-8' });
    res.end(content);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 20000) reject(new Error('Message too long')); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/grammar') {
    try {
      const body = JSON.parse(await readBody(req));
      const sentence = String(body.sentence || '').trim();
      if (!sentence) return sendJson(res, 400, { error: 'Please enter a sentence or grammar question.' });
      if (!apiKey || apiKey === 'paste-your-key-here') return sendJson(res, 503, { error: 'I cannot answer right now. Please check the OpenAI key in .env.' });
      const answer = await requestOpenAI({ apiKey, model, sentence });
      return sendJson(res, 200, { answer });
    } catch (error) {
      return sendJson(res, 502, { error: 'I cannot answer right now. Please check the OpenAI key and your internet connection.' });
    }
  }
  if (req.method === 'GET') return serveFile(req, res);
  sendJson(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, () => console.log(`Grammar Helper is running at http://localhost:${PORT}`));
