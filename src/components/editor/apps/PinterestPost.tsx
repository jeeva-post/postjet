"use client";
import React, { useState } from 'react';
import { postToPinterest } from '@/actions/pinterest-actions';

export default function PinterestPost() {
  const [note, setNote] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!imgUrl) return alert("Image URL ఇవ్వండి జీవన్!");
    setLoading(true);
    const res = await postToPinterest(imgUrl, note);
    if (res.success) {
      alert("Pinterest Pin Success! 📌");
      setNote(""); setImgUrl("");
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-red-50 border-red-200 shadow-sm">
      <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">📌 Pinterest Pin</h3>
      <input 
        className="w-full p-2 mb-2 border rounded text-sm"
        placeholder="Image URL (https://...)" 
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />
      <textarea 
        className="w-full p-2 border rounded text-sm h-20" 
        placeholder="Description..."
        value={note} 
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={handlePost} disabled={loading} className="w-full mt-2 bg-red-600 text-white p-2 rounded-lg font-bold">
        {loading ? "Processing..." : "Save to Pinterest"}
      </button>
    </div>
  );
}