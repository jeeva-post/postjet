"use client";
import { useState, useEffect } from 'react';
import { Zap, Facebook, Send, CheckCircle2, LayoutDashboard, Settings, CreditCard, LogOut } from 'lucide-react';

export default function PostJetDashboard() {
  // Types specify chesam kabatti 'never[]' error radu
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const fetchConnectedPages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages/fetch', { method: 'POST' });
      const data = await res.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConnectedPages(); }, []);

  const togglePage = (id: string) => {
    setSelectedPages(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] border-r border-slate-800 p-6 flex flex-col gap-8">
        <h1 className="text-2xl font-black text-blue-500 italic">POSTJET</h1>
        <nav className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-blue-400 bg-blue-500/10 p-3 rounded-lg"><LayoutDashboard size={20}/> Dashboard</div>
          <div className="flex items-center gap-3 text-slate-400 p-3 hover:bg-slate-800 rounded-lg cursor-pointer"><Settings size={20}/> Settings</div>
          <div className="flex items-center gap-3 text-slate-400 p-3 hover:bg-slate-800 rounded-lg cursor-pointer"><CreditCard size={20}/> Billing</div>
        </nav>
        <div className="mt-auto flex items-center gap-3 text-red-400 p-3 cursor-pointer"><LogOut size={20}/> Logout</div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold italic text-blue-400">POSTJET SAAS LIVE</h2>
            <p className="text-slate-400">Manage 17+ platforms from one place</p>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-green-400 text-sm font-bold">● Premium Active</div>
        </header>

        {/* Platforms */}
        <div className="grid grid-cols-6 gap-4 mb-12">
          <button onClick={() => window.location.href='/api/auth/facebook'} className="flex flex-col items-center gap-2 p-4 bg-[#1e293b] rounded-2xl hover:border-blue-500 border border-transparent transition-all">
            <Facebook size={24} className="text-blue-500"/>
            <span className="text-xs font-semibold">Facebook</span>
          </button>
        </div>

        {/* Selection Area */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-yellow-400" size={20}/>
            <h3 className="text-xl font-bold">Select Target Channels</h3>
          </div>

          {loading ? (
            <div className="text-slate-500 animate-pulse">Syncing...</div>
          ) : pages.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {pages.map((page) => (
                <div key={page.id} onClick={() => togglePage(page.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPages.includes(page.id) ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-[#0f172a]'}`}
                >
                  <div className="flex justify-between items-center font-bold">
                    {page.name}
                    {selectedPages.includes(page.id) && <CheckCircle2 size={18} className="text-blue-500"/>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-800 rounded-2xl text-center text-slate-500">Connect an app to see your pages.</div>
          )}
        </section>

        {/* Input */}
        <div className="bg-[#0f172a] border border-slate-800 p-8 rounded-3xl">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your content..."
            className="w-full bg-[#1e293b] border border-slate-700 rounded-2xl p-6 h-40 outline-none mb-6"
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
            <Send size={22}/> LAUNCH TO {selectedPages.length} CHANNELS
          </button>
        </div>
      </div>
    </div>
  );
}