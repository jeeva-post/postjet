"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw, Rocket } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions";

const PLATFORMS = [
  { id: "Facebook", key: "facebook", icon: "f", color: "text-[#1877F2]", bg: "bg-[#1877F2]/10", active: true },
  { id: "Instagram", key: "instagram", icon: "i", color: "text-[#E1306C]", bg: "bg-[#E1306C]/10", active: true },
  { id: "WhatsApp", key: "whatsapp", icon: "w", color: "text-[#25D366]", bg: "bg-[#25D366]/10", active: true },
  { id: "LinkedIn", key: "linkedin", icon: "l", color: "text-slate-500", bg: "bg-slate-500/10", active: false },
  { id: "Telegram", key: "telegram", icon: "t", color: "text-slate-500", bg: "bg-slate-500/10", active: false },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setSyncing(true);
    const data = await getUserAccounts();
    setAccounts(data);
    setTimeout(() => setSyncing(false), 800);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 md:p-12 font-sans">
      <div className="mb-8 flex items-center gap-3">
        <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">Beta Access</span>
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">PostJet v1.0</span>
      </div>

      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Mission<br/>Control</h2>
          <p className="text-slate-500 text-[10px] mt-4 font-bold uppercase tracking-[0.3em]">Official Social Links</p>
        </div>
        <button onClick={load} className="group flex items-center gap-3 text-[11px] bg-white text-black px-8 py-4 rounded-2xl font-black uppercase hover:bg-blue-600 hover:text-white transition-all duration-500">
          <RefreshCcw size={14} className={syncing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"} />
          {syncing ? "Syncing..." : "Sync Assets"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORMS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform.toLowerCase() === p.key);
          return (
            <div key={p.id} className={`relative overflow-hidden bg-slate-900/40 border ${p.active ? 'border-slate-800' : 'border-slate-800/30 opacity-50'} p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all duration-500 shadow-2xl`}>
              {!p.active && (
                <div className="absolute top-4 right-4 bg-slate-800 text-[7px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Coming Soon</div>
              )}
              
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 ${p.bg} ${p.color} rounded-[1.2rem] flex items-center justify-center text-2xl font-black transition-transform group-hover:scale-110`}>{p.icon}</div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider">{p.id}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-slate-600'}`}></div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-green-500' : 'text-slate-500'}`}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              {p.active && (
                <button 
                  onClick={() => window.location.href = `/api/auth/social/${p.key}`}
                  className={`p-4 rounded-2xl transition-all duration-500 ${isConnected ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white shadow-lg hover:-translate-y-1'}`}
                >
                  {isConnected ? <CheckCircle2 size={20}/> : <Rocket size={20}/>}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}