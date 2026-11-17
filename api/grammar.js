const { requestOpenAI } = require('../src/openai-request');

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

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.statusCode = 503;
    return res.json({ error: 'I cannot answer right now. Please check the OpenAI key in Vercel.' });
  }

  try {
    const answer = await requestOpenAI({ apiKey, model, sentence });
    return res.json({ answer });
  } catch {
    res.statusCode = 502;
    return res.json({ error: 'I cannot answer right now. Please check the OpenAI key and your internet connection.' });
  }
};
