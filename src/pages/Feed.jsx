import React, { useState } from 'react';
import { feedPosts } from '../data/mockData';
import TipModal from '../components/TipModal';

const Feed = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [tipTarget, setTipTarget] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(feedPosts);

  const filters = [
    { key: 'all', label: 'All', icon: '📋' },
    { key: 'alpha', label: 'Alpha', icon: '🔮' },
    { key: 'alert', label: 'Alerts', icon: '⚠️' },
    { key: 'airdrop', label: 'Airdrops', icon: '🪂' },
    { key: 'tutorial', label: 'Tutorials', icon: '💡' },
    { key: 'analysis', label: 'Analysis', icon: '📊' },
  ];

  const filtered = activeFilter === 'all' ? posts : posts.filter(p => p.category === activeFilter);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now(),
      author: 'You',
      avatar: '🌟',
      time: 'Just now',
      content: newPost,
      tips: 0,
      replies: 0,
      category: 'alpha',
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="pt-20 pb-8 px-4 min-h-screen bg-grid">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">📡 Scout Feed</h1>

        {/* New Post */}
        <div className="glass-card p-4 mb-6">
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Share alpha, alert, or tutorial with the community..."
            className="input-dark resize-none mb-3"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {['alpha', 'alert', 'airdrop'].map(cat => (
                <span key={cat} className="badge badge-purple text-xs cursor-pointer hover:bg-purple-500/20">
                  {cat === 'alpha' ? '🔮' : cat === 'alert' ? '⚠️' : '🪂'} {cat}
                </span>
              ))}
            </div>
            <button onClick={handlePost} className="btn-primary text-sm px-5 py-2">Post</button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === f.key
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-purple-500/20'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {filtered.map(post => (
            <div key={post.id} className="glass-card p-5 hover:border-purple-500/30 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{post.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{post.author}</span>
                    <span className={`badge text-xs ${
                      post.category === 'alert' ? 'badge-red' :
                      post.category === 'airdrop' ? 'badge-green' :
                      post.category === 'tutorial' ? 'badge-cyan' :
                      post.category === 'alpha' ? 'badge-purple' : 'badge-purple'
                    }`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">{post.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{post.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                <button
                  onClick={() => setTipTarget(post)}
                  className="flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  💸 Tip ({post.tips})
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                  💬 {post.replies} replies
                </button>
                <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors ml-auto">
                  🔖 Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TipModal
        isOpen={!!tipTarget}
        onClose={() => setTipTarget(null)}
        recipient={tipTarget ? { name: tipTarget.author, avatar: tipTarget.avatar, address: '7xKX...p4Rq' } : null}
      />
    </div>
  );
};

export default Feed;