import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

const TipModal = ({ isOpen, onClose, recipient }) => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!amount || !connected || !publicKey) return;
    setSending(true);
    setError('');

    try {
      const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
      const toPubkey = new PublicKey(recipient?.address || '11111111111111111111111111111111');

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setAmount('');
        setMessage('');
        setTxSignature('');
        onClose();
      }, 4000);
    } catch (err) {
      console.error('Tip failed:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const presetAmounts = [0.01, 0.05, 0.1, 0.5];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="glass-card p-6 w-full max-w-md" style={{ border: '1px solid rgba(249,115,22,0.3)' }}>
        {sent ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">{'\u{1F389}'}</div>
            <h3 className="text-xl font-bold gradient-text-warm mb-2">Tip Sent!</h3>
            <p className="text-gray-400">{amount} SOL {'\u2192'} {recipient?.name}</p>
            {txSignature && (
              <a
                href={`https://solscan.io/tx/${txSignature}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 mt-2 block"
              >
                View on Solscan {'\u2197'}
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Send Tip {'\u{1F525}'}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">{'\u2715'}</button>
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.1)' }}>
              <span className="text-2xl">{recipient?.avatar}</span>
              <div>
                <p className="font-semibold text-white">{recipient?.name}</p>
                <p className="text-xs text-gray-400">{recipient?.address}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Amount (SOL)</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetAmounts.map(a => (
                  <button
                    key={a}
                    onClick={() => setAmount(a.toString())}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                      amount === a.toString()
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-orange-500/30'
                    }`}
                  >
                    {a} SOL
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Custom amount..."
                className="input-dark"
                step="0.01"
                min="0"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Message (optional)</label>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Great alpha! {'\u{1F525}'}"
                className="input-dark"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {!connected ? (
              <p className="text-center text-red-400 text-sm">Connect your wallet to send tips</p>
            ) : (
              <button
                onClick={handleSend}
                disabled={!amount || sending || parseFloat(amount) <= 0}
                className="btn-tip w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? '... Sending...' : `Send ${amount || '0'} SOL`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TipModal;
