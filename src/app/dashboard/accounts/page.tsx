"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, RefreshCcw, Lock } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions"; 

// Real Logos as SVG Components - ఇవి ఎప్పటికీ మిస్ అవ్వవు
const Icons = {
  Facebook: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 35.9789 8.77641 45.9048 20.25 47.7083V30.9375H14.1562V24H20.25V18.7125C20.25 12.6975 23.8312 9.375 29.2922 9.375C31.9083 9.375 34.65 9.84375 34.65 9.84375V15.7125H31.6453C28.6641 15.7125 27.75 17.5627 27.75 19.4625V24H34.3594L33.3038 30.9375H27.75V47.7083C39.2236 45.9048 48 35.9789 48 24Z" fill="#1877F2"/>
      <path d="M33.3038 30.9375L34.3594 24H27.75V19.4625C27.75 17.5627 28.6641 15.7125 31.6453 15.7125H34.65V9.84375C34.65 9.84375 31.9083 9.375 29.2922 9.375C23.8312 9.375 20.25 12.6975 20.25 18.7125V24H14.1562V30.9375H20.25V47.7083C21.4884 47.9025 22.7325 48 24 48C25.2675 48 26.5116 47.9025 27.75 47.7083V30.9375H33.3038Z" fill="white"/>
    </svg>
  ),
  Instagram: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="url(#paint0_radial)"/>
      <path d="M24 14.5C18.7533 14.5 14.5 18.7533 14.5 24C14.5 29.2467 18.7533 33.5 24 33.5C29.2467 33.5 33.5 29.2467 33.5 24C33.5 18.7533 29.2467 14.5 24 14.5ZM24 30.1C20.631 30.1 17.9 27.369 17.9 24C17.9 20.631 20.631 17.9 24 17.9C27.369 17.9 30.1 20.631 30.1 24C30.1 27.369 27.369 30.1 24 30.1ZM33.882 16.331C33.882 17.5455 32.8955 18.532 31.681 18.532C30.4665 18.532 29.48 17.5455 29.48 16.331C29.48 15.1165 30.4665 14.13 31.681 14.13C32.8955 14.13 33.882 15.1165 33.882 16.331Z" fill="white"/>
      <defs>
        <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.16 39.84) rotate(-45) scale(50.4188)">
          <stop stopColor="#FED011"/><stop offset="0.25" stopColor="#F77737"/><stop offset="0.5" stopColor="#E1306C"/><stop offset="1" stopColor="#833AB4"/>
        </radialGradient>
      </defs>
    </svg>
  ),
  WhatsApp: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 0C10.7452 0 0 10.7452 0 24C0 28.272 1.1216 32.28 3.0784 35.752L0 48L12.552 44.704C15.88 46.776 19.808 48 24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0Z" fill="#25D366"/>
      <path d="M35.2 30.2C34.7 29.9 32.3 28.7 31.8 28.6C31.4 28.4 31.1 28.3 30.8 28.8C30.5 29.2 29.7 30.2 29.4 30.5C29.2 30.8 28.9 30.8 28.4 30.6C27.9 30.3 26.3 29.8 24.4 28.1C22.9 26.8 21.9 25.1 21.6 24.6C21.3 24.1 21.6 23.9 21.8 23.6C22.1 23.4 22.3 23.1 22.6 22.8C22.8 22.5 22.9 22.3 23 21.9C23.1 21.6 23.1 21.3 23 21C22.9 20.7 22.1 18.7 21.8 17.9C21.4 17.1 21.1 17.2 20.8 17.2H20C19.7 17.2 19.2 17.3 18.8 17.7C18.4 18.1 17.4 19.1 17.4 21.1C17.4 23.1 18.8 25 19 25.3C19.2 25.6 21.9 29.7 26 31.5C27 31.9 27.7 32.2 28.4 32.4C29.4 32.7 30.3 32.7 31 32.6C31.8 32.5 33.4 31.6 33.8 30.6C34.1 29.6 34.1 28.7 34 28.5C33.9 28.4 33.7 28.3 33.2 28.1L35.2 30.2Z" fill="white"/>
    </svg>
  ),
  LinkedIn: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="6" fill="#0077B5"/>
      <path d="M14.6 11.5C14.6 13.2 13.2 14.6 11.5 14.6C9.8 14.6 8.4 13.2 8.4 11.5C8.4 9.8 9.8 8.4 11.5 8.4C13.2 8.4 14.6 9.8 14.6 11.5ZM8.7 39.5H14.4V17.5H8.7V39.5ZM23.4 17.5H17.7V39.5H23.4V30.1C23.4 25.1 29.8 24.6 29.8 30.1V39.5H35.5V28.2C35.5 19.4 25.5 19.7 23.4 23.6V17.5Z" fill="white"/>
    </svg>
  ),
  Telegram: () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill="#0088CC"/>
      <path d="M10 24.5C17.5 21.3 31.5 15.5 35 14C36.5 13.4 38.5 13 38.5 15C38.5 15.7 38.1 18.5 37.6 22L36 32.5C35.8 33.8 35 34.2 34 33.5L25 27L20.5 31.3C20 31.8 19.6 32.2 18.7 32.2L19.4 22.4L37.2 6.3C38 5.6 37 5.2 36 5.8L13.8 19.8L3.5 16.6C1.3 15.9 1.3 14.4 4 13.4L10 24.5Z" fill="white"/>
    </svg>
  )
};

const PLATFORMS = [
  { id: "Facebook", key: "facebook", Icon: Icons.Facebook, active: true },
  { id: "Instagram", key: "instagram", Icon: Icons.Instagram, active: true },
  { id: "WhatsApp", key: "whatsapp", Icon: Icons.WhatsApp, active: true },
  { id: "LinkedIn", key: "linkedin", Icon: Icons.LinkedIn, active: false },
  { id: "Telegram", key: "telegram", Icon: Icons.Telegram, active: false },
];

export default function AccountsPage() {
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
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 p-8 md:p-16">
      <header className="mb-12 flex justify-between items-center border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-black uppercase italic leading-none">Mission Control</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Active Signal Hub</p>
        </div>
        <button onClick={load} className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-2xl font-bold text-[10px] uppercase shadow-sm active:scale-95 transition-all">
          <RefreshCcw size={14} className={`text-blue-600 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Refresh Status"}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PLATFORMS.map((p) => {
          const isConnected = accounts.some(acc => acc.platform?.toLowerCase() === p.key);
          const PlatformIcon = p.Icon;

          return (
            <div key={p.id} className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-12">
                <div className={`${p.active ? '' : 'grayscale opacity-20'}`}>
                   <PlatformIcon />
                </div>
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isConnected ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                  {isConnected ? 'Signal Active' : 'Offline'}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-2xl font-black text-black tracking-tight leading-none">{p.id}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.active ? 'API Broadcasting' : 'Deploying Soon'}</p>
                </div>
                {p.active ? (
                  <button onClick={() => window.location.href = `/api/auth/social/${p.key}`} className={`p-5 rounded-2xl transition-all ${isConnected ? 'bg-slate-100 text-slate-300' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:scale-110'}`}>
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