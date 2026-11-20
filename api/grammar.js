const { requestOpenAI } = require('../src/openai-request');
const { getKey, clearKey } = require('../src/key-manager');

const model = 'gpt-5.6-luna';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }

  const sentence = String((req.body && req.body.sentence) || '').trim();
  if (!sentence) {
    res.statusCode = 400;
    return res.json({ error: 'Please enter a sentence or grammar question.' });
  }

  try {
    let apiKey = await getKey();
    let answer;
    try { answer = await requestOpenAI({ apiKey, model, sentence }); }
    catch (error) { if (error.status !== 401) throw error; clearKey(); apiKey = await getKey(); answer = await requestOpenAI({ apiKey, model, sentence }); }
    return res.json({ answer });
  } catch (error) {
    console.error(error.fix || 'No fix provided.');
    res.statusCode = 502;
    return res.json({ error: { message: error.message || 'I cannot answer right now.', fix: error.fix || 'Try again later.' } });
  }
};
