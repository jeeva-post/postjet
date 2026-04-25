"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw, Lock } from "lucide-react";
import { getUserAccounts } from "../actions/account-actions"; // Path Fixed

// --- 🛡️ REAL LOGOS (SVG) ---
const FBLogo = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#1877F2"/><path d="M29.5 24H25.5V38H20V24H17V19.5H20V16.8C20 13.1 22.1 11 25.5 11C27.1 11 28.5 11.1 28.9 11.2V15.2H26.5C24.8 15.2 24.5 16.1 24.5 17.2V19.5H29L28.5 24H29.5Z" fill="white"/></svg>
);
const InstaLogo = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="url(#grad)"/><path d="M24 14.5C18.75 14.5 14.5 18.75 14.5 24C14.5 29.25 18.75 33.5 24 33.5C29.25 33.5 33.5 29.25 33.5 24C33.5 18.75 29.25 14.5 24 14.5ZM24 30C20.69 30 18 27.31 18 24C18 20.69 20.69 18 24 18C27.31 18 30 20.69 30 24C30 27.31 27.31 30 24 30ZM33.5 16.5C33.5 17.6 32.6 18.5 31.5 18.5C30.4 18.5 29.5 17.6 29.5 16.5Z" fill="white"/><defs><radialGradient id="grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 36) rotate(-45) scale(40)"><stop stopColor="#FED011"/><stop offset="0.5" stopColor="#E1306C"/><stop offset="1" stopColor="#833AB4"/></radialGradient></defs></svg>
);
const WALogo = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#25D366"/><path d="M34.5 29.5C34.2 30.5 32.5 31.4 31.5 31.6C30.8 31.8 29.8 31.9 26.8 30.6C23 29 20.5 25.1 20.3 24.9C20.1 24.7 18.6 22.7 18.6 20.6C18.6 18.5 19.7 17.5 20.1 17.1C20.5 16.7 21 16.6 21.4 16.6H22.4L23.3 17.3C23.6 18.1 24.4 20 24.5 20.2L26.5 28.3C28.5 30.1 30.1 30.6 30.7 30.9L35.1 28.6L34.5 29.5Z" fill="white"/></svg>
);

const PLATFORMS = [
  { id: "Facebook", key: "facebook", Icon: FBLogo, active: true },
  { id: "Instagram", key: "instagram", Icon: InstaLogo, active: true },
  { id: "WhatsApp", key: "whatsapp", Icon: WALogo, active: true },
];

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setSyncing(true);
    try {
      const data = await getUserAccounts();
      setAccounts(data || []);
    } catch (e) { console.error(e); }
    setTimeout(() => setSyncing(false), 800);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8 md:p-12">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-black italic uppercase">Overview</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Commander Jeevan</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase shadow-sm">
          <RefreshCcw size={14} className={syncing ? "animate-spin" : ""} /> {syncing ? "Syncing..." : "Sync"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLATFORMS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform?.toLowerCase() === p.key);
          const Icon = p.Icon;
          return (
            <div key={p.id} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between group hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start mb-8">
                <Icon />
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${isConnected ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                  {isConnected ? 'Active' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <h4 className="text-lg font-black text-black uppercase">{p.id}</h4>
                <button onClick={() => window.location.href = `/api/auth/social/${p.key}`} className={`p-3 rounded-xl transition-all ${isConnected ? 'bg-slate-50 text-slate-200' : 'bg-blue-600 text-white'}`}>
                  {isConnected ? <CheckCircle2 size={16}/> : <Zap size={16}/>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white border border-slate-100 p-10 rounded-[3rem] text-center italic text-slate-400 text-sm">
        Select a platform above to start broadcasting content.
      </div>
    </div>
  );
}