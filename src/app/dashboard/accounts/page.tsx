"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Shield, LayoutDashboard, 
  Plus, X, CheckCircle2, AlertCircle, 
  Zap, Link as LinkIcon 
} from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { linkAccount, getUserAccounts } from "@/app/actions/account-actions";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [loading, setLoading] = useState(false);

  // Form States
  const [config, setConfig] = useState<any>({});

  // అకౌంట్స్ లోడ్ చేయడం
  const loadAccounts = async () => {
    const data = await getUserAccounts();
    setAccounts(data);
  };

  useEffect(() => { loadAccounts(); }, []);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await linkAccount({
        platform: selectedPlatform,
        accountName: `${selectedPlatform} Account`,
        config: config
      });
      alert(`${selectedPlatform} Connected Successfully! 🚀`);
      setIsModalOpen(false);
      loadAccounts();
    } catch (err) {
      alert("Connection Failed. Check your tokens.");
    }
    setLoading(false);
  };

  const platforms = [
    { id: "Telegram", icon: "T", color: "text-blue-400", bg: "bg-blue-500/10" },
    { id: "WhatsApp", icon: "W", color: "text-green-400", bg: "bg-green-500/10" },
    { id: "Facebook", icon: "F", color: "text-blue-600", bg: "bg-blue-600/10" },
    { id: "Instagram", icon: "I", color: "text-pink-500", bg: "bg-pink-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans overflow-hidden">
      
      {/* 🚀 Sidebar */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col p-8 sticky top-0 h-screen z-30">
        <div className="flex items-center gap-3 mb-16">
          <img src="/logo.png" alt="PostJet" className="w-12" />
          <span className="font-black text-3xl italic tracking-tighter">Post<span className="text-blue-500">Jet</span></span>
        </div>
        <nav className="flex-1 space-y-4">
          <a href="/dashboard" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20">
            <Globe size={20} /> Connections
          </a>
        </nav>
        <div className="pt-8 border-t border-slate-800">
           <LogoutLink className="flex items-center gap-4 text-slate-500 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-red-400 transition-all">
              Logout
           </LogoutLink>
        </div>
      </aside>

      {/* 🌌 Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />

        <header className="mb-12 flex justify-between items-center relative z-10">
          <div>
            <p className="text-blue-400 font-black uppercase text-[10px] tracking-[0.4em] mb-2">Systems</p>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">App Linkage</h2>
          </div>
        </header>

        <div className="max-w-5xl space-y-8 relative z-10">
          
          {/* Connection Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((p) => {
              const isConnected = accounts.some(acc => acc.platform === p.id);
              return (
                <div key={p.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 ${p.bg} ${p.color} rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-inner`}>
                      {p.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight">{p.id}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? 'text-green-500' : 'text-slate-500'}`}>
                        {isConnected ? 'Sync Active' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedPlatform(p.id); setIsModalOpen(true); }}
                    className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isConnected ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105'}`}
                  >
                    {isConnected ? 'Update' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </section>

          {/* API Core Status (Static Design) */}
          <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-10 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                <Shield className="text-blue-500" size={24} />
                <h3 className="font-black uppercase text-sm tracking-[0.2em]">API Core Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-6 bg-black/20 rounded-2xl border border-slate-800">
                    <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">Database Engine</span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-green-500"><CheckCircle2 size={14}/> ONLINE</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-black/20 rounded-2xl border border-slate-800">
                    <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">Post Dispatcher</span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-blue-500 hover:animate-pulse cursor-pointer"><Zap size={14}/> ACTIVE</span>
                </div>
            </div>
          </section>
        </div>

        {/* 🛠️ Connection Modal (Pop-up Form) */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] w-full max-w-lg relative z-10 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-blue-500">Connect {selectedPlatform}</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X /></button>
                </div>

                <div className="space-y-6">
                  {selectedPlatform === "Telegram" && (
                    <>
                      <input type="text" placeholder="Bot Token" onChange={(e) => setConfig({...config, botToken: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                      <input type="text" placeholder="Chat ID" onChange={(e) => setConfig({...config, chatId: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                    </>
                  )}
                  {selectedPlatform === "WhatsApp" && (
                    <>
                      <input type="text" placeholder="Phone Number ID" onChange={(e) => setConfig({...config, phoneId: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                      <input type="text" placeholder="Access Token" onChange={(e) => setConfig({...config, token: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                      <input type="text" placeholder="Recipient Number (e.g. 91...)" onChange={(e) => setConfig({...config, recipient: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                    </>
                  )}
                  {/* Facebook/Instagram Logic can be added here similarly */}

                  <button 
                    onClick={handleConnect}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? "Establishing Link..." : <><LinkIcon size={18}/> Finalize Connection</>}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}