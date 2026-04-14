"use client";

import { useState } from "react";
import { 
  Facebook, Instagram, Send, Twitter, Linkedin, 
  CheckCircle, XCircle, LayoutDashboard, Link2, 
  Calendar, BarChart3, Settings, LogOut, Bell, Plus
} from "lucide-react";

export const dynamic = "force-dynamic";

const platforms = [
  { id: "fb_page", name: "Facebook Page", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
  { id: "fb_group", name: "Facebook Group", icon: Facebook, color: "#4267B2", bgColor: "#f0f2f5" },
  { id: "ig_business", name: "Instagram Business", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
  { id: "telegram_channel", name: "Telegram Channel", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  { id: "twitter_x", name: "Twitter / X", icon: Twitter, color: "#000000", bgColor: "#f3f4f6" },
  { id: "linkedin_profile", name: "LinkedIn Profile", icon: Linkedin, color: "#0077b5", bgColor: "#e0f2fe" },
];

export default function Dashboard() {
  const [connections] = useState<Record<string, any>>({
    fb_page: { connected: true, accountName: "PostJet Official Page" },
    ig_business: { connected: true, accountName: "@jeevapost_saas" },
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* --- Sidebar --- */}
      <aside className="w-72 bg-[#0f172a] text-white hidden md:flex flex-col shadow-2xl">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-xl shadow-lg shadow-blue-500/30">
            <Send className="text-white w-6 h-6 rotate-12" />
          </div>
          <span className="text-2xl font-black tracking-tight">PostJet</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Link2 size={20} />} label="Connections" />
          <NavItem icon={<Calendar size={20} />} label="Schedules" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
            <LogOut size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Pages /</span>
            <span className="text-slate-900 font-bold">Connections</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Jeevan Kumar</p>
                <p className="text-xs text-slate-500">Pro Plan</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">J</div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Social Accounts</h1>
              <p className="text-slate-500 mt-2 text-lg font-medium">మీ సోషల్ మీడియా అకౌంట్స్‌ని కనెక్ట్ చేసి ఆటోమేషన్ మొదలుపెట్టండి.</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
              <Plus size={20} /> Add New Channel
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform) => {
              const isConnected = connections[platform.id]?.connected;
              const Icon = platform.icon;

              return (
                <div key={platform.id} className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl shadow-inner transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: platform.bgColor, color: platform.color }}>
                      <Icon size={32} strokeWidth={2.5} />
                    </div>
                    {isConnected ? (
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] tracking-widest font-black rounded-full border border-emerald-100 uppercase">
                        <CheckCircle size={14} /> Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] tracking-widest font-black rounded-full border border-slate-100 uppercase">
                        <XCircle size={14} /> Disconnected
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900">{platform.name}</h3>
                  <p className="text-slate-500 mt-2 mb-8 font-medium leading-relaxed">
                    {isConnected 
                      ? `అకౌంట్: ${connections[platform.id].accountName}` 
                      : `మీ ${platform.name} అకౌంట్‌ని లింక్ చేయడానికి సిద్ధంగా ఉంది.`}
                  </p>

                  <button 
                    className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                      isConnected 
                        ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200" 
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-md active:scale-[0.98]"
                    }`}
                  >
                    {isConnected ? "Manage Integration" : `Connect ${platform.name}`}
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

// NavItem Component
function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 px-5 py-4 w-full rounded-2xl transition-all duration-200 font-bold ${
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-slate-800/50"
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}