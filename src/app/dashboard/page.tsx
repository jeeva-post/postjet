"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { 
  Facebook, Instagram, Send, Twitter, Linkedin, Youtube, Globe, MessageSquare, Play, Hash,
  LayoutDashboard, Link2, Calendar, BarChart3, Settings, LogOut, Bell, Plus, UserCircle, ChevronRight, Zap
} from "lucide-react";

export const dynamic = "force-dynamic";

const platforms = [
  { id: "facebook", name: "Facebook Page", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
  { id: "instagram", name: "Instagram Business", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
  { id: "youtube", name: "YouTube Channel", icon: Youtube, color: "#FF0000", bgColor: "#fff1f1" },
  { id: "telegram", name: "Telegram Channel", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  { id: "slack", name: "Slack Workspace", icon: MessageSquare, color: "#4A154B", bgColor: "#f3e8ff" },
  { id: "discord", name: "Discord Server", icon: MessageSquare, color: "#5865F2", bgColor: "#f0f2ff" },
  { id: "twitter", name: "X (Twitter)", icon: Twitter, color: "#000000", bgColor: "#f3f4f6" },
  { id: "linkedin", name: "LinkedIn Profile", icon: Linkedin, color: "#0077b5", bgColor: "#e0f2fe" },
];

export default function Dashboard() {
  const [connections] = useState<Record<string, any>>({});

  const handleConnect = async (platformId: string) => {
    const oauthPlatforms = ["facebook", "instagram", "youtube", "slack", "discord"];
    
    if (oauthPlatforms.includes(platformId)) {
      // Instagram and Facebook both use Facebook Provider
      const provider = (platformId === "instagram") ? "facebook" : 
                       (platformId === "youtube") ? "google" : platformId;
      await signIn(provider);
    } else {
      alert(`${platformId} integration coming soon! Make sure your API keys are set.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans antialiased text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm">
        <div className="p-7 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg text-white">
            <Send size={24} className="rotate-12" />
          </div>
          <span className="text-2xl font-black tracking-tighter">PostJet</span>
        </div>
        <nav className="flex-1 px-4 mt-8 space-y-1.5 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem icon={<Link2 size={20} />} label="Integrations" active />
          <NavItem icon={<Calendar size={20} />} label="Schedules" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
        </nav>
        <div className="p-5 border-t border-slate-100">
          <button onClick={() => signIn()} className="flex items-center gap-3 px-5 py-4 w-full text-slate-500 hover:text-white hover:bg-slate-900 rounded-2xl transition-all font-bold group">
            <LogOut size={20} />
            <span>Sign In / Out</span>
          </button>
        </div>
      </aside>

      {/* Main Grid */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen bg-[#f8fafc]">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Channels</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium italic">Your Social Media Command Center</p>
          </div>
          <button className="bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all">
            <Plus size={20} /> Add New
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {platforms.map((platform) => {
            const isConnected = connections[platform.id]?.connected;
            const Icon = platform.icon;
            return (
              <div key={platform.id} className="group bg-white rounded-[2rem] border border-slate-100 p-7 shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] cursor-pointer">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3.5 rounded-2xl shadow-inner transition-transform group-hover:rotate-6" style={{ backgroundColor: platform.bgColor, color: platform.color }}>
                    <Icon size={32} strokeWidth={2.5} />
                  </div>
                  {isConnected ? (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-[9px] tracking-widest font-black rounded-full border border-green-100 uppercase flex items-center gap-1">
                      <Zap size={12} className="fill-green-700" /> Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] tracking-widest font-black rounded-full border border-slate-100 uppercase">Offline</span>
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-950">{platform.name}</h3>
                <p className="text-slate-500 text-sm mt-1 mb-6 h-10 line-clamp-2">Connect and automate your {platform.name} presence.</p>
                <button 
                  onClick={() => handleConnect(platform.id)}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isConnected ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200" : "bg-slate-950 text-white hover:bg-slate-800 shadow-md"
                }`}>
                  {isConnected ? "Settings" : "Connect"} <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl transition-all duration-200 font-bold text-sm ${
      active ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
    }`}>
      {icon} <span>{label}</span>
    </button>
  );
}