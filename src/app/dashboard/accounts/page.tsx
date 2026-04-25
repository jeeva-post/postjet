"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw, Lock } from "lucide-react";
// నీ ఫోల్డర్ స్ట్రక్చర్ ప్రకారం ఈ పాత్ కరెక్ట్‌గా ఉందో లేదో ఒకసారి చూసుకో
import { getUserAccounts } from "../../actions/account-actions"; 

// --- 🛡️ REAL LOGOS (SVG) ---
const FBLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M29.5 24H25.5V38H20V24H17V19.5H20V16.8C20 13.1 22.1 11 25.5 11C27.1 11 28.5 11.1 28.9 11.2V15.2H26.5C24.8 15.2 24.5 16.1 24.5 17.2V19.5H29L28.5 24H29.5Z" fill="white"/>
  </svg>
);

const InstaLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="url(#insta_grad)"/>
    <path d="M24 14.5C18.75 14.5 14.5 18.75 14.5 24C14.5 29.25 18.75 33.5 24 33.5C29.25 33.5 33.5 29.25 33.5 24C33.5 18.75 29.25 14.5 24 14.5ZM24 30C20.69 30 18 27.31 18 24C18 20.69 20.69 18 24 18C27.31 18 30 20.69 30 24C30 27.31 27.31 30 24 30ZM33.5 16.5C33.5 17.6 32.6 18.5 31.5 18.5C30.4 18.5 29.5 17.6 29.5 16.5C29.5 15.4 30.4 14.5 31.5 14.5C32.6 14.5 33.5 15.4 33.5 16.5Z" fill="white"/>
    <defs>
      <radialGradient id="insta_grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 36) rotate(-45) scale(40)">
        <stop stopColor="#FED011"/><stop offset="0.25" stopColor="#F77737"/><stop offset="0.5" stopColor="#E1306C"/><stop offset="1" stopColor="#833AB4"/>
      </radialGradient>
    </defs>
  </svg>
);

const WALogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#25D366"/>
    <path d="M34.5 29.5C34.2 30.5 32.5 31.4 31.5 31.6C30.8 31.8 29.8 31.9 26.8 30.6C23 29 20.5 25.1 20.3 24.9C20.1 24.7 18.6 22.7 18.6 20.6C18.6 18.5 19.7 17.5 20.1 17.1C20.5 16.7 21 16.6 21.4 16.6H22.4C22.7 16.6 23 16.6 23.3 17.3C23.6 18.1 24.4 20 24.5 20.2C24.6 20.4 24.7 20.7 24.5 21C24.3 21.3 24.2 21.5 23.9 21.8C23.6 22.1 23.4 22.3 23.1 22.6C22.8 22.9 22.5 23.3 22.9 23.9C23.3 24.5 24.6 26.6 26.5 28.3C28.5 30.1 30.1 30.6 30.7 30.9C31.3 31.2 31.7 31.1 32 30.8C32.3 30.5 33.3 29.3 33.7 28.8C34.1 28.3 34.5 28.4 35.1 28.6L34.5 29.5Z" fill="white"/>
  </svg>
);

const LILogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="8" fill="#0077B5"/>
    <path d="M14 36V18H8V36H14ZM11 15.5C12.9 15.5 14.5 13.9 14.5 12C14.5 10.1 12.9 8.5 11 8.5C9.1 8.5 7.5 10.1 7.5 12C7.5 13.9 9.1 15.5 11 15.5ZM37 36V26.5C37 21.8 34.5 19.6 31.1 19.6C28.4 19.6 27.2 21.1 26.5 22.1V18H20.5V36H26.5V26.5C26.5 24 27.2 21.5 30.2 21.5C33.2 21.5 33.3 24.3 33.3 26.8V36H37Z" fill="white"/>
  </svg>
);

const TGLogo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#0088CC"/>
    <path d="M35 15L11 24L18 28L31 19L23 30L33 34L37 15H35Z" fill="white"/>
  </svg>
);

const PLATFORMS = [
  { id: "Facebook", key: "facebook", Icon: FBLogo, active: true },
  { id: "Instagram", key: "instagram", Icon: InstaLogo, active: true },
  { id: "WhatsApp", key: "whatsapp", Icon: WALogo, active: true },
  { id: "LinkedIn", key: "linkedin", Icon: LILogo, active: false },
  { id: "Telegram", key: "telegram", Icon: TGLogo, active: false },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    setSyncing(true);
    try {
      const data = await getUserAccounts();
      setAccounts(data || []);
    } catch (e) { 
      console.error("Account Sync Error:", e); 
    } finally {
      // 800ms వెయిట్ చేసి ఆనిమేషన్ ఆపుతాం
      setTimeout(() => setSyncing(false), 800);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 p-8 md:p-16">
      <header className="mb-12 flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-black uppercase italic leading-none">Mission Control</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Active Signal Hub</p>
        </div>
        <button 
          onClick={load} 
          disabled={syncing}
          className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCcw size={14} className={`text-blue-600 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing Universe..." : "Refresh Assets"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLATFORMS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform?.toLowerCase() === p.key);
          const PlatformIcon = p.Icon;

          return (
            <div key={p.id} className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-12">
                <div className={`${p.active ? 'transform transition-transform group-hover:scale-110' : 'grayscale opacity-20 transform scale-90'}`}>
                   <PlatformIcon />
                </div>
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isConnected ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                  {isConnected ? 'Signal Active' : 'Offline'}
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-2xl font-black text-black tracking-tight leading-none">{p.id}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {p.active ? 'API Broadcasting' : 'Deploying Soon'}
                  </p>
                </div>

                {p.active ? (
                  <button 
                    onClick={() => window.location.href = `/api/auth/social/${p.key}`} 
                    className={`p-5 rounded-2xl transition-all ${isConnected ? 'bg-slate-50 text-slate-300 hover:bg-slate-100' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-110 active:scale-95'}`}
                  >
                    {isConnected ? <CheckCircle2 size={20}/> : <Zap size={20}/>}
                  </button>
                ) : (
                  <div className="p-5 bg-slate-50 text-slate-200 rounded-2xl cursor-not-allowed">
                    <Lock size={20}/>
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