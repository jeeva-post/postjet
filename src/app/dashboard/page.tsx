"use client";

import React, { useState, useRef } from 'react';
import { 
  PlusCircle, ExternalLink, Image as ImageIcon, 
  X, Eye, Smartphone, Monitor, Smile, Send, Calendar, Clock, ChevronDown
} from 'lucide-react';
// Step 1: Search context ni import cheyalai
import { useSearch } from '@/context/SearchContext';

const platforms = [
  { name: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' },
  { name: 'Facebook', color: 'bg-blue-600' },
  { name: 'LinkedIn', color: 'bg-blue-700' },
  { name: 'Twitter (X)', color: 'bg-black' },
  { name: 'Threads', color: 'bg-neutral-800' },
  { name: 'YouTube', color: 'bg-red-600' },
  { name: 'TikTok', color: 'bg-black' },
  { name: 'Pinterest', color: 'bg-red-700' },
  { name: 'Reddit', color: 'bg-orange-600' },
  { name: 'Discord', color: 'bg-indigo-600' },
  { name: 'Snapchat', color: 'bg-yellow-400' },
  { name: 'WhatsApp', color: 'bg-green-500' },
  { name: 'Telegram', color: 'bg-sky-500' },
  { name: 'Medium', color: 'bg-black' },
  { name: 'Google Biz', color: 'bg-blue-500' },
];

export default function DashboardPage() {
  // Step 2: Search Query ni context nundi techukovali
  const { searchQuery } = useSearch();
  
  const [postText, setPostText] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMedia(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    }
  };

  // Step 3: Filter Logic - Search bar lo type chese text ki match ayye platforms ni matrame filter chesthundhi
  const filteredPlatforms = platforms.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back!</h2>
        <p className="text-slate-500 mt-1">Manage your global social presence from one single command center.</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* WRITING BOARD WITH INLINE SCHEDULER */}
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-bold text-white flex items-center gap-2 italic">
              <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span> Compose Content
            </h3>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-2 bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all"
            >
              <ImageIcon size={20} />
            </button>
            <input type="file" hidden ref={fileInputRef} accept="image/*,video/*" onChange={handleFileUpload} />
          </div>

          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's happening? Write your post here..."
            className="w-full h-40 bg-black/40 border border-white/5 rounded-2xl p-5 outline-none focus:ring-1 focus:ring-cyan-500/50 text-slate-200 resize-none text-lg leading-relaxed"
          />

          {/* SCHEDULING SECTION */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar size={16} className="text-cyan-500" /> 
                <span>Schedule this post?</span>
              </div>
              <button 
                onClick={() => setIsScheduling(!isScheduling)}
                className={`w-12 h-6 rounded-full transition-all relative ${isScheduling ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isScheduling ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>

            {isScheduling && (
              <div className="grid grid-cols-2 gap-3 pt-2 animate-in fade-in zoom-in duration-300">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Date</label>
                  <input type="date" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Time</label>
                  <input type="time" className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-cyan-500" />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
             <button className="p-2 text-slate-500 hover:text-cyan-400 transition-colors"><Smile size={22}/></button>
             <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold px-10 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95">
               {isScheduling ? <Clock size={18} /> : <Send size={18} />}
               {isScheduling ? "Schedule Blast" : "Publish to 15+ Apps"}
             </button>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Eye size={12} className="text-cyan-500"/> Real-time Preview</span>
            <div className="flex gap-3 items-center">
              <Smartphone size={14} className="cursor-pointer" />
              <Monitor size={14} className="text-cyan-500" />
            </div>
          </div>
          
          <div className="bg-[#030816] border border-white/5 rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
            <div className="w-full max-w-[340px] bg-[#0f172a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="p-4 flex items-center gap-3 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-black text-sm">P</div>
                <div>
                  <p className="text-[12px] font-bold text-white leading-tight">PostJet Official</p>
                  <p className="text-[10px] text-slate-500 italic">Ready to Blast</p>
                </div>
              </div>
              
              <div className="px-4 py-6 min-h-[80px] text-[14px] text-slate-300 whitespace-pre-wrap">
                {postText || "Your content will appear here..."}
              </div>

              {selectedMedia ? (
                <div className="w-full aspect-square bg-black">
                  <img src={selectedMedia} className="w-full h-full object-cover" alt="preview" />
                </div>
              ) : (
                <div className="w-full aspect-video bg-white/5 flex flex-col items-center justify-center gap-3">
                  <ImageIcon size={40} className="text-white/5"/>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORMS GRID - Updated with Search Filtering */}
      <section className="pt-4 pb-12">
        <h3 className="text-lg font-semibold text-slate-300 mb-6 flex items-center gap-2">
          <PlusCircle size={20} className="text-cyan-500" /> 
          Connected Platforms ({filteredPlatforms.length})
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filteredPlatforms.length > 0 ? (
            filteredPlatforms.map((app, index) => (
              <div key={index} className="group animate-in fade-in zoom-in duration-300 relative bg-[#0f172a] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 cursor-pointer shadow-lg">
                <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {app.name.charAt(0)}
                </div>
                <p className="font-medium text-slate-200 text-sm">{app.name}</p>
                <ExternalLink size={12} className="absolute top-3 right-3 text-slate-600" />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center border border-dashed border-white/10 rounded-2xl text-slate-500">
              No platforms found matching "{searchQuery}"
            </div>
          )}
        </div>
      </section>
    </div>
  );
}