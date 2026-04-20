"use client";
import React from 'react';
import { 
  Facebook, Instagram, Twitter, Linkedin, Youtube, 
  Share2, Music2, AtSign, Send as TelegramIcon, 
  MessageCircle, Globe, Hash, Plus, CheckCircle2, 
  ExternalLink, Settings2, AlertCircle
} from 'lucide-react';

export default function ConnectedAccounts() {
  const platforms = [
    { name: 'Facebook', icon: <Facebook size={20}/>, color: '#1877F2', status: 'Connected', username: '@postjet_fb' },
    { name: 'Instagram', icon: <Instagram size={20}/>, color: '#E4405F', status: 'Connected', username: '@postjet_insta' },
    { name: 'Threads', icon: <AtSign size={20}/>, color: '#000000', status: 'Not Connected', username: null },
    { name: 'Twitter / X', icon: <Twitter size={20}/>, color: '#000000', status: 'Connected', username: '@postjet_x' },
    { name: 'LinkedIn', icon: <Linkedin size={20}/>, color: '#0A66C2', status: 'Not Connected', username: null },
    { name: 'YouTube', icon: <Youtube size={20}/>, color: '#FF0000', status: 'Not Connected', username: null },
    { name: 'Pinterest', icon: <Share2 size={20}/>, color: '#BD081C', status: 'Not Connected', username: null },
    { name: 'TikTok', icon: <Music2 size={20}/>, color: '#000000', status: 'Not Connected', username: null },
    { name: 'Telegram', icon: <TelegramIcon size={20}/>, color: '#26A5E4', status: 'Connected', username: 'PostJet_Bot' },
    { name: 'WhatsApp', icon: <MessageCircle size={20}/>, color: '#25D366', status: 'Not Connected', username: null },
    { name: 'Reddit', icon: <Globe size={20}/>, color: '#FF4500', status: 'Not Connected', username: null },
    { name: 'Discord', icon: <Hash size={20}/>, color: '#5865F2', status: 'Not Connected', username: null },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 font-sans antialiased text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">Connected Accounts</h1>
          <p className="text-slate-500 mt-2 font-medium">Link and manage your social media profiles to enable multi-platform posting.</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Platforms" value="12" icon={<Globe className="text-blue-500" />} />
          <StatCard label="Connected" value="4" icon={<CheckCircle2 className="text-green-500" />} />
          <StatCard label="Pending Setup" value="8" icon={<AlertCircle className="text-amber-500" />} />
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {platforms.map((app) => (
            <div key={app.name} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-500"
                  style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === 'Connected' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                  {app.status}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-800">{app.name}</h3>
                <p className="text-sm text-slate-500 font-medium">
                  {app.username ? app.username : 'No account linked'}
                </p>
              </div>

              <div className="flex gap-3">
                {app.status === 'Connected' ? (
                  <>
                    <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                      <Settings2 size={14} /> Settings
                    </button>
                    <button className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl transition-all">
                      <ExternalLink size={16} />
                    </button>
                  </>
                ) : (
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                    <Plus size={16} /> Connect Account
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-5">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}