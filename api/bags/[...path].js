const BAGS_API = 'https://public-api-v2.bags.fm/api/v1';
const API_KEY = process.env.VITE_BAGS_API_KEY;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path } = req.query;
    const endpoint = Array.isArray(path) ? '/' + path.join('/') : '/' + (path || '');

    const bagsUrl = `${BAGS_API}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    };

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(bagsUrl, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: err.message });
  }
}
