import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletContextProvider from './context/WalletContextProvider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Leaderboard from './pages/Leaderboard';
import Tokens from './pages/Tokens';
import RiskCheck from './pages/RiskCheck';

function App() {
  return (
    <WalletContextProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0a0f]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/risk-check" element={<RiskCheck />} />
          </Routes>
        </div>
      </Router>
    </WalletContextProvider>
  );
}

export default App;
