import React, { useState } from 'react';

const RiskChecker = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const mockRiskCheck = async (query) => {
    setChecking(true);
    await new Promise(r => setTimeout(r, 2500));

    const risks = [
      { level: 'low', score: 15, label: 'Low Risk', color: '#22c55e', icon: '✅',
        details: ['Contract verified on Solscan', 'No suspicious mint functions', 'Liquidity locked for 6 months', 'Active development (12 commits this week)'],
        recommendation: 'Looks safe to interact with. Always DYOR and start with small amounts.' },
      { level: 'medium', score: 55, label: 'Medium Risk', color: '#f97316', icon: '⚠️',
        details: ['Contract verified but has upgrade authority', 'Concentrated token holdings (top 10 own 65%)', 'Social media activity seems organic', 'No audit found'],
        recommendation: 'Proceed with caution. Consider limiting exposure and monitoring closely.' },
      { level: 'high', score: 85, label: 'High Risk', color: '#ef4444', icon: '🚨',
        details: ['Unverified smart contract', 'Hidden mint authority detected', 'Fake social media followers (78% bots)', 'Similar pattern to known rug pulls', 'Liquidity NOT locked'],
        recommendation: 'Do NOT interact. Multiple red flags detected. Report to the community.' },
    ];

    setResult(risks[Math.floor(Math.random() * risks.length)]);
    setChecking(false);
  };

  const handleCheck = () => {
    if (!input.trim()) return;
    mockRiskCheck(input);
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-2">🛡️ AI Risk Checker</h2>
      <p className="text-gray-400 mb-6">Enter a token address, project name, or URL to check its safety score</p>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCheck()}
          placeholder="Enter token address, project name, or URL..."
          className="input-dark flex-1"
        />
        <button onClick={handleCheck} disabled={checking || !input.trim()} className="btn-primary disabled:opacity-50 whitespace-nowrap">
          {checking ? '⏳ Checking...' : '🔍 Check'}
        </button>
      </div>

      {checking && (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Analyzing on-chain data & social signals...</p>
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
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span style={{ color: result.color }}>•</span> {detail}
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-sm text-purple-300"><strong>AI Recommendation:</strong> {result.recommendation}</p>
          </div>
        </div>
      )}

      {!result && !checking && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Enter a project above to start the risk analysis</p>
        </div>
      )}
    </div>
  );
};

export default RiskChecker;