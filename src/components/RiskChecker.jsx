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
          <p className="text-gray-400">Analyzing on-chain data via Solscan...</p>
        </div>
      )}

      {result && !checking && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: `${result.color}15`, border: `1px solid ${result.color}40` }}>
            <span className="text-4xl">{result.icon}</span>
            <div>
              <h3 className="text-xl font-bold" style={{ color: result.color }}>{result.label}</h3>
              <p className="text-gray-400">Risk Score: {result.score}/100</p>
            </div>
            <div className="ml-auto">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: `${result.color}20`, color: result.color, border: `3px solid ${result.color}60` }}>
                {result.score}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {result.details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span style={{ color: result.color }}>{'\u2022'}</span> {detail}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-sm text-purple-300"><strong>AI Recommendation:</strong> {result.recommendation}</p>
          </div>

          <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
            <p className="text-xs text-cyan-400">
              Data powered by Solscan API | Token: {input.slice(0, 8)}...{input.slice(-6)}
            </p>
          </div>
        </div>
      )}

      {!result && !checking && !error && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">{'\u{1F50D}'}</div>
          <p>Enter a Solana token address above to start the risk analysis</p>
          <p className="text-xs mt-2 text-gray-600">Powered by Solscan on-chain data</p>
        </div>
      )}
    </div>
  );
};

export default RiskChecker;
