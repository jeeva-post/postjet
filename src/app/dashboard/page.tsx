"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, Share2, Settings, Plus, Image as ImageIcon,
  Facebook, Instagram, Send as TelegramIcon, BarChart3, CreditCard, 
  Bell, Search, Twitter, AtSign, ChevronRight, Youtube,
  Linkedin, Music2, MessageCircle, Globe, Hash
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PostJetBigLogoSaaS() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // బ్యాక్‌గ్రౌండ్ లేని నీ PNG లోగో పాత్
  const logoPath = "/logo.png"; 

  const handlePublish = () => {
    if (!content) { toast.error("Write some content!"); return; }
    setLoading(true);
    setTimeout(() => {
      toast.success('Campaign Blast Off!');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 font-sans antialiased">
      <Toaster position="top-right" />
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0F172A] text-white p-6 flex flex-col sticky top-0 h-screen hidden lg:flex border-r border-slate-800/50">
        
        {/* --- BRAND LOGO: BIG & CLEAN (No White Box) --- */}
        <div className="mb-14 px-1 group cursor-pointer">
          {/* ఇక్కడ h-28 పెట్టి లోగో సైజును పెంచాను మరియు bg-white తీసేశాను */}
          <div className="flex items-center justify-center overflow-hidden h-28 transition-all duration-500 group-hover:scale-110">
             <img 
               src={logoPath} 
               alt="PostJet Logo" 
               // w-full h-full వాడటం వల్ల లోగో ఆ కంటైనర్ మొత్తం కనిపిస్తుంది
               className="w-full h-full object-contain filter drop-shadow-2xl" 
               onError={(e) => { 
                 e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/2111/2111646.png"; 
               }} 
             />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mt-4 opacity-50" />
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Plus size={20}/>} label="New Campaign" />
          <NavItem icon={<Share2 size={20}/>} label="Social Accounts" />
          <NavItem icon={<BarChart3 size={20}/>} label="Analytics" />
          <div className="pt-8 pb-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4">Workspace</div>
          <NavItem icon={<CreditCard size={20}/>} label="Subscription" />
          <NavItem icon={<Settings size={20}/>} label="App Settings" />
        </nav>

        {/* Usage Card */}
        <div className="mt-auto bg-slate-800/20 p-5 rounded-2xl border border-slate-700/30">
          <div className="flex justify-between text-[10px] font-black mb-3 text-slate-500 uppercase tracking-tighter">
            <span>Posts Used</span>
            <span className="text-blue-400 font-bold">12 / 50</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-[24%]" />
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl w-80 border border-slate-200/50">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search campaign..." className="bg-transparent border-none outline-none text-sm ml-2 w-full font-medium" />
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right leading-tight"><p className="text-sm font-black text-slate-800">Jeevan Kumar</p><p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">Founder access</p></div>
             <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-xl ring-2 ring-blue-500/10">JK</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Campaign Manager</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Ready to scale your social presence?</p>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200/60 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">PostJet Engines Active</span>
              </div>
            </div>

            {/* 01. Content Section */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200/60 transition-all hover:border-blue-200 hover:shadow-xl group">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">01</div>
                 <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs italic">Campaign Content</h3>
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What are we blasting today?" className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] min-h-[200px] outline-none text-xl leading-relaxed resize-none shadow-inner focus:border-blue-400 transition-all" />
            </div>

            {/* 02. Channels Section */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200/60">
               <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm">02</div>
                 Target Platforms
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                  <ChannelIcon icon={<Facebook size={24}/>} label="Facebook" brand="hover:bg-[#1877F2]" />
                  <ChannelIcon icon={<Instagram size={24}/>} label="Instagram" brand="hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" />
                  <ChannelIcon icon={<AtSign size={24}/>} label="Threads" brand="hover:bg-black" />
                  <ChannelIcon icon={<Twitter size={24}/>} label="Twitter" brand="hover:bg-black" />
                  <ChannelIcon icon={<Linkedin size={24}/>} label="LinkedIn" brand="hover:bg-[#0A66C2]" />
                  <ChannelIcon icon={<Youtube size={24}/>} label="YouTube" brand="hover:bg-[#FF0000]" />
                  <ChannelIcon icon={<Share2 size={24}/>} label="Pinterest" brand="hover:bg-[#BD081C]" />
                  <ChannelIcon icon={<Music2 size={24}/>} label="TikTok" brand="hover:bg-black" />
                  <ChannelIcon icon={<TelegramIcon size={24}/>} label="Telegram" brand="hover:bg-[#26A5E4]" />
                  <ChannelIcon icon={<MessageCircle size={24}/>} label="WhatsApp" brand="hover:bg-[#25D366]" />
                  <ChannelIcon icon={<Globe size={24}/>} label="Reddit" brand="hover:bg-[#FF4500]" />
                  <ChannelIcon icon={<Hash size={24}/>} label="Discord" brand="hover:bg-[#5865F2]" />
               </div>
            </div>

            <div className="flex justify-center pt-6 pb-12">
              <button onClick={handlePublish} disabled={loading} className={`px-20 py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 ${loading ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/40'}`}>
                {loading ? 'Processing...' : 'Launch Campaign'}
              </button>
            </div>
        </div>
      </main>
    </div>
  );
}

// --- UI HELPERS ---
function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
      <span className={active ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}>{icon}</span> 
      <span className="text-sm font-black tracking-tight">{label}</span>
    </div>
  );
}

function ChannelIcon({ icon, label, brand }: any) {
  return (
    <div className="group flex flex-col items-center gap-4 p-6 rounded-[2rem] border border-slate-100 bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer active:scale-90 text-center">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 border border-slate-50 transition-all duration-500 group-hover:text-white group-hover:shadow-lg group-hover:-translate-y-1 ${brand}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
  );
}