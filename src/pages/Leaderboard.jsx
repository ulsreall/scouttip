import React, { useState } from 'react';
import { scouts } from '../data/mockData';
import TipModal from '../components/TipModal';

const Leaderboard = () => {
  const [tipTarget, setTipTarget] = useState(null);
  const [sortBy, setSortBy] = useState('tips');

  const sorted = [...scouts].sort((a, b) => b[sortBy] - a[sortBy]);

  const getBadgeColor = (badge) => {
    if (badge.includes('Diamond')) return 'badge-cyan';
    if (badge.includes('Gold')) return 'badge-orange';
    if (badge.includes('Silver')) return 'badge-purple';
    return 'badge-green';
  };

  const getRankEmoji = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  };

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-grid">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">🏆 Scout Leaderboard</h1>
        <p className="text-gray-400 mb-6">Top Web3 scouts ranked by tips earned and reputation</p>

        {/* Sort */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'tips', label: '💰 Tips Earned' },
            { key: 'reputation', label: '⭐ Reputation' },
            { key: 'finds', label: '🔍 Total Finds' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setSortBy(s.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === s.key
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/20'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {sorted.slice(0, 3).map((scout, i) => {
            const medals = [1, 0, 2]; // display order: 2nd, 1st, 3rd
            const idx = medals[i];
            const s = sorted[idx];
            return (
              <div
                key={s.id}
                className={`glass-card p-5 text-center ${i === 0 ? 'md:-mt-4 md:pb-8' : ''}`}
                style={i === 0 ? { border: '1px solid rgba(249,115,22,0.4)', boxShadow: '0 0 30px rgba(249,115,22,0.15)' } : {}}
              >
                <div className="text-3xl mb-2">{getRankEmoji(idx)}</div>
                <div className="text-4xl mb-2">{s.avatar}</div>
                <h3 className="font-bold text-white text-sm mb-1">{s.name}</h3>
                <span className={`badge text-xs ${getBadgeColor(s.badge)}`}>{s.badge}</span>
                <div className="mt-3 text-lg font-bold gradient-text-warm">
                  {sortBy === 'tips' ? `${s.tips.toLocaleString()} 💸` :
                   sortBy === 'reputation' ? `${s.reputation} ⭐` :
                   `${s.finds} 🔍`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full List */}
        <div className="space-y-2">
          {sorted.map((scout, i) => (
            <div key={scout.id} className="glass-card p-4 flex items-center gap-4 hover:border-purple-500/30 transition-all">
              <span className="text-lg font-bold text-gray-500 w-8 text-center">{i + 1}</span>
              <span className="text-2xl">{scout.avatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{scout.name}</span>
                  <span className={`badge text-xs ${getBadgeColor(scout.badge)}`}>{scout.badge}</span>
                </div>
                <span className="text-xs text-gray-500">{scout.address}</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="text-orange-400 font-semibold">{scout.tips.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">tips</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">{scout.reputation}</div>
                  <div className="text-xs text-gray-500">rep</div>
                </div>
                <div className="text-center">
                  <div className="text-cyan-400 font-semibold">{scout.finds}</div>
                  <div className="text-xs text-gray-500">finds</div>
                </div>
              </div>
              <button onClick={() => setTipTarget(scout)} className="btn-tip text-sm px-4 py-2">
                Tip
              </button>
            </div>
          ))}
        </div>
      </div>

      <TipModal isOpen={!!tipTarget} onClose={() => setTipTarget(null)} recipient={tipTarget} />
    </div>
  );
};

export default Leaderboard;