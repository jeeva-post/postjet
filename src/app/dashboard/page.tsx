"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, Share2, Settings, Plus, Image as ImageIcon,
  Facebook, Instagram, Send as TelegramIcon, BarChart3, CreditCard, 
  Bell, Search, Twitter, AtSign, ChevronRight, Youtube,
  Linkedin, Music2, MessageCircle, Globe, Hash
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PostJetUltimateDashboard() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // ఇక్కడ నీ లోగో పాత్ ని కన్ఫర్మ్ చేశాను (ఎందుకంటే డైరెక్ట్ లింక్ లో ఇది పని చేసింది)
  const logoPath = "/logo.jpeg"; 

  const handlePublish = () => {
    if (!content) { toast.error("Please enter some content!"); return; }
    setLoading(true);
    setTimeout(() => {
      toast.success('Campaign Launched successfully!');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans">
      <Toaster position="top-right" />
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F172A] text-white p-6 flex flex-col sticky top-0 h-screen hidden lg:flex">
        
        {/* నీ లోగో ఇక్కడ సెట్ చేశాను - ఇప్పుడే మ్యాజిక్ చూడు! */}
        <div className="mb-10 px-2 group cursor-pointer">
          <div className="bg-white rounded-2xl p-2 shadow-2xl flex items-center justify-center overflow-hidden h-24 border-2 border-transparent transition-all group-hover:border-blue-500">
             <img 
               src={logoPath} 
               alt="PostJet Logo" 
               className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
               // ఒకవేళ లోగో లోడ్ అవ్వకపోతే డీబగ్ చేయడానికి ఇది ఉపయోగపడుతుంది
               onError={(e) => {
                 console.log("Logo failed to load from dashboard UI");
                 e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/2111/2111646.png"; 
               }}
             />
          </div>
          <p className="mt-3 text-[10px] font-black text-center text-slate-500 uppercase tracking-[0.3em] group-hover:text-blue-400">PostJet Pro</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <NavItem icon={<Plus size={18}/>} label="New Campaign" />
          <NavItem icon={<Share2 size={18}/>} label="Accounts" />
          <NavItem icon={<BarChart3 size={18}/>} label="Analytics" />
          <div className="pt-6 pb-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest px-4">Admin</div>
          <NavItem icon={<CreditCard size={18}/>} label="Billing" />
          <NavItem icon={<Settings size={18}/>} label="Settings" />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg w-72 border border-slate-200/50">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full font-medium" />
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right leading-tight"><p className="text-xs font-black">Jeevan Kumar</p><p className="text-[9px] text-blue-600 font-bold uppercase">Founder Access</p></div>
             <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg">JK</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Manager</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Ready to blast your content worldwide?</p>
              </div>
              <div className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold border border-green-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> CLOUD ENGINES ACTIVE
              </div>
            </div>

            {/* 01. Content Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs">01</div>
                 <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Content Editor</h3>
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type your message here..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl min-h-[160px] outline-none text-lg resize-none shadow-inner" />
            </div>

            {/* 02. Channels Section */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200/60">
               <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-6">Target Channels</h3>
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

            <div className="flex justify-center pt-4 pb-10">
              <button onClick={handlePublish} disabled={loading} className={`px-16 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${loading ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}>
                {loading ? 'Processing...' : 'Blast Content'}
              </button>
            </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPERS ---
function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      {icon} <span className="text-xs font-bold tracking-tight">{label}</span>
    </div>
  );
}

function ChannelIcon({ icon, label, brand }: any) {
  return (
    <div className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-50 bg-white hover:shadow-xl transition-all duration-500 cursor-pointer active:scale-90 text-center">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-50 transition-all duration-500 group-hover:text-white group-hover:shadow-lg ${brand}`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500 group-hover:text-slate-900">{label}</span>
    </div>
  );
}