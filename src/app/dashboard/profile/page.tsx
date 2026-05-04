"use client";

import React, { useState, useRef } from 'react';
import { 
  Mail, Shield, Globe, 
  Instagram, Facebook, Linkedin, Twitter, Youtube, 
  CheckCircle2, AlertCircle, Plus, Trash2, Camera, X,
  Share2, MessageCircle, MessageSquare, Send
} from 'lucide-react';

// 15+ Platforms Full List
const allPlatforms = [
  { id: 'ig', name: 'Instagram', icon: <Instagram size={20} className="text-pink-500" />, color: 'hover:bg-pink-500/10' },
  { id: 'fb', name: 'Facebook', icon: <Facebook size={20} className="text-blue-600" />, color: 'hover:bg-blue-600/10' },
  { id: 'li', name: 'LinkedIn', icon: <Linkedin size={20} className="text-blue-700" />, color: 'hover:bg-blue-700/10' },
  { id: 'tw', name: 'Twitter (X)', icon: <Twitter size={20} className="text-white" />, color: 'hover:bg-white/10' },
  { id: 'yt', name: 'YouTube', icon: <Youtube size={20} className="text-red-600" />, color: 'hover:bg-red-600/10' },
  { id: 'th', name: 'Threads', icon: <MessageSquare size={20} className="text-slate-200" />, color: 'hover:bg-white/5' },
  { id: 'tk', name: 'TikTok', icon: <Share2 size={20} className="text-cyan-400" />, color: 'hover:bg-cyan-400/10' },
  { id: 'pn', name: 'Pinterest', icon: <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">P</div>, color: 'hover:bg-red-600/10' },
  { id: 'rd', name: 'Reddit', icon: <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">R</div>, color: 'hover:bg-orange-600/10' },
  { id: 'dc', name: 'Discord', icon: <div className="w-5 h-5 bg-indigo-500 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">D</div>, color: 'hover:bg-indigo-500/10' },
  { id: 'sc', name: 'Snapchat', icon: <div className="w-5 h-5 bg-yellow-400 rounded-sm flex items-center justify-center text-[10px] text-black font-bold">S</div>, color: 'hover:bg-yellow-400/10' },
  { id: 'wa', name: 'WhatsApp', icon: <MessageCircle size={20} className="text-green-500" />, color: 'hover:bg-green-500/10' },
  { id: 'tg', name: 'Telegram', icon: <Send size={20} className="text-sky-500" />, color: 'hover:bg-sky-500/10' },
  { id: 'md', name: 'Medium', icon: <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center text-[10px] text-black font-bold">M</div>, color: 'hover:bg-white/10' },
  { id: 'gb', name: 'Google Biz', icon: <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">G</div>, color: 'hover:bg-blue-500/10' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState("Admin User");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto w-full relative min-h-screen">
      
      {/* PROFILE HEADER */}
      <div className="flex flex-col md:flex-row gap-6 items-center border-b border-white/5 pb-8">
        <div className="relative group">
          <div className="w-28 h-28 rounded-3xl bg-slate-800 border-2 border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-cyan-500">AD</span>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-cyan-500 p-2.5 rounded-xl text-black hover:bg-cyan-400 shadow-lg transition-all"
          >
            <Camera size={18} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} hidden accept="image/*" />
        </div>
        <div className="text-center md:text-left flex-1">
          <input 
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="bg-transparent text-3xl font-bold text-white border-none outline-none focus:ring-1 focus:ring-cyan-500/30 rounded-lg px-2 -ml-2 w-full md:w-auto"
          />
          <p className="text-slate-500 mt-1 flex items-center gap-2 justify-center md:justify-start">
             <Mail size={14} /> admin@postjet.io • <span className="text-cyan-500 font-bold uppercase tracking-widest text-[10px]">Premium Control Center</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* TAB NAVIGATION */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('accounts')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'accounts' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <Globe size={18} /> Connected Accounts
          </button>
          <button 
            onClick={() => setActiveTab('security')} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'security' ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <Shield size={18} /> Security & Billing
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="lg:col-span-3">
          {activeTab === 'accounts' && (
            <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 shadow-xl">
               <h3 className="text-lg font-bold text-white mb-6 italic">Social Hub Connections</h3>
               
               <div className="space-y-4 mb-6">
                  {/* Default Connected Account */}
                  <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-cyan-500/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-pink-500"><Instagram size={20}/></div>
                        <div>
                           <p className="text-sm font-bold text-white">@postjet_official</p>
                           <p className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest">Active Connection</p>
                        </div>
                     </div>
                     <button className="text-slate-600 hover:text-red-500 p-2 transition-colors"><Trash2 size={16}/></button>
                  </div>
               </div>

               {/* ADD NEW BUTTON */}
               <button 
                  onClick={() => setShowConnectModal(true)}
                  className="w-full py-8 border-2 border-dashed border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-cyan-400 transition-all group"
               >
                  <div className="p-3 rounded-full bg-white/5 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                    <Plus size={24} />
                  </div>
                  <span className="font-bold text-sm">Expand Your Reach (15+ Apps)</span>
               </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-12 text-center shadow-xl">
               <Shield size={40} className="mx-auto text-slate-700 mb-4" />
               <h3 className="text-xl font-bold text-white">Security Settings</h3>
               <p className="text-slate-500 text-sm mt-2">Manage your password and 2FA settings here.</p>
            </div>
          )}
        </div>
      </div>

      {/* 15+ PLATFORMS MODAL */}
      {showConnectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowConnectModal(false)}></div>
          
          <div className="relative bg-[#0b1120] border border-white/10 w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[85vh]">
            <button onClick={() => setShowConnectModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-1 italic">Connect Platform</h3>
              <p className="text-slate-500 text-xs tracking-wide uppercase font-bold">15+ Integrated Command Platforms</p>
            </div>
            
            {/* Scrollable Container */}
            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar overflow-x-hidden">
              {allPlatforms.map((p) => (
                <button 
                  key={p.id}
                  onClick={() => {
                    alert(`Initiating OAuth connection with ${p.name}...`);
                    setShowConnectModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border border-white/5 transition-all ${p.color} hover:border-cyan-500/30 group bg-white/[0.02]`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/40 group-hover:scale-110 transition-transform">
                      {p.icon}
                    </div>
                    <span className="font-bold text-slate-200 text-sm">{p.name}</span>
                  </div>
                  <Plus size={16} className="text-slate-600 group-hover:text-cyan-400 group-hover:rotate-90 transition-all" />
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-[10px] text-slate-600 italic flex items-center justify-center gap-2">
                <AlertCircle size={10} /> Authorized API connection via PostJet Secure Bridge
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INLINE CSS FOR SCROLLBAR */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #06b6d4; }
      `}</style>
    </div>
  );
}