export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { toolName } = req.body;
  const VERCEL_AI_KEY = process.env.VERCEL_AI_KEY;

  if (!VERCEL_AI_KEY) {
    return res.status(500).json({ error: 'VERCEL_AI_KEY não configurada no painel da Vercel.' });
  }

  try {
    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_AI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'perplexity/sonar',
        messages: [{
          role: 'user',
          content: `Provide detailed information about the AI tool "${toolName}" in JSON format with these exact fields:
{
  "name": "tool name",
  "company": "company name",
  "price_usd": number,
  "models": ["list of AI models"],
  "features": { ... },
  "highlights": [...],
  "limitations": [...],
  "website": "url",
  "category": "nativo or agregador"
}
Only respond with valid JSON.`
        }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
