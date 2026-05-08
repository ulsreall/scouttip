const SOLSCAN_API = 'https://public-api-v2.solscan.io/v2';

async function solscanFetch(endpoint) {
  const res = await fetch(`${SOLSCAN_API}${endpoint}`, {
    headers: { 'accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Solscan error ${res.status}`);
  return res.json();
}

/**
 * Get token metadata from Solscan
 */
export async function getTokenMeta(tokenAddress) {
  try {
    const data = await solscanFetch(`/token/meta?token=${tokenAddress}`);
    return data?.data || null;
  } catch {
    return null;
  }
}

/**
 * Get token holders info
 */
export async function getTokenHolders(tokenAddress) {
  try {
    const data = await solscanFetch(`/token/holders?token=${tokenAddress}&limit=10`);
    return data?.data || [];
  } catch {
    return [];
  }
}

/**
 * Analyze token risk (client-side heuristics on Solscan data)
 */
export async function analyzeTokenRisk(tokenAddress) {
  const [meta, holders] = await Promise.all([
    getTokenMeta(tokenAddress),
    getTokenHolders(tokenAddress),
  ]);

  let score = 0;
  const flags = [];

  // Check if token exists / has metadata
  if (!meta) {
    return {
      score: 90,
      level: 'high',
      label: 'High Risk',
      color: '#ef4444',
      icon: '\u{1F6A8}',
      details: ['Token not found on Solscan', 'Cannot verify contract', 'May be a new or suspicious token'],
      recommendation: 'Token not found. Could be very new or fraudulent. Do NOT interact until verified.',
    };
  }

  // Check name/symbol
  if (!meta.name || meta.name === 'Unknown') {
    score += 20;
    flags.push('Token has no verified name');
  }
  if (!meta.symbol || meta.symbol === 'UNKNOWN') {
    score += 15;
    flags.push('Token has no verified symbol');
  }

  // Check holder concentration
  if (holders.length > 0) {
    const topHolderPct = parseFloat(holders[0]?.amount || 0) / (parseFloat(meta.supply || 1) || 1) * 100;
    if (topHolderPct > 50) {
      score += 30;
      flags.push(`Top holder owns ${topHolderPct.toFixed(1)}% of supply (highly concentrated)`);
    } else if (topHolderPct > 30) {
      score += 15;
      flags.push(`Top holder owns ${topHolderPct.toFixed(1)}% of supply`);
    }
  }

  // Check decimals (normal is 6-9 on Solana)
  if (meta.decimals === 0) {
    score += 10;
    flags.push('Token has 0 decimals (unusual for SPL tokens)');
  }

  // Check if there's an icon/logo
  if (!meta.icon) {
    score += 10;
    flags.push('Token has no icon/logo uploaded');
  }

  // Determine level
  let level, label, color, icon, recommendation;
  if (score <= 25) {
    level = 'low';
    label = 'Low Risk';
    color = '#22c55e';
    icon = '\u2705';
    recommendation = 'Token looks reasonably safe based on available data. Always DYOR and start with small amounts.';
  } else if (score <= 55) {
    level = 'medium';
    label = 'Medium Risk';
    color = '#f97316';
    icon = '\u26A0\uFE0F';
    recommendation = 'Some flags detected. Proceed with caution and limit your exposure.';
  } else {
    level = 'high';
    label = 'High Risk';
    color = '#ef4444';
    icon = '\u{1F6A8}';
    recommendation = 'Multiple red flags. Do NOT interact without thorough research.';
  }

  if (flags.length === 0) {
    flags.push('No obvious red flags from on-chain data');
    flags.push('Contract data available on Solscan');
    flags.push('Holder distribution appears reasonable');
  }

  return { score: Math.min(score, 100), level, label, color, icon, details: flags, recommendation };
}

export { SOLSCAN_API };
