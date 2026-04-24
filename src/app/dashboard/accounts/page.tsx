"use client";
import React, { useState, useEffect } from "react";
import { Globe, CheckCircle2, Zap } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions";

const PLATFORMS = [
  { id: "Facebook", key: "facebook", icon: "f", color: "text-[#1877F2]", bg: "bg-[#1877F2]/10" },
  { id: "Instagram", key: "instagram", icon: "i", color: "text-[#E1306C]", bg: "bg-[#E1306C]/10" },
  { id: "LinkedIn", key: "linkedin", icon: "l", color: "text-[#0077B5]", bg: "bg-[#0077B5]/10" },
  { id: "Telegram", key: "telegram", icon: "t", color: "text-[#0088cc]", bg: "bg-[#0088cc]/10" },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => { setAccounts(await getUserAccounts()); };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-12">
      <header className="mb-12"><h2 className="text-5xl font-black italic uppercase tracking-tighter italic">Mission Control</h2></header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORMS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform.toLowerCase() === p.key);
          return (
            <div key={p.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center text-xl font-black`}>{p.icon}</div>
                <div><h4 className="text-sm font-black uppercase">{p.id}</h4><span className={`text-[8px] font-black uppercase ${isConnected ? 'text-green-500' : 'text-slate-500'}`}>{isConnected ? 'Active' : 'Offline'}</span></div>
              </div>
              <button onClick={() => window.location.href = `/api/auth/social/${p.key}`} className={`p-3 rounded-xl transition-all ${isConnected ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg'}`}>
                {isConnected ? <CheckCircle2 size={18}/> : <Zap size={18}/>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}