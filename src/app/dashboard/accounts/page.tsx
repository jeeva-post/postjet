"use client";
import React, { useState, useEffect } from "react";
import { Globe, LayoutDashboard, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getUserAccounts } from "../../actions/account-actions";

const PLATFORMS = [
  { id: "Facebook", icon: "f", color: "text-[#1877F2]", bg: "bg-[#1877F2]/10" },
  { id: "Instagram", icon: "i", color: "text-[#E1306C]", bg: "bg-[#E1306C]/10" },
  { id: "LinkedIn", icon: "l", color: "text-[#0077B5]", bg: "bg-[#0077B5]/10" },
  { id: "X", icon: "x", color: "text-white", bg: "bg-white/10" },
  { id: "Telegram", icon: "t", color: "text-[#0088cc]", bg: "bg-[#0088cc]/10" },
  { id: "WhatsApp", icon: "w", color: "text-[#25D366]", bg: "bg-[#25D366]/10" },
  { id: "Reddit", icon: "r", color: "text-[#FF4500]", bg: "bg-[#FF4500]/10" },
  { id: "YouTube", icon: "y", color: "text-[#FF0000]", bg: "bg-[#FF0000]/10" },
  { id: "TikTok", icon: "tk", color: "text-white", bg: "bg-white/10" },
  { id: "Pinterest", icon: "p", color: "text-[#BD081C]", bg: "bg-[#BD081C]/10" },
  { id: "Snapchat", icon: "s", color: "text-[#FFFC00]", bg: "bg-[#FFFC00]/10" },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => { setAccounts(await getUserAccounts()); };
    load();
  }, []);

  const handleConnect = (platform: string) => {
    const baseUrl = "https://postjet.vercel.app/api/auth/callback";
    const authUrls: any = {
      Facebook: `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FB_APP_ID}&redirect_uri=${baseUrl}/facebook&scope=pages_manage_posts,pages_read_engagement`,
      LinkedIn: `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${baseUrl}/linkedin&scope=w_member_social`,
      Reddit: `https://www.reddit.com/api/v1/authorize?client_id=${process.env.NEXT_PUBLIC_REDDIT_ID}&response_type=code&state=pj&redirect_uri=${baseUrl}/reddit&duration=permanent&scope=submit`,
      // ఇతర యాప్స్ కి కూడా ఇదే విధంగా URL లు యాడ్ చేసుకోవచ్చు
    };

    if (authUrls[platform]) {
      window.location.href = authUrls[platform];
    } else {
      alert(`${platform} integration is coming soon in the next update!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex overflow-hidden">
      {/* Sidebar - Same Design */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 p-8 sticky top-0 h-screen z-30">
        <div className="flex items-center gap-3 mb-16">
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
           <LogoutLink className="flex items-center gap-4 text-slate-500 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-red-400 transition-all">Logout</LogoutLink>
        </div>
      </aside>

      {/* Main Grid */}
      <main className="flex-1 p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />
        <header className="mb-12 relative z-10">
          <p className="text-blue-400 font-black uppercase text-[10px] tracking-[0.4em] mb-2">Systems</p>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Global Linkage</h2>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {PLATFORMS.map((p) => {
            const isConnected = accounts.some(acc => acc.platform === p.id);
            return (
              <div key={p.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center text-xl font-black`}>{p.icon}</div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight">{p.id}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isConnected ? 'text-green-500' : 'text-slate-500'}`}>
                      {isConnected ? 'Active' : 'Not Linked'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleConnect(p.id)}
                  className={`p-3 rounded-xl transition-all ${isConnected ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-110'}`}
                >
                  {isConnected ? <CheckCircle2 size={18}/> : <Zap size={18}/>}
                </button>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}