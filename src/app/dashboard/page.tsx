"use client";
import { useState, useEffect } from 'react';
import { Zap, Facebook, Instagram, Send, CheckCircle2 } from 'lucide-react';

export default function SaaS_Dashboard() {
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch connected pages
  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages/fetch', { method: 'POST' });
      const data = await res.json();
      setPages(data.pages || []);
    } catch (e) {
      console.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const togglePage = (id) => {
    setSelectedPages(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center bg-[#1e293b] p-6 rounded-2xl border border-blue-500/20">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            POSTJET SAAS DASHBOARD
          </h1>
          <p className="text-gray-400 text-sm">Select targets and blast your content</p>
        </div>
        <div className="bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/50">
          <span className="text-blue-400 font-mono text-sm">PREMIUM PLAN Active</span>
        </div>
      </div>

      {/* Connection Buttons Grid (17 Apps Logic) */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
        <button onClick={() => window.location.href='/api/auth/facebook'} className="flex flex-col items-center p-4 bg-[#1e293b] rounded-xl hover:bg-blue-600 transition-all group">
          <Facebook className="mb-2 group-hover:scale-110 transition" />
          <span className="text-xs">Facebook</span>
        </button>
        {/* Add other 16 buttons here with same style */}
      </div>

      {/* Target Pages Selection */}
      <div className="mb-10">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4 text-blue-300">
          <Zap size={20} /> SELECT TARGET CHANNELS
        </h2>
        
        {loading ? (
          <div className="animate-pulse text-gray-500">Scanning connections...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pages.map(page => (
              <div 
                key={page.id}
                onClick={() => togglePage(page.id)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  selectedPages.includes(page.id) ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-[#1e293b]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{page.name}</span>
                  {selectedPages.includes(page.id) && <CheckCircle2 className="text-green-500" size={18} />}
                </div>
                <span className="text-xs text-gray-400">{page.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Engine */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
        <textarea 
          placeholder="What's the blast today?"
          className="w-full bg-[#0f172a] border border-gray-700 rounded-xl p-4 mb-4 focus:outline-none focus:border-blue-500 h-32"
        />
        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90">
          <Send size={18} /> LAUNCH TO {selectedPages.length} TARGETS
        </button>
      </div>
    </div>
  );
}