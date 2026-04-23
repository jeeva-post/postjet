"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Settings, Link as LinkIcon, Shield, 
  ChevronRight, LayoutDashboard, Globe,
  CheckCircle2, AlertCircle, Rocket
} from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function AccountsPage() {
  const apps = [
    { name: "Telegram", status: "Connected", icon: "T", color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Instagram", status: "Not Connected", icon: "I", color: "text-pink-500", bg: "bg-pink-500/10" },
    { name: "YouTube", status: "Not Connected", icon: "Y", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "Snapchat", status: "New", icon: "S", color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { name: "Reddit", status: "New", icon: "R", color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans overflow-hidden">
      
      {/* 🚀 Sidebar (Dashboard తో సేమ్ ఉండాలి) */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col p-8 sticky top-0 h-screen z-30">
        <div className="flex items-center gap-3 mb-16">
          <img src="/logo.png" alt="PostJet" className="w-12" />
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
           <LogoutLink className="flex items-center gap-4 text-slate-500 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-red-400 transition-all">
              Logout
           </LogoutLink>
        </div>
      </aside>

      {/* 🌌 Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />

        <header className="mb-12 relative z-10">
          <p className="text-blue-400 font-black uppercase text-[10px] tracking-[0.4em] mb-2">Systems</p>
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">App Linkage</h2>
        </header>

        <div className="max-w-5xl space-y-8 relative z-10">
          
          {/* Social Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={app.name} 
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 ${app.bg} ${app.color} rounded-[1.5rem] flex items-center justify-center text-2xl font-black shadow-inner`}>
                    {app.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-black tracking-tight">{app.name}</h4>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${app.status === 'Connected' ? 'text-green-500' : 'text-slate-500'}`}>
                      {app.status}
                    </p>
                  </div>
                </div>
                <button className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${app.status === 'Connected' ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105'}`}>
                  {app.status === 'Connected' ? 'Manage' : 'Connect'}
                </button>
              </motion.div>
            ))}
          </section>

          {/* Security & API Status */}
          <section className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-10 rounded-[3rem]">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-6">
                <Shield className="text-blue-500" size={24} />
                <h3 className="font-black uppercase text-sm tracking-[0.2em]">API Core Status</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-6 bg-black/20 rounded-2xl border border-slate-800">
                    <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">Database Engine</span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-green-500"><CheckCircle2 size={14}/> ONLINE</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-black/20 rounded-2xl border border-slate-800">
                    <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">Media Server</span>
                    <span className="flex items-center gap-2 text-[10px] font-black text-orange-500"><AlertCircle size={14}/> STANDBY</span>
                </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}