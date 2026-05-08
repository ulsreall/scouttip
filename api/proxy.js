// Vercel serverless proxy for Bags API
// Route: /api/proxy?path=/token-launch/feed&limit=20

const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.VITE_BAGS_API_KEY || process.env.BAGS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Bags API key not configured on server' });
  }

  const apiPath = req.query._path || req.query.path || '';
  if (!apiPath) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // Remove proxy-specific params
  const { _path, path, ...queryParams } = req.query;
  const qs = new URLSearchParams(queryParams).toString();
  const url = `${BAGS_API_BASE}${apiPath.startsWith('/') ? apiPath : '/' + apiPath}${qs ? '?' + qs : ''}`;

  console.log(`[Bags Proxy] ${req.method} ${url}`);

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    };

    if (req.method === 'POST' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    try {
      return res.json(JSON.parse(data));
    } catch {
      return res.send(data);
    }
  } catch (err) {
    console.error('[Bags Proxy] Error:', err);
    return res.status(502).json({ error: 'Proxy error', message: err.message });
  }
}
