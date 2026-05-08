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

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setLoadingFeed(true);
    try {
      const feed = await getTokenFeed(20);
      if (feed && Array.isArray(feed)) {
        setBagTokens(feed.map(t => ({
          name: t.name || 'Unknown',
          symbol: t.symbol || '???',
          description: t.description || '',
          mint: t.tokenMint || '',
          image: t.image || '',
          twitter: t.twitter || '',
          website: t.website || '',
          status: t.status || 'PRE_GRAD',
        })));
      }
    } catch (err) {
      console.warn('Failed to load Bags feed:', err);
    } finally {
      setLoadingFeed(false);
    }
  };

  const handleLaunch = async () => {
    if (!tokenName || !tokenSymbol || !connected || !publicKey) return;
    setLaunching(true);
    setLaunchError('');

    try {
      const result = await fullTokenLaunch({
        name: tokenName,
        symbol: tokenSymbol,
        description: tokenDesc || `${tokenName} community token on Solana`,
        creatorPubkey: publicKey,
        initialBuySOL: 0.01,
      });

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
        <p className="text-gray-400 mb-6">Live tokens from Bags API on Solana</p>

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
          <div className="space-y-3">
            {loadingFeed ? (
              <div className="text-center py-12">
                <div className="inline-block w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400">Loading live tokens from Bags API...</p>
              </div>
            ) : bagTokens.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No tokens loaded. Check API key configuration.</p>
              </div>
            ) : (
              bagTokens.map((token, i) => (
                <div key={i} className="glass-card p-4 hover:border-purple-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {token.image ? (
                        <img src={token.image} alt={token.symbol} className="w-full h-full object-cover rounded-xl" onError={e => { e.target.style.display='none'; }} />
                      ) : (
                        <span className="text-lg font-bold text-purple-400">{token.symbol[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-white">{token.name}</h3>
                        <span className="text-xs text-gray-500">${token.symbol}</span>
                        <span className={`badge text-xs ${
                          token.status === 'GRADUATED' ? 'badge-green' :
                          token.status === 'PRE_GRAD' ? 'badge-cyan' : 'badge-purple'
                        }`}>
                          {token.status === 'PRE_GRAD' ? 'New' : token.status}
                        </span>
                      </div>
                      {token.description && (
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{token.description.slice(0, 120)}{token.description.length > 120 ? '...' : ''}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                        <span className="font-mono">{token.mint.slice(0, 6)}...{token.mint.slice(-4)}</span>
                        {token.twitter && (
                          <a href={token.twitter} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">X {'\u2197'}</a>
                        )}
                        {token.website && (
                          <a href={token.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">Web {'\u2197'}</a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <a
                        href={`https://bags.fm/${token.mint}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary text-xs px-4 py-2 text-center"
                      >
                        View on Bags
                      </a>
                      <a
                        href={`https://solscan.io/token/${token.mint}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary text-xs px-4 py-2 text-center"
                      >
                        Solscan
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="text-center pt-4">
              <button onClick={loadFeed} className="btn-secondary text-sm">
                {'\u{1F504}'} Refresh Feed
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Powered by Bags API | {bagTokens.length} tokens loaded
              </p>
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
                <a href="https://bags.fm" target="_blank" rel="noreferrer" className="text-sm text-purple-400 hover:text-purple-300 mt-2 inline-block">
                  View on Bags {'\u2197'}
                </a>
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

export default Tokens;
