"use client";

import { useState } from "react";
import { 
  Facebook, Instagram, Send, Twitter, Linkedin, Youtube, Globe, MessageSquare, Play, Hash,
  LayoutDashboard, Link2, Calendar, BarChart3, Settings, LogOut, Bell, Plus, UserCircle, ChevronRight, Zap
} from "lucide-react";

export const dynamic = "force-dynamic";

const platforms = [
  { id: "fb_page", name: "Facebook Page", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
  { id: "fb_group", name: "Facebook Group", icon: Facebook, color: "#4267B2", bgColor: "#f0f2f5" },
  { id: "ig_business", name: "Instagram Business", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
  { id: "telegram_channel", name: "Telegram Channel", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  { id: "x_twitter", name: "X (Twitter)", icon: Twitter, color: "#000000", bgColor: "#f3f4f6" },
  { id: "linkedin_profile", name: "LinkedIn Profile", icon: Linkedin, color: "#0077b5", bgColor: "#e0f2fe" },
  { id: "youtube_channel", name: "YouTube Channel", icon: Youtube, color: "#FF0000", bgColor: "#fff1f1" },
  { id: "pinterest_board", name: "Pinterest Board", icon: Hash, color: "#BD081C", bgColor: "#fff1f1" },
  { id: "tiktok_profile", name: "TikTok Profile", icon: Play, color: "#000000", bgColor: "#f3f4f6" },
  { id: "reddit_sub", name: "Reddit Sub", icon: MessageSquare, color: "#FF4500", bgColor: "#fff5f1" },
  { id: "whatsapp_business", name: "WhatsApp Biz", icon: Globe, color: "#25D366", bgColor: "#f0fff4" },
  { id: "discord_server", name: "Discord Server", icon: MessageSquare, color: "#5865F2", bgColor: "#f0f2ff" },
];

export default function Dashboard() {
  const [connections] = useState<Record<string, any>>({
    fb_page: { connected: true, accountName: "PostJet Global" },
    ig_business: { connected: true, accountName: "@jeevapost" },
  });

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm">
        <div className="p-7 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Send size={24} className="rotate-12" /></div>
          <span className="text-2xl font-black">PostJet</span>
        </div>
        <nav className="flex-1 px-4 mt-8 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem icon={<Link2 size={20} />} label="Connect" active />
          <NavItem icon={<Calendar size={20} />} label="Schedules" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
        </nav>
        <div className="p-5 border-t border-slate-100">
          <button className="flex items-center gap-3 p-4 w-full text-slate-500 hover:bg-slate-900 hover:text-white rounded-2xl transition font-bold"><LogOut size={20} /> Sign Out</button>
        </div>
      </aside>

      {/* Main Apps Grid */}
      <main className="flex-1 p-10 overflow-y-auto h-screen bg-[#f8fafc]">
        <header className="flex justify-between items-end mb-10">
          <div><h1 className="text-4xl font-black">Integrations</h1><p className="text-slate-500 font-medium italic">Global SaaS Automation Dashboard</p></div>
          <button className="bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-bold shadow-xl flex items-center gap-2"><Plus size={20} /> Add Channel</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {platforms.map((platform) => {
            const isConnected = connections[platform.id]?.connected;
            const Icon = platform.icon;
            return (
              <div key={platform.id} className="group bg-white rounded-3xl border border-slate-100 p-7 shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer">
                <div className="flex justify-between mb-6">
                  <div className="p-3.5 rounded-2xl group-hover:rotate-6 transition" style={{ backgroundColor: platform.bgColor, color: platform.color }}><Icon size={32} /></div>
                  {isConnected ? <span className="px-3 py-1 bg-green-50 text-green-700 text-[9px] font-black rounded-full uppercase flex items-center gap-1"><Zap size={12} /> Active</span> : <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black rounded-full uppercase">Offline</span>}
                </div>
                <h3 className="text-xl font-black">{platform.name}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-6 h-10 line-clamp-2">{isConnected ? `Linked: ${connections[platform.id].accountName}` : `Connect your ${platform.name}.`}</p>
                <button className={`w-full py-3.5 rounded-2xl font-bold text-sm ${isConnected ? "bg-slate-50 border border-slate-200 text-slate-700" : "bg-slate-950 text-white hover:bg-slate-800"}`}>{isConnected ? "Settings" : "Connect"} <ChevronRight size={16} className="inline ml-1" /></button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Right Profile Side */}
      <aside className="w-80 bg-white border-l border-slate-200 hidden xl:flex flex-col h-screen sticky top-0 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white">J</div>
          <div><h2 className="text-lg font-black">Jeevan Kumar</h2><p className="text-slate-400 text-xs font-bold uppercase">Pro Account</p></div>
        </div>
        <div className="bg-slate-950 p-6 rounded-[2rem] text-white shadow-2xl mb-8">
          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Status</h4>
          <p className="text-3xl font-black tracking-tighter">Running 🚀</p>
        </div>
        <button className="mt-auto w-full py-4 bg-slate-100 text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-200 transition"><UserCircle size={20} /> Edit Profile</button>
      </aside>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl transition font-bold text-sm ${active ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"}`}>
      {icon} <span>{label}</span>
    </button>
  );
}