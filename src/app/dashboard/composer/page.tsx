"use client";
import React, { useState } from "react";
import { Send, Image as ImageIcon, Smile, Monitor, Smartphone, Globe } from "lucide-react";

export default function ComposerPage() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook"]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8 md:p-12 font-sans">
      <header className="mb-10 border-b border-slate-200 pb-6 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tighter italic uppercase">Composer</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Create & Broadcast</p>
        </div>
        <div className="flex gap-2">
            {['facebook', 'instagram', 'whatsapp'].map(p => (
                <button 
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all border ${
                        selectedPlatforms.includes(p) 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                >
                    {p}
                </button>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT: INPUT AREA */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm focus-within:border-blue-200 transition-all">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's the mission today, Commander?"
              className="w-full h-64 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-700 resize-none placeholder:text-slate-300 placeholder:italic"
            />
            
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
              <div className="flex gap-4 text-slate-400">
                <button className="hover:text-blue-600 transition-colors"><ImageIcon size={20} /></button>
                <button className="hover:text-blue-600 transition-colors"><Smile size={20} /></button>
                <button className="hover:text-blue-600 transition-colors font-black text-xs uppercase tracking-tighter">AI Caption</button>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase flex items-center gap-2 hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-blue-100">
                <Send size={16} /> Broadcast
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: REAL-TIME PREVIEW */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</span>
             <div className="flex gap-2">
                <Monitor size={14} className="text-blue-600" />
                <Smartphone size={14} className="text-slate-300" />
             </div>
          </div>

          {/* Facebook Preview Mockup */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden max-w-md mx-auto lg:mx-0">
            <div className="p-4 border-b border-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-blue-600">P</div>
              <div>
                <p className="text-sm font-bold text-black">PostJet User</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase tracking-tighter">Just now • <Globe size={10} /></p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-slate-700 whitespace-pre-wrap min-h-[100px]">
                {content || <span className="text-slate-300 italic">Your broadcast content will appear here...</span>}
              </p>
            </div>
            <div className="bg-slate-50/50 p-4 border-t border-slate-50 flex justify-between px-10 text-slate-400">
               <span className="text-[10px] font-black uppercase tracking-widest">Like</span>
               <span className="text-[10px] font-black uppercase tracking-widest">Comment</span>
               <span className="text-[10px] font-black uppercase tracking-widest">Share</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}