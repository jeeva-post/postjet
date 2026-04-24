"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions";

const APPS = [
  { id: "Facebook", key: "facebook", icon: "f", color: "text-[#1877F2]", bg: "bg-[#1877F2]/10" },
  { id: "Instagram", key: "instagram", icon: "i", color: "text-[#E1306C]", bg: "bg-[#E1306C]/10" },
  { id: "LinkedIn", key: "linkedin", icon: "l", color: "text-[#0077B5]", bg: "bg-[#0077B5]/10" },
  { id: "Telegram", key: "telegram", icon: "t", color: "text-[#0088cc]", bg: "bg-[#0088cc]/10" },
  { id: "WhatsApp", key: "whatsapp", icon: "w", color: "text-[#25D366]", bg: "bg-[#25D366]/10" },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const load = async () => {
    setIsSyncing(true);
    const data = await getUserAccounts();
    setAccounts(data);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-12">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter italic">Mission Control</h2>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Official 1-Click Connections</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 text-[10px] bg-blue-600 px-6 py-2 rounded-full font-black uppercase hover:scale-105 transition-all">
          <RefreshCcw size={12} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Syncing..." : "Sync Status"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {APPS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform.toLowerCase() === p.key);
          return (
            <div key={p.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center text-xl font-black`}>{p.icon}</div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">{p.id}</h4>
                  <span className={`text-[8px] font-black uppercase ${isConnected ? 'text-green-400' : 'text-slate-500'}`}>
                    {isConnected ? 'Connected' : 'Ready to Connect'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = `/api/auth/social/${p.key}`}
                className={`p-3 rounded-xl transition-all ${isConnected ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg'}`}
              >
                {isConnected ? <CheckCircle2 size={18}/> : <Zap size={18}/>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}