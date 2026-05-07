import React from 'react';
import RiskChecker from '../components/RiskChecker';

const RiskCheck = () => {
  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-grid">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">🛡️ AI Risk Checker</h1>
          <p className="text-gray-400">
            Powered by AI analysis of on-chain data, smart contracts, and social signals.
            Check any Solana project before you connect, tip, or invest.
          </p>
        </div>

        <RiskChecker />

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: '🔗', title: 'On-Chain Analysis', desc: 'Verify contracts, check mint authority, analyze holder distribution' },
            { icon: '📱', title: 'Social Signals', desc: 'Detect fake followers, check community activity, verify official links' },
            { icon: '💧', title: 'Liquidity Check', desc: 'Verify liquidity lock status, check pool depth, analyze trading patterns' },
          ].map((info, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <div className="text-2xl mb-3">{info.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{info.title}</h3>
              <p className="text-xs text-gray-400">{info.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskCheck;