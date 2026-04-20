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

export default function PostJetFullDashboard() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // పబ్లిష్ బటన్ నొక్కినప్పుడు వచ్చే యానిమేషన్
  const handlePublish = () => {
    if (!content) {
      toast.error("Please enter some content first!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success('Campaign launched successfully on all platforms!');
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      
      {/* --- SIDEBAR (Left) --- */}
      <aside className="w-72 bg-[#0F172A] text-white p-6 flex flex-col sticky top-0 h-screen hidden lg:flex">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/40">
            <Send size={24} className="-rotate-12 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">PostJet</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem icon={<Plus size={20}/>} label="New Campaign" />
          <NavItem icon={<Share2 size={20}/>} label="Connected Accounts" />
          <NavItem icon={<BarChart3 size={20}/>} label="Analytics" />
          <div className="pt-6 pb-2">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Management</p>
          </div>
          <NavItem icon={<CreditCard size={20}/>} label="Subscription" />
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </nav>

        {/* Upgrade Card */}
        <div className="mt-auto bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-[1.5rem] border border-slate-700/50 shadow-2xl">
          <div className="flex justify-between text-[10px] font-bold mb-3 uppercase tracking-wider text-slate-400">
            <span>Monthly Limit</span>
            <span className="text-blue-400">12 / 50 Posts</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-4">
            <div className="bg-blue-500 h-full w-[24%] transition-all duration-1000" />
          </div>
          <button className="w-full py-3 bg-white text-slate-900 hover:bg-blue-50 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
          <div className="flex items-center bg-slate-100 px-4 py-2 rounded-xl w-80 border border-slate-200/50">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search campaigns..." className="bg-transparent border-none outline-none text-sm ml-2 w-full font-medium" />
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-all relative">
              <Bell size={22} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">Jeevan Kumar</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">Founder Plan</p>
              </div>
              <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-slate-200">
                JK
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Post</h2>
                <p className="text-slate-500 font-medium mt-1">Schedule and blast your content across all platforms.</p>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Servers: Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              
              {/* LEFT: Editor & Channels */}
              <div className="xl:col-span-7 space-y-8">
                
                {/* 01. Content Editor */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200/60">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-[1rem] flex items-center justify-center font-black text-lg">01</div>
                     <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Content Designer</h3>
                  </div>

                  <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? Start typing your master post here..."
                    className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] min-h-[220px] focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all text-slate-800 text-xl leading-relaxed resize-none shadow-inner"
                  />

                  <div className="mt-8 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
                    <div className="bg-slate-100 p-5 rounded-[1.5rem] group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                      <Plus size={36} />
                    </div>
                    <p className="mt-5 font-black text-slate-500 uppercase tracking-[0.2em] text-[11px]">Upload Visual Media</p>
                  </div>
                </div>

                {/* 02. Branded Channels (12 Apps) */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200/60">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-[1rem] flex items-center justify-center font-black text-lg">02</div>
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Broadcast Channels</h3>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">12 CONNECTED</span>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                      <ChannelIcon icon={<Facebook size={24}/>} label="Facebook" brand="hover:bg-[#1877F2]" />
                      <ChannelIcon icon={<Instagram size={24}/>} label="Instagram" brand="hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]" />
                      <ChannelIcon icon={<AtSign size={24}/>} label="Threads" brand="hover:bg-black" />
                      <ChannelIcon icon={<Twitter size={24}/>} label="Twitter / X" brand="hover:bg-black" />
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
              </div>

              {/* RIGHT: Live Preview */}
              <div className="xl:col-span-5">
                <div className="sticky top-10">
                  <div className="bg-slate-900 rounded-[3.5rem] p-5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] border-slate-800 relative">
                     {/* Phone Notch */}
                     <div className="absolute top-0 inset-x-0 h-10 flex justify-center items-center z-20">
                        <div className="w-32 h-6 bg-slate-800 rounded-b-3xl" />
                     </div>
                     
                     {/* Preview Screen */}
                     <div className="bg-white rounded-[2.5rem] overflow-hidden min-h-[600px] flex flex-col">
                        <div className="h-14 border-b border-slate-50 flex items-center px-6 mt-6">
                           <div className="w-10 h-10 bg-slate-100 rounded-full" />
                           <div className="ml-3">
                              <div className="w-24 h-2.5 bg-slate-200 rounded-full mb-1.5" />
                              <div className="w-16 h-2 bg-slate-100 rounded-full" />
                           </div>
                        </div>
                        
                        <div className="p-8 flex-1">
                          <p className={`text-slate-800 text-lg leading-relaxed whitespace-pre-wrap ${!content && 'text-slate-300 italic'}`}>
                            {content || "Your post content preview will mirror here in real-time..."}
                          </p>
                          <div className="mt-10 w-full aspect-[4/5] bg-slate-50 border-2 border-dashed border-slate-100 rounded-[2rem] flex items-center justify-center">
                             <div className="flex flex-col items-center gap-3">
                                <ImageIcon size={48} className="text-slate-200" />
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Media Preview</span>
                             </div>
                          </div>
                        </div>

                        {/* Publish Button Area */}
                        <div className="p-8 bg-slate-50 border-t border-slate-100">
                           <button 
                             onClick={handlePublish}
                             disabled={loading}
                             className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 ${loading ? 'bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}
                           >
                             {loading ? 'Launching Campaign...' : 'Blast Content'}
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Optimization Card */}
                  <div className="mt-8 bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-400 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <BarChart3 size={28} />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Peak Engagement</p>
                          <p className="text-lg font-black text-slate-800">Today at 7:30 PM</p>
                       </div>
                    </div>
                    <ChevronRight size={24} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function NavItem({ icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 translate-x-2' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
      <span className={`${active ? 'text-white' : 'group-hover:text-blue-400'} transition-colors duration-300`}>{icon}</span>
      <span className="text-sm font-black tracking-tight">{label}</span>
      {active && <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />}
    </div>
  );
}

function ChannelIcon({ icon, label, brand }: any) {
  return (
    <div className="group flex flex-col items-center gap-3 p-5 rounded-[2rem] border border-slate-100 bg-white hover:border-transparent hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer active:scale-90">
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-slate-50 text-slate-400 shadow-inner border border-slate-100 transition-all duration-500 group-hover:text-white group-hover:shadow-2xl group-hover:-translate-y-1 ${brand}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-slate-900 transition-colors">
        {label}
      </span>
      <div className="w-1.5 h-1.5 bg-transparent group-hover:bg-blue-500 rounded-full transition-all duration-500" />
    </div>
  );
}