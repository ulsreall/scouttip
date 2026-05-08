// Solana on-chain Risk Checker
// Uses Solana RPC (via proxy in prod) + Bags API

import { getTokenFeed } from './BagsService';

const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const isProd = import.meta.env.PROD;

async function rpcCall(method, params) {
  const rpcBody = { jsonrpc: '2.0', id: 1, method, params };

  const url = isProd ? '/api/solana' : SOLANA_RPC;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rpcBody),
  });

  if (!res.ok) throw new Error(`RPC error ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

/**
 * Get SPL token mint info via Solana RPC
 */
async function getMintInfo(mintAddress) {
  try {
    const result = await rpcCall('getAccountInfo', [
      mintAddress,
      { encoding: 'jsonParsed' },
    ]);
    if (!result?.value) return null;
    const parsed = result.value.data?.parsed;
    if (!parsed || parsed.type !== 'mint') return null;
    return {
      ...parsed.info,
      lamports: result.value.lamports,
      owner: result.value.owner,
    };
  } catch {
    return null;
  }
}

/**
 * Get largest token holders
 */
async function getLargestHolders(mintAddress) {
  try {
    const result = await rpcCall('getTokenLargestAccounts', [mintAddress]);
    return result?.value || [];
  } catch {
    return [];
  }
}

/**
 * Get token supply
 */
async function getSupply(mintAddress) {
  try {
    const result = await rpcCall('getTokenSupply', [mintAddress]);
    return result?.value || null;
  } catch {
    return null;
  }
}

/**
 * Check if token exists on Bags feed
 */
async function checkBagsListing(mintAddress) {
  try {
    const feed = await getTokenFeed();
    if (!Array.isArray(feed)) return null;
    const found = feed.find(t => t.tokenMint === mintAddress);
    return found || null;
  } catch {
    return null;
  }
}

/**
 * Full risk analysis
 */
export async function analyzeTokenRisk(tokenAddress) {
  const address = tokenAddress.trim();

  // Validate base58 format roughly
  if (!address || address.length < 32 || address.length > 44) {
    return {
      score: 95,
      level: 'critical',
      label: 'Invalid Address',
      color: '#ef4444',
      icon: '❌',
      details: ['Invalid Solana address format', 'Address must be 32-44 base58 characters'],
      recommendation: 'Please enter a valid Solana token mint address.',
    };
  }

  // Fetch all data in parallel
  const [mintInfo, supplyInfo, largestHolders, bagsToken] = await Promise.all([
    getMintInfo(address),
    getSupply(address),
    getLargestHolders(address),
    checkBagsListing(address),
  ]);

  // If no mint info, token doesn't exist as SPL token
  if (!mintInfo && !supplyInfo) {
    return {
      score: 90,
      level: 'high',
      label: 'High Risk',
      color: '#ef4444',
      icon: '🚨',
      details: [
        'Token mint not found on Solana mainnet',
        'Cannot verify contract — may not be a valid SPL token',
        'Could be a new token, wrong address, or scam',
      ],
      recommendation: 'Token not found on-chain. Do NOT interact until you can verify the correct mint address.',
    };
  }

  let score = 0;
  const flags = [];
  const positives = [];

  const supply = supplyInfo ? parseFloat(supplyInfo.uiAmountString || '0') : 0;
  const decimals = supplyInfo?.decimals ?? mintInfo?.decimals ?? 0;

  // --- MINT AUTHORITY CHECK ---
  if (mintInfo?.mintAuthority) {
    score += 25;
    flags.push(`⚠️ Mint authority is ACTIVE (${mintInfo.mintAuthority.slice(0, 8)}...)`);
    flags.push('Creator can mint more tokens at any time → inflation risk');
  } else {
    positives.push('✅ Mint authority is revoked (fixed supply)');
  }

  // --- FREEZE AUTHORITY CHECK ---
  if (mintInfo?.freezeAuthority) {
    score += 15;
    flags.push(`⚠️ Freeze authority exists (${mintInfo.freezeAuthority.slice(0, 8)}...)`);
    flags.push('Creator can freeze token accounts — rug risk');
  } else {
    positives.push('✅ Freeze authority is revoked');
  }

  // --- DECIMALS CHECK ---
  if (decimals === 0) {
    score += 10;
    flags.push('⚠️ 0 decimals — unusual for SPL tokens (possible NFT or test token)');
  } else {
    positives.push(`✅ Standard decimals: ${decimals}`);
  }

  // --- HOLDER CONCENTRATION ---
  if (largestHolders.length > 0 && supply > 0) {
    const topHolderAmount = parseFloat(largestHolders[0]?.uiAmountString || '0');
    const topHolderPct = (topHolderAmount / supply) * 100;

    if (topHolderPct > 80) {
      score += 30;
      flags.push(`🚨 Top holder owns ${topHolderPct.toFixed(1)}% — EXTREMELY concentrated`);
    } else if (topHolderPct > 50) {
      score += 20;
      flags.push(`⚠️ Top holder owns ${topHolderPct.toFixed(1)}% — highly concentrated`);
    } else if (topHolderPct > 30) {
      score += 10;
      flags.push(`⚠️ Top holder owns ${topHolderPct.toFixed(1)}% — somewhat concentrated`);
    } else {
      positives.push(`✅ Top holder owns ${topHolderPct.toFixed(1)}% — well distributed`);
    }

    // Check top 5 holders concentration
    const top5Amount = largestHolders.slice(0, 5).reduce(
      (sum, h) => sum + parseFloat(h.uiAmountString || '0'), 0
    );
    const top5Pct = (top5Amount / supply) * 100;
    if (top5Pct > 90) {
      score += 15;
      flags.push(`🚨 Top 5 holders own ${top5Pct.toFixed(1)}% — almost all supply`);
    } else if (top5Pct > 70) {
      score += 5;
      flags.push(`⚠️ Top 5 holders own ${top5Pct.toFixed(1)}%`);
    } else {
      positives.push(`✅ Top 5 holders own ${top5Pct.toFixed(1)}% — good distribution`);
    }
  }

  // --- BAGS LISTING CHECK ---
  if (bagsToken) {
    score -= 10;
    positives.push(`✅ Listed on Bags feed as "${bagsToken.name}" ($${bagsToken.symbol})`);
    if (bagsToken.twitter) {
      positives.push('✅ Has linked Twitter/X account');
    }
    if (bagsToken.website) {
      positives.push('✅ Has linked website');
    }
    if (bagsToken.status === 'GRAD') {
      positives.push('✅ Graduated from bonding curve');
    }
  } else {
    score += 5;
    flags.push('ℹ️ Not found in Bags token feed (may still be valid)');
  }

  // --- SUPPLY CHECK ---
  if (supply > 0) {
    positives.push(`✅ Total supply: ${supply.toLocaleString()} tokens`);
  }

  // --- ACCOUNT RENT (SOL balance) ---
  if (mintInfo?.lamports) {
    const solBalance = mintInfo.lamports / 1e9;
    if (solBalance > 0.01) {
      positives.push(`✅ Token account has ${solBalance.toFixed(4)} SOL rent`);
    }
  }

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  // Add default messages if empty
  if (flags.length === 0) {
    flags.push('No red flags detected from on-chain analysis');
  }
  if (positives.length === 0) {
    positives.push('Limited positive signals found — exercise caution');
  }

  // Determine risk level
  let level, label, color, icon, recommendation;

  if (score <= 15) {
    level = 'low';
    label = 'Low Risk';
    color = '#22c55e';
    icon = '✅';
    recommendation = 'Token looks safe based on on-chain data. Mint authority revoked, good holder distribution. Always DYOR and start small.';
  } else if (score <= 35) {
    level = 'medium';
    label = 'Medium Risk';
    color = '#eab308';
    icon = '⚠️';
    recommendation = 'Some minor flags detected. Review the details carefully before investing. Limit your exposure.';
  } else if (score <= 60) {
    level = 'high';
    label = 'High Risk';
    color = '#f97316';
    icon = '🔶';
    recommendation = 'Multiple red flags. Proceed with extreme caution. Consider avoiding this token.';
  } else {
    level = 'critical';
    label = 'Critical Risk';
    color = '#ef4444';
    icon = '🚨';
    recommendation = 'Severe red flags detected. Do NOT interact with this token without thorough research. High probability of scam or rug.';
  }

  return {
    score,
    level,
    label,
    color,
    icon,
    details: [...flags, '', '--- Positive Signals ---', ...positives],
    recommendation,
    tokenName: bagsToken?.name || null,
    tokenSymbol: bagsToken?.symbol || null,
  };
}

export { getMintInfo, getLargestHolders, getSupply, checkBagsListing };
