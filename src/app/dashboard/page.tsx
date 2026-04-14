export const dynamic = "force-dynamic";

import { useState } from "react";
import { Facebook, Instagram, Send, Twitter, Linkedin, CheckCircle, XCircle } from "lucide-react";

// ప్లాట్‌ఫామ్ కార్డుల కోసం డేటా (తర్వాత డేటాబేస్ నుండి తెచ్చుకుంటాం)
const platformConfig = [
  { id: "fb_page", name: "Facebook Page", icon: Facebook, color: "blue" },
  { id: "fb_group", name: "Facebook Group", icon: Facebook, color: "indigo" },
  { id: "ig_business", name: "Instagram Business", icon: Instagram, color: "pink" },
  { id: "telegram_channel", name: "Telegram Channel", icon: Send, color: "sky" },
  { id: "twitter_x", name: "Twitter / X", icon: Twitter, color: "gray" },
  { id: "linkedin_profile", name: "LinkedIn Profile", icon: Linkedin, color: "blue" },
];

export default function Dashboard() {
  // ఇది టెస్టింగ్ కోసం Dummy State, తర్వాత డేటాబేస్ నుండి తెచ్చుకుంటాం
  const [connections, setConnections] = useState<Record<string, { status: boolean; name: string }>>({
    fb_page: { status: true, name: "Travel Vibes Page" },
    ig_business: { status: true, name: "@jeevapost" },
    telegram_channel: { status: false, name: "" },
    twitter_x: { status: false, name: "" },
  });

  const sidebarLinks = [
    { name: "Dashboard", icon: "🏠", current: false },
    { name: "Social Accounts", icon: "🔗", current: true },
    { name: "Scheduled Posts", icon: "📅", current: false },
    { name: "Analytics", icon: "📊", current: false },
    { name: "Settings", icon: "⚙️", current: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
        <div className="flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">🚀</div>
          <span className="text-2xl font-bold text-slate-950">PostJet</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((link) => (
            <a key={link.name} href="#" className={`flex items-center space-x-3.5 px-4 py-3 rounded-lg text-lg font-medium transition ${link.current ? 'bg-slate-900 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}`}>
              <span className="text-2xl">{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}
        </nav>
        
        <div className="mt-auto border-t border-slate-200 pt-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">J</div>
            <div>
              <div className="font-semibold text-slate-900">Jeevan Kumar</div>
              <div className="text-sm text-slate-600">jeeva@postjet.ai</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 lg:p-12 overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight">Connect Your Social Accounts</h1>
          <p className="mt-3 text-xl text-slate-700 max-w-2xl">
            PostJet ద్వారా ఆటోమేటిగ్గా పోస్ట్ చేయడానికి నీ ఫేవరెట్ సోషల్ మీడియా ప్లాట్‌ఫామ్‌లను ఇక్కడ లింక్ చెయ్యి.
          </p>
        </header>

        {/* Connections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platformConfig.map((platform) => {
            const Icon = platform.icon;
            const connection = connections[platform.id];
            const isConnected = connection?.status;
            
            return (
              <div key={platform.id} className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 bg-${platform.color}-50 text-${platform.color}-600 rounded-xl`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  
                  {isConnected ? (
                    <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-100">
                      <CheckCircle className="w-5 h-5" />
                      <span>Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full text-sm font-semibold border border-rose-100">
                      <XCircle className="w-5 h-5" />
                      <span>Not Connected</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-950 mb-2">{platform.name}</h3>
                
                {isConnected ? (
                  <p className="text-slate-700 mb-6 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                    <span className="font-medium text-lg">Active:</span> 
                    <span className="text-base text-slate-600 truncate">{connection.name}</span>
                  </p>
                ) : (
                  <p className="text-slate-600 mb-6 text-base">
                    నీ పోస్ట్‌లను ఈ ప్లాట్‌ఫామ్‌లో ఆటోమేటిగ్గా షేర్ చేయడానికి అకౌంట్ ని కనెక్ట్ చెయ్యి.
                  </p>
                )}
                
                <div className="flex gap-4">
                  {isConnected ? (
                    <>
                      <button className="flex-1 py-3 bg-slate-100 text-slate-900 rounded-xl font-semibold hover:bg-slate-200 transition text-lg">
                        Manage
                      </button>
                      <button className="flex-1 py-3 border border-slate-200 text-rose-700 rounded-xl font-semibold hover:bg-rose-50 transition text-lg">
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button className="w-full py-3 bg-slate-950 text-white rounded-xl font-semibold hover:bg-slate-800 transition text-lg">
                      Connect Account
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}