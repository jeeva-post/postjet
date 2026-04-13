"use client";
import React, { useState, useRef } from 'react';
import { postToInstagram } from '@/actions/instagram-actions';

export default function InstagramPost() {
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
    if (!media) return alert("జీవన్, ఒక ఫోటో లేదా వీడియో ఉండాలి!");
    setLoading(true);
    const data = new FormData();
    data.append("text", text);
    data.append("media", media);

    const res = await postToInstagram(data);
    if (res.success) {
      alert("Instagram Success! 🚀");
      setText(""); setMedia(null); setPreview(null);
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-5 border rounded-2xl bg-white shadow-sm border-pink-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-2 rounded-lg text-white font-bold text-xs w-8 h-8 flex items-center justify-center">IG</div>
        <h3 className="font-bold text-slate-800">Instagram Post</h3>
      </div>
      
      <textarea 
        className="w-full p-3 border rounded-xl text-sm h-28 outline-none focus:ring-1 focus:ring-pink-400 mb-3" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a caption..."
      />

      {/* 👈 ప్రివ్యూ లాజిక్ ఇక్కడ మార్చాను */}
      {preview && (
        <div className="mb-3 relative rounded-xl overflow-hidden border bg-black h-48 flex items-center justify-center">
          {media?.type.startsWith("video") ? (
            <video src={preview} controls className="max-h-full" />
          ) : (
            <img src={preview} className="w-full h-full object-cover" alt="Preview" />
          )}
          <button onClick={() => {setMedia(null); setPreview(null);}} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">✕</button>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => fileInputRef.current?.click()} className="flex-1 p-2 border border-dashed border-pink-300 rounded-xl text-pink-600 text-xs font-bold">📷 Add Media</button>
        <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleFileChange} />
        <button onClick={handlePost} disabled={loading} className="flex-[2] bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2.5 rounded-xl font-bold transition-all active:scale-95">
          {loading ? "Posting..." : "Post to Instagram"}
        </button>
      </div>
    </div>
  );
}