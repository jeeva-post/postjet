"use client";
import React, { useState, useEffect } from "react";
import { Globe, LayoutDashboard, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { getUserAccounts } from "../../actions/account-actions";

const PLATFORMS = [
  { id: "Facebook", icon: "f", color: "text-[#1877F2]", bg: "bg-[#1877F2]/10", scope: "pages_manage_posts,pages_read_engagement" },
  { id: "Instagram", icon: "i", color: "text-[#E1306C]", bg: "bg-[#E1306C]/10", scope: "instagram_basic,instagram_content_publish" },
  { id: "LinkedIn", icon: "l", color: "text-[#0077B5]", bg: "bg-[#0077B5]/10", scope: "w_member_social" },
  { id: "X", icon: "x", color: "text-white", bg: "bg-white/10", scope: "tweet.read,tweet.write,users.read" },
  { id: "Reddit", icon: "r", color: "text-[#FF4500]", bg: "bg-[#FF4500]/10", scope: "submit,identity" },
  { id: "Pinterest", icon: "p", color: "text-[#BD081C]", bg: "bg-[#BD081C]/10", scope: "boards:read,pins:read,pins:write" },
  { id: "YouTube", icon: "y", color: "text-[#FF0000]", bg: "bg-[#FF0000]/10", scope: "https://www.googleapis.com/auth/youtube.upload" },
  { id: "TikTok", icon: "tk", color: "text-white", bg: "bg-white/10", scope: "video.upload,user.info.basic" },
  { id: "Snapchat", icon: "s", color: "text-[#FFFC00]", bg: "bg-[#FFFC00]/10", scope: "snapchat-marketing-api" },
  { id: "Telegram", icon: "t", color: "text-[#0088cc]", bg: "bg-[#0088cc]/10", scope: "bot" }, // Special Direct Link
  { id: "WhatsApp", icon: "w", color: "text-[#25D366]", bg: "bg-[#25D366]/10", scope: "whatsapp_business_messaging" },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => { setAccounts(await getUserAccounts()); };
    load();
  }, []);

  const initiateOAuth = (p: any) => {
    const baseUrl = "https://postjet.vercel.app/api/auth/callback";
    let authUrl = "";

    switch(p.id) {
      case "Facebook":
        authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FB_APP_ID}&redirect_uri=${baseUrl}/facebook&scope=${p.scope}`;
        break;
      case "LinkedIn":
        authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID}&redirect_uri=${baseUrl}/linkedin&scope=${p.scope}`;
        break;
      case "Reddit":
        authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.NEXT_PUBLIC_REDDIT_ID}&response_type=code&state=pj&redirect_uri=${baseUrl}/reddit&duration=permanent&scope=${p.scope}`;
        break;
      case "Telegram":
        // టెలిగ్రామ్ కి డైరెక్ట్ గా మన బాట్ లింక్ ఇస్తాం, అది నొక్కితే ఆటోమేటిక్ గా లింక్ అవుతుంది
        authUrl = `https://t.me/PostJetBot?start=${user_id_here}`; 
        break;
      default:
        alert(`${p.id} login is being integrated with official SDK.`);
        return;
    }
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex">
      {/* Sidebar - Same Sleek Design */}
      <aside className="w-72 bg-slate-900/50 border-r border-slate-800 p-8 h-screen sticky top-0">
        <div className="mb-16 font-black text-3xl italic tracking-tighter">Post<span className="text-blue-500">Jet</span></div>
        <nav className="space-y-4">
          <a href="/dashboard" className="flex items-center gap-4 text-slate-400 p-4 font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 rounded-2xl">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 bg-blue-600 text-white p-4 font-black text-[11px] uppercase tracking-widest rounded-2xl">
            <Globe size={20} /> Connections
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-12">
        <header className="mb-12">
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Instant Linkage</h2>
          <p className="text-slate-400 mt-2 italic">Connect all platforms with 1-click official login.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORMS.map((p) => {
            const isConnected = accounts.some(acc => acc.platform === p.id);
            return (
              <div key={p.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${p.bg} ${p.color} rounded-2xl flex items-center justify-center text-xl font-black`}>{p.icon}</div>
                  <div>
                    <h4 className="text-sm font-black uppercase">{p.id}</h4>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${isConnected ? 'text-green-500' : 'text-slate-500'}`}>
                      {isConnected ? 'Sync Active' : 'Ready to Link'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => initiateOAuth(p)}
                  className={`p-3 rounded-xl transition-all ${isConnected ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-110'}`}
                >
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