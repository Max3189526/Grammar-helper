const fs = require('fs');
const path = require('path');

let cached = null;

function loadLocalEnv() {
  const file = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(file)) return {};
  return Object.fromEntries(fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map(line => {
    const index = line.indexOf('=');
    return index < 0 ? [line, ''] : [line.slice(0, index).trim(), line.slice(index + 1).trim()];
  }));
}

function keyError(message, fix) { const error = new Error(message); error.fix = fix; return error; }

async function getKey() {
  if (cached && Date.parse(cached.expiresAt) > Date.now() + 5000) return cached.apiKey;
  const local = loadLocalEnv();
  const url = process.env.KEYGEN_URL || local.KEYGEN_URL;
  const token = process.env.KEYGEN_TOKEN || local.KEYGEN_TOKEN;
  if (!url || url === 'paste-here' || !token || token === 'paste-here') throw keyError('The AI key is not ready.', 'Put KEYGEN_URL and KEYGEN_TOKEN in .env, then restart the server.');
  let response;
  try { response = await fetch(`${url.replace(/\/$/, '')}/api/lookup-key`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }); }
  catch { throw keyError('The AI key service could not be reached.', 'Check KEYGEN_URL and your internet connection.'); }
  if (!response.ok) throw keyError('The AI key service did not provide a key.', 'Check KEYGEN_URL and KEYGEN_TOKEN.');
  const data = await response.json();
  if (!data.apiKey || !data.expiresAt) throw keyError('The AI key service returned an incomplete key.', 'Ask MindDo for a valid apiKey and expiresAt response.');
  cached = { apiKey: data.apiKey, expiresAt: data.expiresAt };
  return cached.apiKey;
}

function clearKey() { cached = null; }
module.exports = { getKey, clearKey };
