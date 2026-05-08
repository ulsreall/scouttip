import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

const NETWORK = 'mainnet-beta';
let connection = null;

export function getConnection() {
  if (!connection) {
    connection = new Connection(clusterApiUrl(NETWORK), 'confirmed');
  }
  return connection;
}

/**
 * Get SOL balance for a wallet
 */
export async function getBalance(walletAddress) {
  const conn = getConnection();
  const pubkey = new PublicKey(walletAddress);
  const lamports = await conn.getBalance(pubkey);
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Build a tip transaction (SOL transfer)
 * Returns unsigned Transaction for wallet adapter to sign
 */
export async function buildTipTransaction(fromPubkey, toAddress, amountSOL) {
  const conn = getConnection();
  const toPubkey = new PublicKey(toAddress);
  const lamports = Math.floor(amountSOL * LAMPORTS_PER_SOL);

  const transaction = new Transaction();
  transaction.add(
    SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports,
    })
  );

  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  transaction.feePayer = fromPubkey;

  return transaction;
}

/**
 * Send a signed transaction and confirm
 */
export async function sendAndConfirmTransaction(signedTransaction) {
  const conn = getConnection();
  const signature = await conn.sendRawTransaction(signedTransaction.serialize());
  await conn.confirmTransaction(signature, 'confirmed');
  return signature;
}

/**
 * Get recent transaction signatures for a wallet
 */
export async function getRecentTransactions(walletAddress, limit = 10) {
  const conn = getConnection();
  const pubkey = new PublicKey(walletAddress);
  const signatures = await conn.getSignaturesForAddress(pubkey, { limit });
  return signatures.map(sig => ({
    signature: sig.signature,
    slot: sig.slot,
    timestamp: sig.blockTime,
    status: sig.err ? 'failed' : 'confirmed',
  }));
}

export { LAMPORTS_PER_SOL, PublicKey, NETWORK };
