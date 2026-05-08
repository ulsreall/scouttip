import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

const STEPS = [
  {
    num: '01',
    icon: '🔍',
    title: 'Scout & Discover',
    desc: 'Browse the live feed of community tokens launching on Solana via Bags API. Find alpha before everyone else.',
    color: '#a855f7',
  },
  {
    num: '02',
    icon: '🛡️',
    title: 'Check Risk First',
    desc: 'Paste any token address → get instant on-chain risk analysis. Check mint authority, holder distribution, and red flags.',
    color: '#22d3ee',
  },
  {
    num: '03',
    icon: '💸',
    title: 'Tip & Earn',
    desc: 'Send SOL tips to scouts who share valuable insights. Every tip is recorded on-chain — build real reputation.',
    color: '#f97316',
  },
  {
    num: '04',
    icon: '🚀',
    title: 'Launch Your Token',
    desc: 'Create your own community token through Bags API in seconds. Set up fee sharing and start building your economy.',
    color: '#22c55e',
  },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Real-Time Token Feed',
    desc: 'Live data from Bags API — see every new token launch on Solana as it happens, with links to X, website, and on-chain explorer.',
    link: '/tokens',
    linkText: 'Explore Tokens',
  },
  {
    icon: '🛡️',
    title: 'On-Chain Risk Analysis',
    desc: 'Instant safety check for any SPL token. Analyzes mint authority, freeze authority, holder concentration, and Bags listing status.',
    link: '/risk-check',
    linkText: 'Try Risk Checker',
  },
  {
    icon: '🤝',
    title: 'Social Tipping',
    desc: 'Connect your Solana wallet and send SOL tips directly to other scouts. Support the people sharing the best alpha.',
    link: '/feed',
    linkText: 'View Feed',
  },
  {
    icon: '🪙',
    title: 'One-Click Token Launch',
    desc: 'Launch a token through Bags API with just a name, symbol, and description. Includes fee sharing config and bonding curve setup.',
    link: '/tokens',
    linkText: 'Launch Token',
  },
];

const Home = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Logo */}
          <img src="/logo.svg" alt="ScoutTip" className="w-20 h-20 mx-auto mb-6 rounded-2xl shadow-lg" />

          {/* Badge */}
          <div className="inline-block mb-5">
            <span className="badge badge-purple text-xs px-3 py-1">Built on Solana • Powered by Bags API</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 leading-tight">
            <span className="gradient-text">Discover. Analyze.</span><br />
            <span className="text-white">Tip. Launch.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
            The all-in-one platform for Solana token scouting.
            Check risk before you buy, tip the best scouts, and launch your own token — all from one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/tokens" className="btn-primary text-sm px-7 py-3">
              🪙 Explore Tokens
            </Link>
            <Link to="/risk-check" className="btn-secondary text-sm px-7 py-3">
              🛡️ Check a Token
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-purple-400 mb-2 font-semibold">Simple Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white">
            How ScoutTip Works
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <div key={i} className="glass-card p-5 relative group hover:border-purple-500/40 transition-all">
                {/* Step number */}
                <div className="absolute top-3 right-4 text-4xl font-black opacity-[0.06]" style={{ color: step.color }}>{step.num}</div>
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3" style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}>
                  {step.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                {/* Connector line (hidden on last card) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest text-cyan-400 mb-2 font-semibold">What You Can Do</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-white">
            Everything You Need in One Platform
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {FEATURES.map((feat, i) => (
              <Link key={i} to={feat.link} className="glass-card p-6 flex gap-4 group hover:border-purple-500/40 transition-all no-underline">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  {feat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-2">{feat.desc}</p>
                  <span className="text-xs text-purple-400 font-medium group-hover:text-purple-300 transition-colors">{feat.linkText} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BAGS HACKATHON HIGHLIGHT ===== */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden" style={{ border: '1px solid rgba(168,85,247,0.25)' }}>
            {/* Decorative gradient */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.05) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              <span className="badge badge-purple text-xs mb-4">BAGS Hackathon</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Deep Bags API Integration</h2>
              <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8 leading-relaxed">
                ScoutTip is built as a full-stack Bags API client — from token feed discovery to fee sharing configuration to one-click launches with bonding curves.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Token Feed', icon: '📡' },
                  { label: 'Launch API', icon: '🚀' },
                  { label: 'Fee Sharing', icon: '💰' },
                  { label: 'Risk Check', icon: '🛡️' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)' }}>
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-xs font-semibold text-gray-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Start Scouting Today</h2>
          <p className="text-sm text-gray-400 mb-8">
            Connect your Solana wallet to tip scouts, launch tokens, and build your on-chain reputation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/feed" className="btn-primary text-sm px-7 py-3">
              🔍 Explore the Feed
            </Link>
            <Link to="/risk-check" className="btn-secondary text-sm px-7 py-3">
              🛡️ Try Risk Checker
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="ScoutTip" className="h-6 w-6 rounded-lg" />
            <span className="text-sm font-bold gradient-text">ScoutTip</span>
            <span className="text-gray-600 text-xs ml-1">× BAGS Hackathon</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-500">
            <a href="https://bags.fm" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">Bags.fm</a>
            <a href="https://dorahacks.io" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">DoraHacks</a>
            <a href="https://solana.com" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">Solana</a>
            <a href="https://github.com/ulsreall/scouttip" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
