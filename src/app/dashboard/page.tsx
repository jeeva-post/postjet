"use client";

import { useState } from "react";
import { 
  Facebook, Instagram, Send, Twitter, Linkedin, 
  CheckCircle, XCircle, LayoutDashboard, Link2, 
  Calendar, BarChart3, Settings, LogOut, Bell, Plus,
  Youtube, Globe, MessageSquare, Play, Hash
} from "lucide-react";

export const dynamic = "force-dynamic";

// Global Platforms with Brand Colors
const platforms = [
  { id: "fb_page", name: "Facebook Page", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
  { id: "fb_group", name: "Facebook Group", icon: Facebook, color: "#4267B2", bgColor: "#f0f2f5" },
  { id: "ig_business", name: "Instagram Business", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
  { id: "telegram_channel", name: "Telegram Channel", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  { id: "x_twitter", name: "X (Twitter)", icon: Twitter, color: "#000000", bgColor: "#f3f4f6" },
  { id: "linkedin_profile", name: "LinkedIn Profile", icon: Linkedin, color: "#0077b5", bgColor: "#e0f2fe" },
  { id: "youtube_channel", name: "YouTube", icon: Youtube, color: "#FF0000", bgColor: "#fff1f1" },
  { id: "pinterest_board", name: "Pinterest", icon: Hash, color: "#BD081C", bgColor: "#fff1f1" },
  { id: "tiktok_profile", name: "TikTok", icon: Play, color: "#000000", bgColor: "#f3f4f6" },
  { id: "reddit_sub", name: "Reddit", icon: MessageSquare, color: "#FF4500", bgColor: "#fff5f1" },
  { id: "whatsapp_business", name: "WhatsApp", icon: Globe, color: "#25D366", bgColor: "#f0fff4" },
  { id: "discord_server", name: "Discord", icon: MessageSquare, color: "#5865F2", bgColor: "#f0f2ff" },
];

export default function Dashboard() {
  const [connections] = useState<Record<string, any>>({
    fb_page: { connected: true, accountName: "PostJet Global" },
    ig_business: { connected: true, accountName: "@postjet_io" },
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- Global Sidebar --- */}
      <aside className="w-72 bg-[#0f172a] text-white hidden lg:flex flex-col shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
            <Send className="text-white w-6 h-6 rotate-12" />
          </div>
          <span className="text-2xl font-black tracking-tighter">PostJet</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<Link2 size={20} />} label="Connect Accounts" />
          <NavItem icon={<Calendar size={20} />} label="Content Calendar" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- Main Dashboard Area --- */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-2 font-medium text-slate-500">
            <span>Admin</span> <span className="text-slate-300">/</span> <span className="text-slate-900 font-bold">Connections</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <p className="text-sm font-bold text-slate-900">Jeevan Kumar</p>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">J</div>
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><Bell size={22} /></button>
          </div>
        </header>

        {/* Content Section */}
        <div className="p-10 max-w-[1600px] mx-auto w-full">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Connect Channels</h1>
              <p className="text-slate-500 mt-2 text-lg">Manage and automate your global social presence from one place.</p>
            </div>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-2">
              <Plus size={20} /> Add Channel
            </button>
          </div>

          {/* Platforms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {platforms.map((platform) => {
              const isConnected = connections[platform.id]?.connected;
              const Icon = platform.icon;

              return (
                <div key={platform.id} className="bg-white rounded-[2rem] border border-slate-200 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl shadow-inner" style={{ backgroundColor: platform.bgColor, color: platform.color }}>
                      <Icon size={32} strokeWidth={2.5} />
                    </div>
                    {isConnected ? (
                      <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] tracking-widest font-black rounded-full border border-green-100 uppercase">Active</span>
                    ) : (
                      <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] tracking-widest font-black rounded-full border border-slate-100 uppercase">Offline</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900">{platform.name}</h3>
                  <p className="text-slate-500 mt-2 mb-8 font-medium">
                    {isConnected ? `Connected as ${connections[platform.id].accountName}` : `Link your ${platform.name} account to start.`}
                  </p>

                  <button className={`w-full py-4 rounded-2xl font-bold transition-all ${
                    isConnected ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200" : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}>
                    {isConnected ? "Settings" : "Connect Now"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 px-5 py-4 w-full rounded-2xl transition-all font-bold ${
      active ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`}>
      {icon} <span>{label}</span>
    </button>
  );
}