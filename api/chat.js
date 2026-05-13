export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  try {
    const body = { ...req.body };
 
    // Inject today's date into the system prompt so the AI can resolve
    // relative dates like "tomorrow", "next Friday", "in 3 days", etc.
    const _d = new Date(); const today = `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,"0")}-${String(_d.getDate()).padStart(2,"0")}`;
    const dateContext = `Today's date is ${today}. When the user mentions relative dates like "tomorrow", "next Friday", "in 3 days", "next week", etc., resolve them to an exact YYYY-MM-DD date based on today's date. Always return dates in YYYY-MM-DD format.`;
 
    if (body.system) {
      // Prepend date context to existing system prompt
      body.system = `${dateContext}\n\n${body.system}`;
    } else if (Array.isArray(body.messages) && body.messages.length > 0) {
      // No system prompt — prepend a system field
      body.system = dateContext;
    }
 
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });
 
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'API call failed' });
  }
}