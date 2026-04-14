"use client";

import { useState } from "react";
import { 
  Facebook, 
  Instagram, 
  Send, 
  Twitter, 
  Linkedin, 
  CheckCircle, 
  XCircle, 
  LayoutDashboard, 
  Link2, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut,
  Bell
} from "lucide-react";

// బిల్డ్ ఎర్రర్స్ రాకుండా ఇది కూడా ఉంచుదాం
export const dynamic = "force-dynamic";

const platforms = [
  { id: "fb_page", name: "Facebook Page", icon: Facebook, color: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "fb_group", name: "Facebook Group", icon: Facebook, color: "text-indigo-600", bgColor: "bg-indigo-50" },
  { id: "ig_business", name: "Instagram Business", icon: Instagram, color: "text-pink-600", bgColor: "bg-pink-50" },
  { id: "telegram_channel", name: "Telegram Channel", icon: Send, color: "text-sky-500", bgColor: "bg-sky-50" },
  { id: "twitter_x", name: "Twitter / X", icon: Twitter, color: "text-slate-900", bgColor: "bg-slate-100" },
  { id: "linkedin_profile", name: "LinkedIn Profile", icon: Linkedin, color: "text-blue-700", bgColor: "bg-blue-50" },
];

export default function Dashboard() {
  // టెంపరరీగా కొన్ని అకౌంట్స్ కనెక్ట్ అయినట్టు చూపిస్తున్నాం
  const [connections] = useState<Record<string, any>>({
    fb_page: { connected: true, accountName: "PostJet Official" },
    ig_business: { connected: true, accountName: "@jeevapost" },
  });

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* --- Sidebar Navigation --- */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-lg">
            <Send className="text-white w-6 h-6 rotate-12" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">PostJet</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard w-5 h-5 />} label="Dashboard" active />
          <NavItem icon={<Link2 w-5 h-5 />} label="Connections" />
          <NavItem icon={<Calendar w-5 h-5 />} label="Schedules" />
          <NavItem icon={<BarChart3 w-5 h-5 />} label="Analytics" />
          <NavItem icon={<Settings w-5 h-5 />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-rose-600 hover:bg-rose-50 rounded-lg transition">
            <LogOut w-5 h-5 />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-700">Account Connections</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell w-5 h-5 />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-slate-200 rounded-full border border-slate-300"></div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Connect Channels</h1>
            <p className="text-slate-500 mt-1">మీ సోషల్ మీడియా అకౌంట్స్‌ని కనెక్ట్ చేసి ఆటోమేషన్ మొదలుపెట్టండి.</p>
          </div>

          {/* Platform Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const isConnected = connections[platform.id]?.connected;
              const Icon = platform.icon;

              return (
                <div key={platform.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl ${platform.bgColor} ${platform.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    {isConnected ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                        <CheckCircle className="w-3.5 h-3.5" /> CONNECTED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 text-xs font-bold rounded-full border border-slate-100">
                        <XCircle className="w-3.5 h-3.5" /> DISCONNECTED
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{platform.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-6">
                    {isConnected 
                      ? `Active: ${connections[platform.id].accountName}` 
                      : `మీ ${platform.name} అకౌంట్‌ని ఇక్కడ లింక్ చేయండి.`}
                  </p>

                  <button 
                    className={`w-full py-3 rounded-xl font-bold transition ${
                      isConnected 
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200"
                    }`}
                  >
                    {isConnected ? "Manage Account" : `Connect ${platform.name}`}
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

// Sidebar Item Component
function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition font-medium ${
      active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}