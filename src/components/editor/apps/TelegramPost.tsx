"use client";
import React, { useState, useRef } from 'react';
import { postToTelegram } from '@/actions/telegram-actions'; // 👈 ఇక్కడ పేరు మార్చు

export default function TelegramPost() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!text.trim() && !media) return alert("మేటర్ రాయాలి కదా జీవన్!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("text", text);
    if (media) formData.append("media", media);

    try {
      const res = await postToTelegram(formData); // 👈 ఇక్కడ కూడా మార్చు
      if (res.success) {
        alert("Telegram Success! 🚀");
        setText("");
        setMedia(null);
        setPreview(null);
      } else {
        alert("Error: " + res.error);
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border rounded-2xl bg-white border-sky-100 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#0088cc] p-1.5 rounded text-white">✈️</div>
        <h3 className="font-bold text-slate-800">Telegram Post</h3>
      </div>
      
      <textarea 
        className="w-full p-3 border rounded-xl text-sm h-28 focus:ring-2 focus:ring-sky-400 outline-none border-slate-200" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Send a message or media..."
      />

      {preview && (
        <div className="mt-3 relative rounded-lg overflow-hidden border">
           <img src={preview} className="w-full h-32 object-cover" alt="Preview" />
           <button onClick={() => {setMedia(null); setPreview(null);}} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 p-2 border border-dashed border-sky-300 rounded-lg text-sky-600 text-xs font-bold hover:bg-sky-50"
        >
          {media ? "Change Media" : "📷 Add Media"}
        </button>
        <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleFileChange} />
      </div>
      
      <button 
        onClick={handlePost} 
        disabled={loading} 
        className={`w-full mt-4 p-3 rounded-xl font-bold text-white transition-all ${
          loading ? "bg-slate-300" : "bg-[#0088cc] hover:bg-[#0077b5]"
        }`}
      >
        {loading ? "Sending..." : "Send to Telegram"}
      </button>
    </div>
  );
}