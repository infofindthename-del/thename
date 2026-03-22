export async function POST(request) {
  try {
    const { prompt } = await request.json();
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.map(b => b.text || '').join('\n') || '';
    return Response.json({ text });
  } catch (e) {
    return Response.json({ error: 'Errore server' }, { status: 500 });
  }
}
