import React, { useState } from 'react';
import { communityTokens } from '../data/mockData';

const Tokens = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDesc, setTokenDesc] = useState('');
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);

  const handleLaunch = async () => {
    if (!tokenName || !tokenSymbol) return;
    setLaunching(true);
    await new Promise(r => setTimeout(r, 3000));
    setLaunching(false);
    setLaunched(true);
    setTimeout(() => {
      setLaunched(false);
      setTokenName('');
      setTokenSymbol('');
      setTokenDesc('');
    }, 3000);
  };

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-grid">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">🪙 Community Tokens</h1>
        <p className="text-gray-400 mb-6">Launch and trade community tokens powered by Bags API</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'explore', label: '🔍 Explore' },
            { key: 'launch', label: '🚀 Launch Token' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.key
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/20'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'explore' && (
          <div className="space-y-4">
            {communityTokens.map((token, i) => (
              <div key={i} className="glass-card p-5 hover:border-purple-500/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-400">
                      {token.symbol[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{token.name}</h3>
                      <span className="text-xs text-gray-400">${token.symbol}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Price</div>
                      <div className="text-white font-semibold">{token.price}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">24h</div>
                      <div className={`font-semibold ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Market Cap</div>
                      <div className="text-white font-semibold">{token.marketCap}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Volume</div>
                      <div className="text-white font-semibold">{token.volume}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary text-xs px-4 py-2">Buy</button>
                    <button className="btn-tip text-xs px-4 py-2">Tip</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'launch' && (
          <div className="glass-card p-6 md:p-8 max-w-lg mx-auto">
            {launched ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold gradient-text mb-2">Token Launched!</h3>
                <p className="text-gray-400">Your token is now live on Bags.fm</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="text-xl font-bold text-white">Launch Your Token</h3>
                  <p className="text-sm text-gray-400 mt-1">Create a community token via Bags API on Solana</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Token Name</label>
                    <input
                      type="text" value={tokenName} onChange={e => setTokenName(e.target.value)}
                      placeholder="ScoutToken" className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Symbol</label>
                    <input
                      type="text" value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value.toUpperCase())}
                      placeholder="SCOUT" className="input-dark" maxLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea
                      value={tokenDesc} onChange={e => setTokenDesc(e.target.value)}
                      placeholder="Community token for rewarding Web3 scouts..."
                      className="input-dark resize-none" rows={3}
                    />
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                    <p className="text-xs text-purple-300">
                      💡 Token will be created via <strong>Bags API</strong> on Solana mainnet.
                      Creator earns 1% from every trade. You can use this token for tipping, rewards, or community governance.
                    </p>
                  </div>
                  <button
                    onClick={handleLaunch}
                    disabled={!tokenName || !tokenSymbol || launching}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {launching ? '⏳ Launching on Solana...' : '🚀 Launch Token via Bags API'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tokens;