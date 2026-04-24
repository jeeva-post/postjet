"use client";
import React, { useState } from "react";
import { Send, Image as ImageIcon, Check, Zap } from "lucide-react";
import { postToAllPlatforms } from "@/app/actions/post-action";

const APPS = [
  { id: "Facebook", icon: "f", color: "bg-[#1877F2]" },
  { id: "Instagram", icon: "i", color: "bg-[#E1306C]" },
  { id: "LinkedIn", icon: "l", color: "bg-[#0077B5]" },
  { id: "X", icon: "x", color: "bg-black" },
  { id: "Telegram", icon: "t", color: "bg-[#0088cc]" },
  { id: "WhatsApp", icon: "w", color: "bg-[#25D366]" },
  { id: "YouTube", icon: "y", color: "bg-[#FF0000]" },
  { id: "Reddit", icon: "r", color: "bg-[#FF4500]" },
  { id: "TikTok", icon: "tk", color: "bg-black" },
  { id: "Pinterest", icon: "p", color: "bg-[#BD081C]" },
  { id: "Snapchat", icon: "s", color: "bg-[#FFFC00]" },
];

export default function Composer({ connectedAccounts }: { connectedAccounts: any[] }) {
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handlePost = async () => {
    if (selected.length === 0) return alert("Select a target first!");
    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("selectedPlatforms", JSON.stringify(selected));
    await postToAllPlatforms(formData);
    setLoading(false);
    alert("Dispatched! 🚀");
    setContent("");
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/5 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="text-blue-500" size={20} />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Universal Dispatcher</h3>
      </div>
      
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 bg-white/5 rounded-[2rem] p-8 text-lg font-bold text-white outline-none border-none mb-8 focus:ring-2 focus:ring-blue-500/50"
        placeholder="Broadcast your message to the world..."
      />

      <div className="mb-10">
        <p className="text-[9px] font-black uppercase text-slate-600 mb-4 tracking-widest">Select Target Systems</p>
        <div className="flex flex-wrap gap-3">
          {APPS.map(app => (
            <button key={app.id} onClick={() => toggle(app.id)} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all relative ${selected.includes(app.id) ? 'scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'opacity-20 grayscale'}`}>
               <div className={`${app.color} w-full h-full rounded-2xl flex items-center justify-center text-white font-black text-xs`}>{app.icon}</div>
               {selected.includes(app.id) && <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5"><Check size={10} strokeWidth={4}/></div>}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handlePost} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 transition-all">
        {loading ? "Transmitting..." : "Execute Post Now"}
      </button>
    </div>
  );
}