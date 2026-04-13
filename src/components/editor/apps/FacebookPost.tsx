"use client";
import React, { useState, useRef } from 'react';
import { postToFacebook } from '@/actions/facebook-actions';

export default function FacebookPost() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    if (!text.trim() && !media) return alert("మేటర్ లేదా మీడియా ఉండాలి!");
    setLoading(true);
    const data = new FormData();
    data.append("text", text);
    if (media) data.append("media", media);

    const res = await postToFacebook(data);
    if (res.success) { alert("Facebook Success! 🚀"); setText(""); setMedia(null); setPreview(null); }
    else { alert("Error: " + res.error); }
    setLoading(false);
  };

  return (
    <div className="p-5 border rounded-2xl bg-white shadow-sm border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-[#1877F2] p-2 rounded-lg text-white font-bold text-xs w-8 h-8 flex items-center justify-center">f</div>
        <h3 className="font-bold text-slate-800">Facebook Post</h3>
      </div>
      <textarea className="w-full p-3 border rounded-xl text-sm h-28 outline-none focus:ring-1 focus:ring-blue-400" value={text} onChange={(e) => setText(e.target.value)} placeholder="What's on your mind?" />
      {preview && <div className="mt-3 relative h-32 rounded-xl overflow-hidden border"><img src={preview} className="w-full h-full object-cover" alt="Preview" /></div>}
      <div className="mt-3 flex gap-2">
        <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-2 border border-dashed rounded-xl text-xs font-bold text-blue-600">📷 Add Media</button>
        <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) { setMedia(file); setPreview(URL.createObjectURL(file)); }
        }} />
        <button onClick={handlePost} disabled={loading} className="flex-[2] bg-[#1877F2] text-white p-2.5 rounded-xl font-bold">{loading ? "Posting..." : "Share to Facebook"}</button>
      </div>
    </div>
  );
}