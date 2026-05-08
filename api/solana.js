// Vercel serverless proxy for Solana RPC
// Route: POST /api/solana with JSON-RPC body

const RPC_ENDPOINTS = [
  'https://mainnet.helius-rpc.com/?api-key=7a4f7a4f-7a4f-4a4f-7a4f-7a4f7a4f7a4f', // Free Helius tier
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/demo',
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rpcBody = req.body;
  if (!rpcBody || !rpcBody.method) {
    return res.status(400).json({ error: 'Invalid JSON-RPC body' });
  }

  // Try each RPC endpoint
  for (const rpcUrl of RPC_ENDPOINTS) {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcBody),
      });

      if (response.ok) {
        const data = await response.json();
        res.setHeader('X-RPC-Source', rpcUrl.split('/')[2]);
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error(`RPC ${rpcUrl} failed:`, err.message);
      continue;
    }
  }

  return res.status(502).json({ 
    jsonrpc: '2.0', 
    error: { code: -32000, message: 'All RPC endpoints failed' }, 
    id: rpcBody.id 
  });
}
