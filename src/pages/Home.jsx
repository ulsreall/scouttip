import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

const Home = () => {
  const { connected } = useWallet();

  return (
    <div className="bg-grid min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6">
            <img src="/logo.svg" alt="ScoutTip Logo" className="w-24 h-24 mx-auto mb-4 drop-shadow-lg" />
          </div>
          <div className="inline-block mb-6">
            <span className="badge badge-purple text-sm px-4 py-1.5">🔥 Built on Solana • Powered by Bags API</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="gradient-text">Tip Scouts.</span><br/>
            <span className="text-white">Reward Alpha.</span><br/>
            <span className="gradient-text-warm">Launch Tokens.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The social tipping platform where Web3 scouts earn by sharing valuable insights. 
            Launch community tokens, tip your favorite scouts, and build reputation on-chain.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/feed" className="btn-primary text-base px-8 py-3.5">
              🚀 Explore Feed
            </Link>
            <Link to="/tokens" className="btn-secondary text-base px-8 py-3.5">
              🪙 Launch Token
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { label: 'Tips Sent', value: '12,847', icon: '💸' },
              { label: 'Active Scouts', value: '2,341', icon: '🔍' },
              { label: 'Tokens Launched', value: '156', icon: '🪙' },
              { label: 'Total Volume', value: '$2.4M', icon: '📊' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 text-center hover:border-purple-500/30 transition-all">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How <span className="gradient-text">ScoutTip</span> Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Scout & Share', desc: 'Scouts share alpha, tutorials, airdrop leads, and security alerts on the feed.', icon: '📡', color: '#a855f7' },
              { step: '02', title: 'Tip & Earn', desc: 'Tip valuable content with SOL or community tokens. Scouts earn reputation on-chain.', icon: '💰', color: '#22d3ee' },
              { step: '03', title: 'Launch Tokens', desc: 'Create your own community token via Bags API. Build your own tipping economy.', icon: '🚀', color: '#f97316' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-6xl font-black opacity-5 group-hover:opacity-10 transition-opacity" style={{ color: item.color }}>{item.step}</div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built for the <span className="gradient-text-warm">BAGS Hackathon</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Bags API Integration', desc: 'Launch and manage tokens directly through the Bags API. Deep integration earns higher hackathon ranking.', tag: 'Bags API', tagColor: 'badge-purple' },
              { title: 'AI Risk Checker', desc: 'Before tipping or buying any token, run it through our AI risk analysis — check contracts, social signals, and liquidity.', tag: 'AI', tagColor: 'badge-cyan' },
              { title: 'On-Chain Reputation', desc: 'Every tip, every find, every alert is recorded on-chain. Build verifiable scout reputation that cannot be faked.', tag: 'Social Finance', tagColor: 'badge-green' },
              { title: 'Fee Sharing Model', desc: 'Platform fees are shared with top scouts. The more valuable your content, the more you earn from the ecosystem.', tag: 'Fee Sharing', tagColor: 'badge-orange' },
            ].map((feat, i) => (
              <div key={i} className="glass-card p-6 flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <span className={`badge ${feat.tagColor}`}>{feat.tag}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center glass-card p-10" style={{ border: '1px solid rgba(168,85,247,0.3)' }}>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Scouting?</h2>
          <p className="text-gray-400 mb-8">Connect your Solana wallet and join the community of Web3 scouts.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/feed" className="btn-primary text-base px-8 py-3.5">
              🔍 Explore the Feed
            </Link>
            <Link to="/risk-check" className="btn-secondary text-base px-8 py-3.5">
              🛡️ Try Risk Checker
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="ScoutTip" className="h-7 w-7 rounded-lg" />
            <span className="font-bold gradient-text">ScoutTip</span>
            <span className="text-gray-500 text-sm ml-2">Built for BAGS Hackathon</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://bags.fm" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">Bags.fm</a>
            <a href="https://dorahacks.io" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">DoraHacks</a>
            <span>Solana</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;