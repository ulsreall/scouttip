<div align="center">

# 🔍 ScoutTip

### AI-Powered Social Tipping Platform on Solana

**Tip Scouts. Reward Alpha. Launch Tokens.**

Built for the [BAGS Hackathon](https://dorahacks.io/hackathon/the-bags-hackathon/buidl) on DoraHacks

[![Solana](https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Bags API](https://img.shields.io/badge/Bags_API-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,)](https://bags.fm)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)

</div>

---

## 🚀 What is ScoutTip?

ScoutTip is a social tipping platform where **Web3 scouts earn by sharing valuable insights**. Scouts post alpha, alerts, tutorials, and airdrop leads on a public feed. Community members tip valuable content with SOL or community tokens — building **verifiable on-chain reputation**.

### The Problem
- Web3 communities are flooded with noise, fake alpha, and scam links
- Valuable scouts who share real insights get no direct reward
- No on-chain reputation system for Web3 content creators
- Launching a community token is complex and inaccessible

### The Solution
ScoutTip creates a **feedback loop** where:
1. 📡 **Scouts share** alpha, alerts, tutorials, and airdrop leads
2. 💰 **Community tips** valuable content with SOL or tokens
3. 🏆 **Reputation builds** on-chain based on tips earned
4. 🪙 **Tokens launch** via Bags API — creating community economies

---

## ✨ Features

### 📡 Scout Feed
- Post alpha, security alerts, tutorials, and airdrop leads
- Filter by category (Alpha, Alerts, Airdrops, Tutorials, Analysis)
- Tip any post with SOL to reward valuable insights
- Real-time community feed with engagement metrics

### 🏆 Leaderboard
- Top scouts ranked by tips earned, reputation, and total finds
- Tiered badges: Diamond 💎 → Gold 🥇 → Silver 🥈 → Bronze 🥉
- Tip your favorite scouts directly from the leaderboard

### 🪙 Community Tokens (Bags API)
- **Explore** community tokens launched via Bags
- **Launch** your own token with just a name, symbol, and description
- Creator earns 1% from every trade
- Use tokens for tipping, rewards, or community governance

### 🛡️ AI Risk Checker
- Enter any token address, project name, or URL
- AI analyzes on-chain data, smart contracts, and social signals
- Risk score (0-100) with detailed breakdown
- Actionable recommendation: Safe / Caution / Danger

### 💸 Tip System
- Send SOL tips to any scout or content creator
- Preset amounts (0.1, 0.5, 1, 2 SOL) or custom
- Tips recorded on-chain for verifiable history
- Fee sharing model rewards top contributors

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS v4 |
| **Blockchain** | Solana (mainnet-beta) |
| **Wallet** | Solana Wallet Adapter (Phantom, Solflare) |
| **Token Launch** | Bags API (bags.fm) |
| **Design** | Glassmorphism dark theme, Inter font |
| **Deployment** | Vercel |

---

## 🔗 BAGS Hackathon Integration

ScoutTip deeply integrates with the BAGS ecosystem:

1. **Bags API** — Community tokens are created and managed through the Bags API on Solana
2. **Fee Sharing** — Platform fees are shared with top scouts based on reputation
3. **Social Finance** — Every tip, alert, and contribution builds on-chain reputation
4. **AI Agents** — Risk checker uses AI to analyze on-chain data and social signals
5. **Onchain Performance** — All interactions (tips, token trades, reputation) happen on Solana

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- A Solana wallet (Phantom or Solflare)

### Installation

```bash
git clone https://github.com/ulsreall/scouttip.git
cd scouttip
npm install
npm run dev
```

### Build
```bash
npm run build
```

---

## 📁 Project Structure

```
scouttip/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with wallet connect
│   │   ├── TipModal.jsx        # SOL tipping modal
│   │   └── RiskChecker.jsx     # AI risk analysis component
│   ├── context/
│   │   └── WalletContextProvider.jsx  # Solana wallet setup
│   ├── data/
│   │   └── mockData.js         # Mock data for demo
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with hero
│   │   ├── Feed.jsx            # Scout social feed
│   │   ├── Leaderboard.jsx     # Scout rankings
│   │   ├── Tokens.jsx          # Token explorer + launcher
│   │   └── RiskCheck.jsx       # AI risk checker
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind + custom styles
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎯 Hackathon Tracks

ScoutTip qualifies for multiple BAGS Hackathon tracks:

- ✅ **Bags API** — Deep integration for token launch and trading
- ✅ **Social Finance** — Tipping economy for Web3 content
- ✅ **AI Agents** — AI-powered risk analysis
- ✅ **Fee Sharing** — Revenue sharing with top scouts

---

## 👤 Built By

**Khasbi Maulana** — Web3 Developer from Indonesia
- 🌐 [Portfolio](https://khasbim.web.id)
- 🐙 [GitHub](https://github.com/ulsreall)
- 🐦 [X/Twitter](https://x.com/itseywacc)
- 📧 khasbimln@gmail.com

---

<div align="center">

**Made with 💜 for the BAGS Hackathon**

*Check before you connect. Tip before you leave.*

</div>
