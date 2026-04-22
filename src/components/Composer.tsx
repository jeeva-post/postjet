"use client";
import React, { useState } from "react";
import { Send, Image as ImageIcon, CheckCircle2, Zap, Clock } from "lucide-react";
import { postToTelegram } from "@/app/actions/post-action";

export default function Composer() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  // Original Logos with Correct React SVG Props
  const platforms = [
    { name: "Telegram", color: "#0088cc", svg: <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701l-.332 4.981c.488 0 .703-.223.976-.488l2.344-2.279l4.874 3.6c.898.496 1.543.241 1.767-.83l3.197-15.059c.328-1.315-.502-1.912-1.362-1.517z" fill="currentColor"/> },
    { name: "Instagram", color: "#E1306C", svg: <g fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07c1.366.062 2.633.332 3.608 1.308c.975.975 1.245 2.242 1.308 3.608c.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608c-.975.975-2.242 1.245-3.608 1.308c-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308c-.975-.975-1.245-2.242-1.308-3.608c-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608c.975-.975 2.242-1.245 3.608-1.308c1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072C5.775.132 4.905.333 4.14 0.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053C.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913c.306.788.717 1.459 1.384 2.126s1.384 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558c.788-.306 1.459-.718 2.126-1.384s1.078-1.384 1.384-2.126c.296-.765.499-1.636.558-2.913c.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913c-.306-.789-.718-1.459-1.384-2.126s-1.384-1.078-2.126-1.384c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z"/><path d="M12 5.838a6.162 6.162 0 1 0 0 12.324a6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8a4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881a1.44 1.44 0 0 0 0-2.881z"/></g> },
    { name: "Facebook", color: "#1877F2", svg: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669c1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/> },
    { name: "YouTube", color: "#FF0000", svg: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/> },
    { name: "Snapchat", color: "#FFFC00", svg: <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.5c-3.5 0-6.25-1.75-6.25-4.25 0-1.25.75-2.25 2-2.75l-.25-.75c-1.5-.5-2.5-1.5-2.5-2.75 0-2 2.75-3.5 6-3.5s6 1.5 6 3.5c0 1.25-1 2.25-2.5 2.75l-.25.75c1.25.5 2 1.5 2 2.75 0 2.5-2.75 4.25-6.25 4.25z" fill="currentColor"/> },
    { name: "X", color: "#000000", svg: <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932l6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" fill="currentColor"/> },
    { name: "WhatsApp", color: "#25D366", svg: <path d="M17.472 14.382c-.301-.149-1.782-.878-2.057-.977-.275-.099-.475-.149-.675.149-.2.299-.775.977-.95 1.176-.175.199-.35.224-.651.075-.301-.149-1.272-.469-2.421-1.494-.894-.797-1.498-1.782-1.674-2.081-.176-.299-.019-.461.13-.61.134-.133.301-.351.451-.527.15-.176.2-.301.301-.499.1-.199.05-.374-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.588-.493-.509-.675-.519-.175-.011-.375-.011-.575-.011-.2 0-.525.075-.8 0-.375-.275-1.074-.95-1.074-2.324s1.424-2.7 1.624-2.975c.2-.275 2.802-4.278 6.787-6.002.95-.411 1.691-.656 2.271-.84.954-.303 1.823-.26 2.51-.158.766.113 2.357.962 2.689 1.89.332.929.332 1.724.232 1.89-.1.165-.375.26-.676.41zM12.19 21.222c-2.183 0-4.315-.588-6.171-1.697l-.443-.263-4.588 1.202 1.224-4.475-.289-.459c-1.214-1.928-1.855-4.17-1.855-6.474 0-6.713 5.463-12.176 12.176-12.176 3.253 0 6.31 1.267 8.608 3.566s3.566 5.355 3.566 8.61c0 6.714-5.462 12.176-12.175 12.176z" fill="currentColor"/> }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
      {/* Studio Area */}
      <div className="xl:col-span-8">
        <form action={postToTelegram} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl">
          <div className="flex items-center gap-3 mb-10 border-b pb-8">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Zap size={20} fill="white" /></div>
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-900">Broadcast Studio</h3>
            <span className="ml-auto text-[10px] font-black uppercase text-green-500 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <Clock size={12} /> System Online
            </span>
          </div>
          
          <textarea 
            name="content"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Craft your viral story, Jeevan..."
            className="w-full h-80 p-8 bg-slate-50 rounded-[2.5rem] border-none text-slate-800 font-bold text-xl placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-blue-50 mb-10"
          />

          {/* Social Icons Grid */}
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6 ml-2">Channel Distribution</p>
            <div className="flex flex-wrap gap-8">
              {platforms.map((p, i) => (
                <div key={p.name} className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div 
                    className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-sm group-hover:scale-125 group-hover:-translate-y-3 group-hover:shadow-2xl ${i === 0 ? 'ring-4 ring-blue-500 ring-offset-4' : ''}`}
                    style={{ backgroundColor: `${p.color}15`, color: p.color }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">{p.svg}</svg>
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-slate-900 transition-colors">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t">
            <label className="flex items-center gap-3 text-slate-500 font-black text-[11px] uppercase bg-slate-50 px-10 py-5 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-400 transition-all">
              <ImageIcon size={20} />
              <span>Attach Media</span>
              <input type="file" name="media" accept="image/*,video/*" className="hidden" onChange={handleImageChange} />
            </label>

            <button type="submit" className="bg-blue-600 text-white px-14 py-5 rounded-[1.5rem] font-black uppercase text-xs flex items-center gap-4 hover:bg-blue-700 shadow-2xl shadow-blue-200 active:scale-95 transition-all">
              Post Now <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Preview Card */}
      <div className="xl:col-span-4 sticky top-10 h-max">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-8 ml-6">Real-Time Output Preview</p>
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden max-w-[420px] mx-auto border-t-8 border-t-blue-600">
            <div className="p-8 flex items-center gap-4 bg-slate-50/50">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl italic shadow-lg">PJ</div>
                <div>
                    <p className="text-sm font-black text-slate-900 italic uppercase">PostJet Pro</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Broadcasting</p>
                    </div>
                </div>
            </div>
            
            <div className="p-8 min-h-[400px]">
                {imagePreview ? (
                    <img src={imagePreview} className="w-full h-64 object-cover rounded-[2.5rem] mb-6 shadow-2xl" alt="Preview" />
                ) : (
                    <div className="w-full h-64 bg-slate-100 rounded-[2.5rem] mb-6 flex items-center justify-center text-slate-300">
                        <ImageIcon size={64} />
                    </div>
                )}
                <p className="text-slate-800 font-bold leading-relaxed whitespace-pre-wrap text-xl">
                    {text || "Your viral content preview will appear here..."}
                </p>
            </div>

            <div className="p-8 bg-blue-600 flex justify-between items-center text-white shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-widest">Global Connection Active</p>
                <CheckCircle2 size={24} />
            </div>
        </div>
      </div>
    </div>
  );
}