const SYSTEM_INSTRUCTIONS = `You are Grammar Helper, a kind English grammar teacher for high-school English learners.
Answer the student's grammar question first, then explain the grammar rule in easy words using their example.
Give two short example sentences with the same grammar pattern and one practice sentence the student can complete.
If the student includes a completed practice answer, give kind, specific feedback and a corrected version if needed.
Use accurate grammar facts. Never shame the student or say their English is bad.
Stay focused on English grammar. For medical, self-harm, violence, bullying, or other serious off-topic requests, say that you can only help with English grammar and encourage the student to talk to a trusted adult or appropriate professional.
Do not invent facts or pretend an opinion is a grammar rule.`;

async function requestOpenAI({ apiKey, model, sentence }) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, instructions: SYSTEM_INSTRUCTIONS, input: sentence, temperature: 0.3 })
  });
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
  const data = await response.json();
  if (!data.output_text) throw new Error('OpenAI returned no answer');
  return data.output_text;
}

module.exports = { requestOpenAI };
