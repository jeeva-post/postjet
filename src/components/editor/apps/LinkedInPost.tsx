"use client";
import React, { useState, useRef } from 'react';
import { postToLinkedInWithMedia } from '@/actions/linkedin-actions';

export default function LinkedInPost() {
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
    if (!text.trim() && !media) return alert("కనీసం టెక్స్ట్ లేదా ఇమేజ్ ఉండాలి జీవన్!");
    
    setLoading(true);
    const formData = new FormData();
    formData.append("text", text);
    if (media) formData.append("media", media);

    try {
      const res = await postToLinkedInWithMedia(formData);
      if (res.success) {
        alert("LinkedIn Media Success! 🚀");
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
    <div className="p-6 border rounded-3xl bg-white shadow-xl border-blue-50">
      <div className="flex items-center gap-3 mb-5">
        <div className="bg-[#0077b5] p-2 rounded-xl text-white shadow-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        </div>
        <h3 className="font-bold text-slate-800 text-xl tracking-tight">Post to LinkedIn</h3>
      </div>
      
      <textarea 
        className="w-full p-4 border-2 rounded-2xl text-md h-36 focus:border-blue-500 outline-none border-slate-100 resize-none transition-all" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="వ్యాపార విషయాలు పంచుకోండి..."
      />

      {/* Media Preview */}
      {preview && (
        <div className="mt-4 relative rounded-2xl overflow-hidden border">
           {media?.type.startsWith("video") ? (
             <video src={preview} className="w-full h-48 object-cover" controls />
           ) : (
             <img src={preview} className="w-full h-48 object-cover" alt="Preview" />
           )}
           <button onClick={() => {setMedia(null); setPreview(null);}} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 text-xs">✕</button>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 p-3 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 font-semibold hover:bg-blue-50 transition-all text-sm"
        >
          {media ? "Change Media" : "📷 Add Photo / Video"}
        </button>
        <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleFileChange} />
      </div>
      
      <button 
        onClick={handlePost} 
        disabled={loading} 
        className={`w-full mt-6 p-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
          loading ? "bg-slate-400 animate-pulse" : "bg-[#0077b5] hover:bg-[#005a87] hover:-translate-y-1"
        }`}
      >
        {loading ? "Uploading to Cloud..." : "🚀 Share to Professional Network"}
      </button>
    </div>
  );
}