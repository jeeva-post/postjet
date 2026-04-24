"use client";
import React, { useState, useEffect } from "react";
import { Globe, LayoutDashboard, CheckCircle2, Zap } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions";

const PLATFORMS = [
  { id: "Facebook", key: "facebook", icon: "f", color: "text-[#1877F2]", bg: "bg-[#1877F2]/10" },
  { id: "Instagram", key: "instagram", icon: "i", color: "text-[#E1306C]", bg: "bg-[#E1306C]/10" },
  { id: "LinkedIn", key: "linkedin", icon: "l", color: "text-[#0077B5]", bg: "bg-[#0077B5]/10" },
  { id: "Reddit", key: "reddit", icon: "r", color: "text-[#FF4500]", bg: "bg-[#FF4500]/10" },
  { id: "X", key: "twitter", icon: "x", color: "text-white", bg: "bg-white/10" },
  { id: "Pinterest", key: "pinterest", icon: "p", color: "text-[#BD081C]", bg: "bg-[#BD081C]/10" },
  { id: "YouTube", key: "youtube", icon: "y", color: "text-[#FF0000]", bg: "bg-[#FF0000]/10" },
  { id: "TikTok", key: "tiktok", icon: "tk", color: "text-white", bg: "bg-white/10" },
  { id: "Telegram", key: "telegram", icon: "t", color: "text-[#0088cc]", bg: "bg-[#0088cc]/10" },
  { id: "WhatsApp", key: "whatsapp", icon: "w", color: "text-[#25D366]", bg: "bg-[#25D366]/10" },
  { id: "Snapchat", key: "snapchat", icon: "s", color: "text-[#FFFC00]", bg: "bg-[#FFFC00]/10" },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => { setAccounts(await getUserAccounts()); };
    load();
  }, []);

  const handleConnect = (p: any) => {
    const baseUrl = window.location.origin;
    const callbackUrl = `${baseUrl}/api/auth/callback/${p.key}`;
    
    let authUrl = "";
    if (p.key === "facebook" || p.key === "instagram") {
      authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FB_APP_ID}&redirect_uri=${callbackUrl}&scope=pages_manage_posts,pages_read_engagement,pages_show_list,instagram_basic,instagram_content_publish`;
    } else if (p.key === "linkedin") {
      authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${callbackUrl}&scope=w_member_social`;
    } else if (p.key === "reddit") {
      authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.NEXT_PUBLIC_REDDIT_ID}&response_type=code&state=pj&redirect_uri=${callbackUrl}&duration=permanent&scope=submit,identity`;
    } else {
      // ఇతర ప్లాట్‌ఫామ్స్ కి కూడా ఇదే విధంగా URL లు ఇవ్వాలి
      alert(`Connecting to ${p.id} via official Secure Login...`);
      window.location.href = `/api/auth/social/${p.key}`; 
    }
    
    if (authUrl) window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex">
      {/* Sidebar - నీ పాత డిజైన్ అలాగే ఉంటుంది */}
      <aside className="w-72 bg-slate-900/50 border-r border-slate-800 p-8 h-screen sticky top-0">
        <div className="mb-16 font-black text-3xl italic tracking-tighter">Post<span className="text-blue-500">Jet</span></div>
        <nav className="space-y-4">
          <a href="/dashboard" className="text-slate-400 p-4 block font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 rounded-2xl">Dashboard</a>
          <a href="/dashboard/accounts" className="bg-blue-600 text-white p-4 block font-black text-[11px] uppercase tracking-widest rounded-2xl">Connections</a>
        </nav>
      </aside>

      <main className="flex-1 p-12">
        <header className="mb-12">
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Instant Linkage</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORMS.map((p) => {
            const isConnected = accounts.some(acc => acc.platform.toLowerCase() === p.key);
            return (
              <div key={p.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center text-xl font-black`}>{p.icon}</div>
                  <div>
                    <h4 className="text-sm font-black uppercase">{p.id}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${isConnected ? 'text-green-500' : 'text-slate-500'}`}>
                      {isConnected ? 'Active' : 'Ready'}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleConnect(p)} className={`p-3 rounded-xl transition-all ${isConnected ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-110'}`}>
                  {isConnected ? <CheckCircle2 size={18}/> : <Zap size={18}/>}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}