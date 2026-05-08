import React, { useState } from 'react';
import { analyzeTokenRisk } from '../services/SolscanService';

const RiskChecker = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!input.trim()) return;
    setChecking(true);
    setError('');
    setResult(null);

    try {
      const risk = await analyzeTokenRisk(input.trim());
      setResult(risk);
    } catch (err) {
      setError('Failed to analyze. Make sure you entered a valid Solana token address.');
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-2">{'\u{1F6E1}'} AI Risk Checker</h2>
      <p className="text-gray-400 mb-6">Enter a Solana token address to check its safety score via on-chain analysis</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
          placeholder="Enter Solana token mint address..."
          className="input-dark flex-1"
        />
        <button onClick={handleCheck} disabled={checking || !input.trim()} className="btn-primary disabled:opacity-50 whitespace-nowrap">
          {checking ? '...' : 'Check'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {checking && (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Analyzing on-chain data via Solana RPC...</p>
          <p className="text-xs text-gray-600 mt-2">Checking mint info, holders, Bags listing...</p>
        </div>
      )}

      {result && !checking && (
        <div className="space-y-4">
          {/* Risk Score Header */}
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: `${result.color}15`, border: `1px solid ${result.color}40` }}>
            <span className="text-4xl">{result.icon}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ color: result.color }}>{result.label}</h3>
              {result.tokenName && (
                <p className="text-sm text-gray-400">{result.tokenName} {result.tokenSymbol ? `($${result.tokenSymbol})` : ''}</p>
              )}
              <p className="text-gray-400">Risk Score: {result.score}/100</p>
            </div>
            <div className="ml-auto">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: `${result.color}20`, color: result.color, border: `3px solid ${result.color}60` }}>
                {result.score}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            {result.details.map((detail, i) => {
              if (detail === '') return <div key={i} className="my-2 border-t border-white/5" />;
              if (detail.startsWith('---')) {
                return <p key={i} className="text-xs font-semibold text-green-400 uppercase tracking-wider mt-3 mb-1">{detail.replace(/---/g, '').trim()}</p>;
              }
              const isWarning = detail.startsWith('⚠️') || detail.startsWith('🚨');
              const isPositive = detail.startsWith('✅');
              return (
                <div key={i} className="flex items-start gap-2 text-sm" style={{ color: isWarning ? '#fbbf24' : isPositive ? '#4ade80' : '#d1d5db' }}>
                  {detail}
                </div>
              );
            })}
          </div>

          {/* Recommendation */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-sm text-purple-300"><strong>AI Recommendation:</strong> {result.recommendation}</p>
          </div>

          {/* Footer */}
          <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <p className="text-xs text-cyan-400">
              Data powered by Solana RPC + Bags API | Token: {input.slice(0, 8)}...{input.slice(-6)}
            </p>
          </div>
        </div>
      )}

      {!result && !checking && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">{'\u{1F50D}'}</div>
          <p>Enter a Solana token address above to start the risk analysis</p>
          <p className="text-xs mt-2 text-gray-600">Powered by Solana RPC + Bags API on-chain data</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-600">
            <span className="px-2 py-1 rounded-lg bg-white/5">Mint Authority</span>
            <span className="px-2 py-1 rounded-lg bg-white/5">Freeze Authority</span>
            <span className="px-2 py-1 rounded-lg bg-white/5">Holder Distribution</span>
            <span className="px-2 py-1 rounded-lg bg-white/5">Bags Listing</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskChecker;
