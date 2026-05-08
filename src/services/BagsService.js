import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';
const SOL_MINT = 'So11111111111111111111111111111111';

// Use proxy in production to avoid CORS, direct API in development
const isProd = import.meta.env.PROD;

const apiKey = import.meta.env.VITE_BAGS_API_KEY || '';

async function bagsFetch(endpoint, options = {}) {
  let url, headers;

  if (isProd) {
    // Production: use Vercel serverless proxy
    const pathParam = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    url = `/api/proxy?_path=${encodeURIComponent(pathParam)}`;
    headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  } else {
    // Development: direct API call
    url = `${BAGS_API_BASE}${endpoint}`;
    headers = {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
      ...options.headers,
    };
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bags API error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getTokenFeed(limit = 20) {
  const data = await bagsFetch('/token-launch/feed');
  return data?.success ? data.response : data;
}

export async function getQuote(inputMint, outputMint, amountLamports) {
  const params = new URLSearchParams({
    inputMint,
    outputMint,
    amount: String(amountLamports),
    slippageMode: 'auto',
  });
  const data = await bagsFetch(`/trade/quote?${params}`);
  return data;
}

export async function createSwapTransaction(quoteResponse, userPublicKey) {
  const data = await bagsFetch('/trade/swap', {
    method: 'POST',
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: typeof userPublicKey === 'string' ? userPublicKey : userPublicKey.toBase58(),
    }),
  });
  return data;
}

export async function createTokenInfo({ name, symbol, description, imageUrl }) {
  const data = await bagsFetch('/token-launch/create-token-info', {
    method: 'POST',
    body: JSON.stringify({
      name,
      symbol: symbol.toUpperCase(),
      description,
      imageUrl: imageUrl || `https://placehold.co/400x400/7c3aed/ffffff?text=${symbol.toUpperCase()}`,
    }),
  });
  return data;
}

export async function createFeeShareConfig({ payer, baseMint, feeClaimers }) {
  const data = await bagsFetch('/fee-share/config', {
    method: 'POST',
    body: JSON.stringify({
      payer: typeof payer === 'string' ? payer : payer.toBase58(),
      baseMint: typeof baseMint === 'string' ? baseMint : baseMint.toBase58(),
      feeClaimers: feeClaimers.map(c => ({
        user: typeof c.user === 'string' ? c.user : c.user.toBase58(),
        userBps: c.userBps,
      })),
    }),
  });
  return data;
}

export async function createLaunchTransaction({ metadataUrl, tokenMint, launchWallet, initialBuyLamports, configKey }) {
  const data = await bagsFetch('/token-launch/create-launch-transaction', {
    method: 'POST',
    body: JSON.stringify({
      metadataUrl,
      tokenMint: typeof tokenMint === 'string' ? tokenMint : tokenMint.toBase58(),
      launchWallet: typeof launchWallet === 'string' ? launchWallet : launchWallet.toBase58(),
      initialBuyLamports,
      configKey,
    }),
  });
  return data;
}

export async function fullTokenLaunch({ name, symbol, description, imageUrl, creatorPubkey, initialBuySOL = 0.01 }) {
  const tokenInfo = await createTokenInfo({ name, symbol, description, imageUrl });

  const feeConfig = await createFeeShareConfig({
    payer: creatorPubkey,
    baseMint: tokenInfo.response?.tokenMint || tokenInfo.tokenMint,
    feeClaimers: [{ user: creatorPubkey, userBps: 10000 }],
  });

  const tokenMint = tokenInfo.response?.tokenMint || tokenInfo.tokenMint;
  const metadataUrl = tokenInfo.response?.tokenMetadata || tokenInfo.tokenMetadata;
  const configKey = feeConfig.response?.meteoraConfigKey || feeConfig.meteoraConfigKey;

  const launchTx = await createLaunchTransaction({
    metadataUrl,
    tokenMint,
    launchWallet: creatorPubkey,
    initialBuyLamports: Math.floor(initialBuySOL * LAMPORTS_PER_SOL),
    configKey,
  });

  return {
    transaction: launchTx.response?.transaction || launchTx.transaction,
    tokenMint,
    metadata: tokenInfo.response || tokenInfo,
  };
}

export async function getLifetimeFees(tokenMint) {
  const data = await bagsFetch(`/token-launch/lifetime-fees?tokenMint=${tokenMint}`);
  return data;
}

export async function getClaimablePositions(wallet) {
  const data = await bagsFetch(`/token-launch/claimable-positions?wallet=${wallet}`);
  return data;
}

export { SOL_MINT, BAGS_API_BASE };
