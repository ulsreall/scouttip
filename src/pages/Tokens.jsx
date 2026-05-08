import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { getTokenFeed, fullTokenLaunch } from '../services/BagsService';
import { Transaction } from '@solana/web3.js';

const Tokens = () => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [activeTab, setActiveTab] = useState('explore');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDesc, setTokenDesc] = useState('');
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [launchError, setLaunchError] = useState('');
  const [bagTokens, setBagTokens] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);

  // Load real token feed from Bags
  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoadingFeed(true);
    try {
      const feed = await getTokenFeed(10);
      if (feed && Array.isArray(feed)) {
        setBagTokens(feed.map(t => ({
          name: t.name || 'Unknown',
          symbol: t.symbol || '???',
          price: t.price ? `$${parseFloat(t.price).toFixed(6)}` : 'N/A',
          change: t.priceChange ? `${t.priceChange > 0 ? '+' : ''}${t.priceChange.toFixed(1)}%` : 'N/A',
          marketCap: t.marketCap ? formatNumber(t.marketCap) : 'N/A',
          holders: t.holders || 0,
          volume: t.volume24h ? formatNumber(t.volume24h) : 'N/A',
          mint: t.mint || '',
          image: t.image || '',
        })));
      }
    } catch (err) {
      console.warn('Failed to load Bags feed, using fallback data:', err);
      setBagTokens(fallbackTokens);
    } finally {
      setLoadingFeed(false);
    }
  };

  const handleLaunch = async () => {
    if (!tokenName || !tokenSymbol || !connected || !publicKey) return;
    setLaunching(true);
    setLaunchError('');

    try {
      // Real Bags API launch flow
      const result = await fullTokenLaunch({
        name: tokenName,
        symbol: tokenSymbol,
        description: tokenDesc || `${tokenName} community token on Solana`,
        creatorPubkey: publicKey,
        initialBuySOL: 0.01,
      });

      // Deserialize and sign the transaction
      const tx = Transaction.from(Buffer.from(result.transaction, 'base64'));
      const signature = await sendTransaction(tx, connection);

      console.log('Token launched! TX:', signature, 'Mint:', result.tokenMint);
      setLaunched(true);
      setTimeout(() => {
        setLaunched(false);
        setTokenName('');
        setTokenSymbol('');
        setTokenDesc('');
      }, 5000);
    } catch (err) {
      console.error('Launch failed:', err);
      setLaunchError(err.message || 'Failed to launch token. Please try again.');
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-grid">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">{'\u{1FA99}'} Community Tokens</h1>
        <p className="text-gray-400 mb-6">Launch and trade community tokens powered by Bags API on Solana</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'explore', label: '\u{1F50D} Explore' },
            { key: 'launch', label: '\u{1F680} Launch Token' },
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
            {loadingFeed ? (
              <div className="text-center py-12">
                <div className="inline-block w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading tokens from Bags...</p>
              </div>
            ) : (
              bagTokens.map((token, i) => (
                <div key={i} className="glass-card p-5 hover:border-purple-500/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg font-bold text-purple-400 overflow-hidden">
                        {token.image ? (
                          <img src={token.image} alt={token.symbol} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          token.symbol[0]
                        )}
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
                        <div className={`font-semibold ${
                          token.change.startsWith('+') ? 'text-green-400' :
                          token.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                        }`}>
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
                      {token.mint && (
                        <a
                          href={`https://bags.fm/${token.mint}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary text-xs px-4 py-2"
                        >
                          Trade
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="text-center pt-4">
              <button onClick={loadFeed} className="btn-secondary text-sm">
                {'\u{1F504}'} Refresh Feed
              </button>
            </div>
          </div>
        )}

        {activeTab === 'launch' && (
          <div className="glass-card p-6 md:p-8 max-w-lg mx-auto">
            {launched ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">{'\u{1F389}'}</div>
                <h3 className="text-xl font-bold gradient-text mb-2">Token Launched!</h3>
                <p className="text-gray-400">Your token is now live on Solana via Bags</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">{'\u{1F680}'}</div>
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
                      {'\u{1F4A1}'} Token will be created via <strong>Bags API</strong> on Solana mainnet.
                      Creator earns from trading fees. Fee sharing with community members supported.
                    </p>
                  </div>

                  {launchError && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <p className="text-xs text-red-400">{launchError}</p>
                    </div>
                  )}

                  {!connected ? (
                    <p className="text-center text-red-400 text-sm py-2">Connect your Solana wallet to launch</p>
                  ) : (
                    <button
                      onClick={handleLaunch}
                      disabled={!tokenName || !tokenSymbol || launching}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {launching ? '... Launching on Solana...' : '\u{1F680} Launch Token via Bags API'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function formatNumber(n) {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
}

const fallbackTokens = [
  { name: "ScoutToken", symbol: "SCOUT", price: "$0.042", change: "+12.5%", marketCap: "$420K", holders: 1247, volume: "$89K", mint: "", image: "" },
  { name: "AlphaCoin", symbol: "ALPHA", price: "$0.018", change: "+8.3%", marketCap: "$180K", holders: 856, volume: "$45K", mint: "", image: "" },
  { name: "HuntToken", symbol: "HUNT", price: "$0.007", change: "-3.2%", marketCap: "$70K", holders: 432, volume: "$12K", mint: "", image: "" },
  { name: "RadarCoin", symbol: "RADAR", price: "$0.031", change: "+22.1%", marketCap: "$310K", holders: 923, volume: "$67K", mint: "", image: "" },
];

export default Tokens;
