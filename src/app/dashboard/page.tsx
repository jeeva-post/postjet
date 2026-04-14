"use client";

import { useState } from "react";
import { 
  Facebook, Instagram, Send, Twitter, Linkedin, Youtube, Globe, MessageSquare, Play, Hash,
  LayoutDashboard, Link2, Calendar, BarChart3, Settings, LogOut, Bell, Plus, UserCircle, ChevronRight, Zap
} from "lucide-react";

export const dynamic = "force-dynamic";

// 12+ Global Platforms with Original Brand Colors
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
    fb_page: { connected: true, accountName: "PostJet Global HQ" },
    ig_business: { connected: true, accountName: "@postjet_io" },
    telegram_channel: { connected: false, accountName: "" },
  });

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans antialiased text-slate-900">
      
      {/* --- Column 1: Left Sidebar (Navigation & Settings) --- */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-30 shadow-sm">
        <div className="p-7 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
            <Send className="text-white w-6 h-6 rotate-12" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-950">PostJet</span>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-1.5 overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 px-4 mb-3 uppercase tracking-wider">Menu</p>
          <NavItem icon={<LayoutDashboard size={22} />} label="Overview" />
          <NavItem icon={<Link2 size={22} />} label="Connect Accounts" active />
          <NavItem icon={<Calendar size={22} />} label="Schedules" />
          <NavItem icon={<BarChart3 size={22} />} label="Analytics" />
          
          <div className="pt-8 space-y-1.5">
            <p className="text-xs font-bold text-slate-400 px-4 mb-3 uppercase tracking-wider">Account Settings</p>
            <NavItem icon={<Settings size={22} />} label="Preferences" />
            <NavItem icon={<Bell size={22} />} label="Notifications" />
          </div>
        </nav>

        <div className="p-5 mt-auto border-t border-slate-100">
          <button className="flex items-center gap-3.5 px-5 py-4 w-full text-slate-500 hover:text-white hover:bg-slate-900 rounded-2xl transition-all duration-200 font-semibold group">
            <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- Column 2: Middle Content Area (Apps Grid) --- */}
      <main className="flex-1 p-10 xl:p-14 overflow-y-auto">
        <header className="mb-14">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-950 tracking-tighter">Integrations Center</h1>
              <p className="text-slate-600 mt-3 text-lg xl:text-xl font-medium max-w-2xl">
                Automate your global presence. Link your favorite social networks to PostJet in one click.
              </p>
            </div>
            <button className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-300 flex items-center gap-2.5 active:scale-95">
              <Plus size={22} /> Add Channel
            </button>
          </div>
        </header>

        {/* 12+ Platforms Grid with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {platforms.map((platform) => {
            const isConnected = connections[platform.id]?.connected;
            const Icon = platform.icon;

            return (
              <div key={platform.id} 
                className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
                
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 rounded-2xl shadow-inner transition-transform group-hover:rotate-6" style={{ backgroundColor: platform.bgColor, color: platform.color }}>
                    <Icon size={36} strokeWidth={2.5} />
                  </div>
                  {isConnected ? (
                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-[10px] tracking-widest font-black rounded-full border border-green-100 uppercase flex items-center gap-1">
                      <Zap size={14} className="fill-green-700" /> Connected
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] tracking-widest font-black rounded-full border border-slate-100 uppercase">Disconnected</span>
                  )}
                </div>

                <h3 className="text-2xl font-extrabold text-slate-950">{platform.name}</h3>
                <p className="text-slate-500 mt-2 mb-8 font-medium leading-relaxed h-12 overflow-hidden line-clamp-2">
                  {isConnected 
                    ? `Linked to: ${connections[platform.id].accountName}` 
                    : `Link your ${platform.name} account to begin automation.`}
                </p>

                <button className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md ${
                  isConnected 
                    ? "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 shadow-lg"
                }`}>
                  {isConnected ? "Manage Account" : "Connect Now"} <ChevronRight size={18} className="opacity-60 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- Column 3: Right Profile Panel --- */}
      <aside className="w-80 bg-white border-l border-slate-200 sticky top-0 h-screen z-30 p-8 flex flex-col shadow-sm">
        <div className="flex items-center gap-5 mb-10 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-blue-200 border-4 border-white">J</div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-950">Jeevan Kumar</h2>
            <p className="text-slate-500 font-medium">jeeva@postjet.ai</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-10">
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Current Plan</h4>
          <p className="text-3xl font-black text-slate-950 tracking-tight">PostJet Pro <span className="text-base text-slate-500 font-medium">/ Yearly</span></p>
          <p className="text-sm text-slate-600 mt-1">Renewal on April 14, 2027</p>
          <button className="w-full mt-5 py-3.5 bg-white border border-blue-200 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition shadow-sm">Upgrade Plan</button>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Activity</p>
          <ActivityItem platform="fb_page" message="Scheduled new post to Official HQ" time="2 min ago" />
          <ActivityItem platform="ig_business" message="Published image to @postjet_io" time="1 hour ago" />
          <ActivityItem platform="linkedin_profile" message="Updated automation rules" time="3 hours ago" />
        </div>

        <button className="mt-auto w-full py-4 bg-slate-100 text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-200 transition">
          <UserCircle size={22} /> View Full Profile
        </button>
      </aside>
    </div>
  );
}

// NavItem Component with active state styling
function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 px-5 py-4 w-full rounded-2xl transition-all duration-200 font-bold ${
      active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
    }`}>
      {icon} 
      <span>{label}</span>
    </button>
  );
}

// Activity Item for Right Panel
const platformIcons: Record<string, any> = { fb_page: Facebook, ig_business: Instagram, linkedin_profile: Linkedin };
function ActivityItem({ platform, message, time }: { platform: string, message: string, time: string }) {
  const Icon = platformIcons[platform] || Globe;
  return (
    <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-xl transition">
      <div className="p-2.5 rounded-xl bg-slate-100 text-slate-500 mt-1">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800 leading-snug">{message}</p>
        <p className="text-xs text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}