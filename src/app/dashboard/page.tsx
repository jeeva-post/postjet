"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw, Lock } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions";

// Real Social Media Logos (PNG/SVG Links)
const LOGOS = {
  facebook: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
  instagram: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
  whatsapp: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  linkedin: "https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg",
  telegram: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
};

const PLATFORMS = [
  { id: "Facebook", key: "facebook", logo: LOGOS.facebook, active: true },
  { id: "Instagram", key: "instagram", logo: LOGOS.instagram, active: true },
  { id: "WhatsApp Business", key: "whatsapp", logo: LOGOS.whatsapp, active: true },
  { id: "LinkedIn", key: "linkedin", logo: LOGOS.linkedin, active: false },
  { id: "Telegram Bot", key: "telegram", logo: LOGOS.telegram, active: false },
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
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 p-6 md:p-12 font-sans">
      {/* Soft Header */}
      <div className="mb-10 flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-black">Mission Control</h2>
          <span className="ml-2 bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Beta v1.0</span>
        </div>
        <button onClick={load} className="group flex items-center gap-2.5 text-xs bg-white border border-slate-200 text-black px-6 py-3 rounded-full font-bold uppercase hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
          <RefreshCcw size={14} className={`text-blue-600 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Refresh Status"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLATFORMS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform.toLowerCase() === p.key);
          return (
            <div key={p.id} className={`relative bg-white border ${p.active ? 'border-slate-100' : 'border-slate-100 opacity-60'} p-8 rounded-3xl flex flex-col justify-between group hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 shadow-sm`}>
              
              <div className="flex items-center justify-between mb-8">
                {/* Real Logo Installation */}
                <img src={p.logo} alt={p.id} className={`h-12 w-12 object-contain ${p.active ? '' : 'grayscale'}`} />
                
                <div className="flex items-center gap-2 border border-slate-100 bg-slate-50 px-4 py-1.5 rounded-full">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-slate-400'}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isConnected ? 'text-green-600' : 'text-slate-500'}`}>
                      {isConnected ? 'Connected' : 'Offline'}
                    </span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold text-black tracking-tight">{p.id}</h4>
                  <p className="text-xs text-slate-500 mt-1">{p.active ? 'Official API connection' : 'Coming soon in next update'}</p>
                </div>
                
                {p.active ? (
                  <button 
                    onClick={() => window.location.href = `/api/auth/social/${p.key}`}
                    className={`p-4 rounded-xl transition-all duration-300 ${isConnected ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1'}`}
                  >
                    {isConnected ? <CheckCircle2 size={20}/> : <Zap size={20}/>}
                  </button>
                ) : (
                    <div className="p-4 rounded-xl bg-slate-100 text-slate-400">
                        <Lock size={20} />
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}