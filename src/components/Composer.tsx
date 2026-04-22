"use client";
import React, { useState } from "react";
import { Send, Image as ImageIcon, CheckCircle2, Zap, Clock, Paperclip, Video } from "lucide-react";
import { postToAllPlatforms } from "@/app/actions/post-action";

export default function Composer() {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["Telegram"]);

  // మీడియా ప్రివ్యూ హ్యాండ్లర్ (Image & Video)
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaType(file.type.startsWith("video/") ? "video" : "image");
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  // ప్లాట్‌ఫామ్ సెలెక్షన్ టోగుల్
  const togglePlatform = (name: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const platforms = [
    { name: "Telegram", color: "#0088cc", svg: <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701l-.332 4.981c.488 0 .703-.223.976-.488l2.344-2.279l4.874 3.6c.898.496 1.543.241 1.767-.83l3.197-15.059c.328-1.315-.502-1.912-1.362-1.517z" fill="currentColor"/> },
    { name: "Instagram", color: "#E1306C", svg: <path d="M12 2.163c3.204 0 3.584.012 4.85.07c1.366.062 2.633.332 3.608 1.308c.975.975 1.245 2.242 1.308 3.608c.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608c-.975.975-2.242 1.245-3.608 1.308c-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308c-.975-.975-1.245-2.242-1.308-3.608c-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608c.975-.975 2.242-1.245 3.608-1.308c1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072C5.775.132 4.905.333 4.14 0.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053C.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913c.306.788.717 1.459 1.384 2.126s1.384 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558c.788-.306 1.459-.718 2.126-1.384s1.078-1.384 1.384-2.126c.296-.765.499-1.636.558-2.913c.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913c-.306-.789-.718-1.459-1.384-2.126s-1.384-1.078-2.126-1.384c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z" fill="currentColor"/> },
    { name: "YouTube", color: "#FF0000", svg: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/> },
    { name: "Pinterest", color: "#BD081C", svg: <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.36 11.985-11.987C24.021 5.367 18.644 0 12.017 0z" fill="currentColor"/> }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
      <div className="xl:col-span-8">
        <form action={postToAllPlatforms} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
          <div className="flex items-center gap-3 mb-10 border-b pb-8">
            <Zap size={20} className="text-blue-600 fill-blue-600" />
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Broadcast Studio</h3>
          </div>
          
          <textarea 
            name="content" required value={text} onChange={(e) => setText(e.target.value)}
            placeholder="What's happening, Jeevan?"
            className="w-full h-80 p-8 bg-slate-50 rounded-[2.5rem] border-none text-slate-800 font-bold text-xl focus:ring-4 focus:ring-blue-50 mb-10"
          />

          {/* App Selection Grid (With Click Action) */}
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 ml-2">Select Targets</p>
            <div className="flex flex-wrap gap-8">
              {platforms.map((p) => {
                const isActive = selectedPlatforms.includes(p.name);
                return (
                  <div key={p.name} onClick={() => togglePlatform(p.name)} className="flex flex-col items-center gap-3 group cursor-pointer">
                    <div 
                      className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-sm ${isActive ? 'ring-4 ring-blue-600 ring-offset-4 scale-110 shadow-xl' : 'opacity-40 grayscale group-hover:opacity-100'}`}
                      style={{ backgroundColor: `${p.color}15`, color: isActive ? p.color : '#94a3b8' }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">{p.svg}</svg>
                    </div>
                    <span className={`text-[9px] font-black uppercase ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{p.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t">
            <label className="flex items-center gap-3 text-slate-500 font-black text-[11px] uppercase bg-slate-50 px-10 py-5 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-400 transition-all">
              {mediaType === "video" ? <Video size={20} /> : <ImageIcon size={20} />}
              <span>{mediaType ? "Change Media" : "Attach Media"}</span>
              <input type="file" name="media" accept="image/*,video/*" className="hidden" onChange={handleMediaChange} />
            </label>

            <button type="submit" className="bg-blue-600 text-white px-14 py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center gap-4 hover:bg-blue-700 shadow-2xl active:scale-95 transition-all">
              Post Now <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* FIXED PREVIEW CARD (Supports Video & Image) */}
      <div className="xl:col-span-4 sticky top-10 h-max">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-8 ml-6">Live Output Preview</p>
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden max-w-[420px] mx-auto">
            <div className="p-8 flex items-center gap-4 bg-slate-50/50">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic">PJ</div>
                <div><p className="text-sm font-black text-slate-900 uppercase">PostJet Official</p></div>
            </div>
            
            <div className="p-8 min-h-[400px]">
                {mediaPreview ? (
                    mediaType === "video" ? (
                      <video src={mediaPreview} controls className="w-full h-64 object-cover rounded-[2.5rem] mb-6 shadow-2xl" />
                    ) : (
                      <img src={mediaPreview} className="w-full h-64 object-cover rounded-[2.5rem] mb-6 shadow-2xl" alt="Preview" />
                    )
                ) : (
                    <div className="w-full h-64 bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center text-slate-300">
                        <ImageIcon size={64} />
                    </div>
                )}
                <p className="text-slate-800 font-bold leading-relaxed whitespace-pre-wrap text-xl">
                    {text || "Your viral post preview..."}
                </p>
            </div>

            <div className="p-8 bg-blue-600 flex justify-between items-center text-white">
                <p className="text-[10px] font-black uppercase tracking-widest">Global Sync Ready</p>
                <CheckCircle2 size={24} />
            </div>
        </div>
      </div>
    </div>
  );
}