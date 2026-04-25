"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw, Lock } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions"; 

const LOGOS = {
  facebook: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg",
  instagram: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
  whatsapp: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
  linkedin: "https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg",
  telegram: "https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
};

const PLATFORMS = [
  { id: "Facebook", key: "facebook", logo: LOGOS.facebook, active: true },
  { id: "Instagram", key: "instagram", logo: LOGOS.instagram, active: true },
  { id: "WhatsApp", key: "whatsapp", logo: LOGOS.whatsapp, active: true },
  { id: "LinkedIn", key: "linkedin", logo: LOGOS.linkedin, active: false },
  { id: "Telegram", key: "telegram", logo: LOGOS.telegram, active: false },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setSyncing(true);
    try {
      const data = await getUserAccounts();
      setAccounts(data || []);
    } catch (e) { console.error("Error fetching accounts", e); }
    setTimeout(() => setSyncing(false), 800);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 p-8 md:p-16">
      <header className="mb-12 flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-black uppercase italic">Mission Control</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Official Integrations</p>
        </div>
        <button onClick={load} className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase shadow-sm active:scale-95 transition-all">
          <RefreshCcw size={14} className={`text-blue-600 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing Universe..." : "Refresh Assets"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLATFORMS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform?.toLowerCase() === p.key);
          return (
            <div key={p.id} className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-12">
                <img src={p.logo} alt={p.id} className={`h-14 w-14 object-contain ${p.active ? '' : 'grayscale opacity-20'}`} />
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isConnected ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                  {isConnected ? 'Signal Active' : 'Offline'}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-2xl font-black text-black tracking-tight">{p.id}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.active ? 'Ready for Broadcast' : 'Launching Soon'}</p>
                </div>
                {p.active ? (
                  <button onClick={() => window.location.href = `/api/auth/social/${p.key}`} className={`p-5 rounded-2xl transition-all ${isConnected ? 'bg-slate-50 text-slate-300' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-105'}`}>
                    {isConnected ? <CheckCircle2 size={20}/> : <Zap size={20}/>}
                  </button>
                ) : (
                  <div className="p-5 bg-slate-50 text-slate-200 rounded-2xl"><Lock size={20}/></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}