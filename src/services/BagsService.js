import { Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

const BAGS_API_BASE = 'https://public-api-v2.bags.fm/api/v1';
const SOL_MINT = 'So11111111111111111111111111111111';

const apiKey = import.meta.env.VITE_BAGS_API_KEY || '';

async function bagsFetch(endpoint, options = {}) {
  const url = `${BAGS_API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bags API error ${res.status}: ${text}`);
  }
  return res.json();
}

/**
 * Fetch trending tokens from Bags feed
 */
export async function getTokenFeed(limit = 20) {
  const data = await bagsFetch(`/token-launch/feed?limit=${limit}`);
  return data;
}

/**
 * Get a swap quote for buying/selling tokens
 */
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

/**
 * Create a swap transaction (buy or sell)
 */
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

/**
 * Build token metadata (step 1 of token create flow)
 */
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

/**
 * Create fee share config (step 2 of token create flow)
 */
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

/**
 * Create launch transaction (step 3 of token create flow)
 */
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

/**
 * Full token launch flow (combines steps 1-3)
 * Returns the transaction to sign
 */
export async function fullTokenLaunch({ name, symbol, description, imageUrl, creatorPubkey, initialBuySOL = 0.01 }) {
  // Step 1: Create token info + metadata
  const tokenInfo = await createTokenInfo({ name, symbol, description, imageUrl });

  // Step 2: Create fee share config (creator gets 100%)
  const feeConfig = await createFeeShareConfig({
    payer: creatorPubkey,
    baseMint: tokenInfo.tokenMint,
    feeClaimers: [{ user: creatorPubkey, userBps: 10000 }],
  });

  // Step 3: Create launch transaction
  const launchTx = await createLaunchTransaction({
    metadataUrl: tokenInfo.tokenMetadata,
    tokenMint: tokenInfo.tokenMint,
    launchWallet: creatorPubkey,
    initialBuyLamports: Math.floor(initialBuySOL * LAMPORTS_PER_SOL),
    configKey: feeConfig.meteoraConfigKey,
  });

  return {
    transaction: launchTx.transaction,
    tokenMint: tokenInfo.tokenMint,
    metadata: tokenInfo,
  };
}

/**
 * Get lifetime fees for a token
 */
export async function getLifetimeFees(tokenMint) {
  const data = await bagsFetch(`/token-launch/lifetime-fees?tokenMint=${tokenMint}`);
  return data;
}

/**
 * Get claimable positions
 */
export async function getClaimablePositions(wallet) {
  const data = await bagsFetch(`/token-launch/claimable-positions?wallet=${wallet}`);
  return data;
}

export { SOL_MINT, BAGS_API_BASE, apiKey };
