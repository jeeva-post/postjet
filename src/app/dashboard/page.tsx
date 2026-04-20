"use client";
import React, { useState } from 'react';
import { 
  Send, LayoutDashboard, Share2, Settings, 
  CheckCircle2, Plus, Image as ImageIcon,
  Facebook, Instagram, Send as TelegramIcon,
  BarChart3, CreditCard, Bell, Search, 
  Twitter, AtSign, ChevronRight, Youtube,
  Linkedin, Music2, MessageCircle, Globe, Hash
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PostJetFinalBrandedDashboard() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // LOGO PATH: Nuvvu uploaded image ni 'public' folder lo 'logo.png' ga save cheyali
  const logoPath = "/logo.png"; 

  const handlePublish = () => {
    if (!content) {
      toast.error("Please enter some content first!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Campaign launched on all 12 platforms!');
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F172A] text-white p-6 flex flex-col sticky top-0 h-screen hidden lg:flex">
        
        {/* BRAND LOGO - Ekkada perfect ga set chesa chudu */}
        <div className="mb-10 px-2 group cursor-pointer">
          <div className="bg-white rounded-2xl p-2 shadow-2xl shadow-blue-500/10 border border-slate-700/50 flex items-center justify-center overflow-hidden">
             <img 
               src={logoPath} 
               alt="PostJet Logo" 
               className="w-full h-auto object-contain transition-transform group-hover:scale-105 duration-500"
               onError={(e) => {
                 // Logo file lekapothe placeholder chupisthundi
                 e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/2111/2111646.png"; 
               }}
             />
          </div>
          <p className="mt-3 text-[10px] font-black text-center text-slate-500 uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors">
             Multi-Platform
          </p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <NavItem icon={<Plus size={18}/>} label="New Campaign" />
          <NavItem icon={<Share2 size={18}/>} label="Social Accounts" />
          <NavItem icon={<BarChart3 size={18}/>} label="Analytics" />
          <div className="pt-6 pb-2">
            <p className="px-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">Plan & Billing</p>
          </div>
          <NavItem icon={<CreditCard size={18}/>} label="Subscription" />
          <NavItem icon={<Settings size={18}/>} label="App Settings" />
        </nav>

        <div className="mt-auto bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
          <div className="flex justify-between text-[9px] font-black mb-2 text-slate-500 uppercase tracking-tighter">
            <span>Monthly Usage</span>
            <span className="text-blue-400">12 / 50</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[24%]" />
          </div>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg w-72 border border-slate-200/50">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search campaign..." className="bg-transparent border-none outline-none text-sm ml-2 w-full font-medium" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-black text-slate-800">Jeevan Kumar</p>
                <p className="text-[9px] text-blue-600 font-bold uppercase">Founder Access</p>
              </div>
              <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">JK</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Post</h2>
                <p className="text-xs text-slate-500 font-medium">Blast your content to all social networks in one click.</p>
              </div>
              <div className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> CLOUD ENGINES ACTIVE
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-sm">01</div>
                 <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">What's the message?</h3>
              </div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your viral content here..."
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl min-h-[160px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-800 text-lg resize-none shadow-inner"
              />
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-sm">02</div>
                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Target Channels</h3>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">12 PLATFORMS CONNECTED</span>
               </div>

               {/* lg:grid-cols-6 ensures 2 clean rows for 12 items */}
               <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  <ChannelIcon icon={<Facebook size={20}/>} label="Facebook" brand="hover:bg-[#1877F2]" />
                  <ChannelIcon icon={<Instagram size={20}/>} label="Instagram" brand="hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" />
                  <ChannelIcon icon={<AtSign size={20}/>} label="Threads" brand="hover:bg-black" />
                  <ChannelIcon icon={<Twitter size={20}/>} label="Twitter" brand="hover:bg-black" />
                  <ChannelIcon icon={<Linkedin size={20}/>} label="LinkedIn" brand="hover:bg-[#0A66C2]" />
                  <ChannelIcon icon={<Youtube size={20}/>} label="YouTube" brand="hover:bg-[#FF0000]" />
                  <ChannelIcon icon={<Share2 size={20}/>} label="Pinterest" brand="hover:bg-[#BD081C]" />
                  <ChannelIcon icon={<Music2 size={20}/>} label="TikTok" brand="hover:bg-black" />
                  <ChannelIcon icon={<TelegramIcon size={20}/>} label="Telegram" brand="hover:bg-[#26A5E4]" />
                  <ChannelIcon icon={<MessageCircle size={20}/>} label="WhatsApp" brand="hover:bg-[#25D366]" />
                  <ChannelIcon icon={<Globe size={20}/>} label="Reddit" brand="hover:bg-[#FF4500]" />
                  <ChannelIcon icon={<Hash size={20}/>} label="Discord" brand="hover:bg-[#5865F2]" />
               </div>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                 onClick={handlePublish}
                 disabled={loading}
                 className={`px-16 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${loading ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}
              >
                {loading ? 'Launching Content...' : 'Blast Content'}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPERS ---

function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <span className={active ? 'text-white' : 'group-hover:text-blue-400'}>{icon}</span>
      <span className="text-xs font-bold tracking-tight">{label}</span>
    </div>
  );
}

function ChannelIcon({ icon, label, brand }: any) {
  return (
    <div className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-50 bg-white hover:shadow-xl transition-all duration-500 cursor-pointer active:scale-90">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-50 transition-all duration-500 group-hover:text-white group-hover:shadow-lg ${brand}`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
    </div>
  );
}