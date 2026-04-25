"use client";
import React, { useState } from "react";
import { Send, Image as ImageIcon, Smile, Sparkles, Loader2, Globe, Monitor, Smartphone } from "lucide-react";
import { generateAICaption } from "../../actions/ai-actions";

export default function ComposerPage() {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["facebook"]);

  // AI ద్వారా క్యాప్షన్ జనరేట్ చేయడం
  const handleAIGenerate = async () => {
    if (!content) return alert("Please enter a topic first!");
    setIsGenerating(true);
    const result = await generateAICaption(content);
    if (result.success) {
      setContent(result.text);
    }
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8 md:p-12">
      <header className="mb-10 flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter italic uppercase">Composer</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2 italic">Broadcast your vision</p>
        </div>
        <div className="flex gap-2">
            {['facebook', 'instagram', 'whatsapp'].map(p => (
                <button 
                    key={p}
                    onClick={() => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all border ${selectedPlatforms.includes(p) ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                >
                    {p}
                </button>
            ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your idea, or ask AI to write it for you..."
              className="w-full h-72 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-700 resize-none placeholder:text-slate-300 placeholder:italic"
            />
            
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
              <div className="flex gap-4">
                <button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {isGenerating ? "Thinking..." : "AI Generate"}
                </button>
                <button className="text-slate-400 hover:text-blue-600"><ImageIcon size={20} /></button>
                <button className="text-slate-400 hover:text-blue-600"><Smile size={20} /></button>
              </div>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase flex items-center gap-2 hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-500/20">
                <Send size={16} /> Broadcast
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview Engine</span>
             <Monitor size={14} className="text-blue-600" />
          </div>

          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden max-w-md">
            <div className="p-5 border-b border-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-white italic">P</div>
              <div>
                <p className="text-sm font-black text-black">Commander Jeevan</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">Live • <Globe size={10} /></p>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed min-h-[120px]">
                {content || <span className="text-slate-200 italic">Your transmission will appear here...</span>}
              </p>
            </div>
            <div className="bg-slate-50/40 p-5 border-t border-slate-50 flex justify-between px-10">
               {['Like', 'Comment', 'Share'].map(action => (
                   <span key={action} className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{action}</span>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}