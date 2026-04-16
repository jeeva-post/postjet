"use client";
import { useState } from "react";
import MediaGallery from "@/components/MediaGallery";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showGallery, setShowGallery] = useState(false); // గ్యాలరీ చూపించడానికి

  const handlePost = async (platform: string) => {
    if (!content && !mediaUrl) return alert("Please add content or select media!");
    setLoading(true);
    setStatus(`🚀 Posting to ${platform}...`);

    try {
      // ప్లాట్‌ఫామ్ బట్టి API మారుతుంది (whatsapp, telegram, instagram, etc.)
      const res = await fetch(`/api/post/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(`✅ Posted to ${platform} Successfully!`);
      } else {
        setStatus(`❌ ${platform} Error: ${data.error}`);
      }
    } catch (err) {
      setStatus(`❌ ${platform} Connection Error`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-2xl mt-10 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">PostJet Multi-Poster</h1>
      
      <textarea
        className="w-full p-4 border-2 border-gray-100 rounded-xl h-40 outline-none focus:border-blue-500 transition-all resize-none shadow-sm"
        placeholder="మీ మెసేజ్ ఇక్కడ టైప్ చేయండి..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex flex-col space-y-3 mt-4">
        {/* గ్యాలరీ బటన్ */}
        <button 
          onClick={() => setShowGallery(!showGallery)}
          className="bg-gray-100 text-gray-700 p-2 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          {showGallery ? "▲ Close Gallery" : "📷 Select Media (Image/Video)"}
        </button>

        {showGallery && (
          <MediaGallery 
            onSelect={(url) => { setMediaUrl(url); setShowGallery(false); }} 
            selectedUrl={mediaUrl} 
          />
        )}

        {mediaUrl && (
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
            <span className="text-green-600 text-xs">✔ Media Selected</span>
            <button onClick={() => setMediaUrl("")} className="text-red-500 text-xs underline">Remove</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        {/* వాట్సాప్ బటన్ */}
        <button
          onClick={() => handlePost("whatsapp")}
          className="bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200"
        >
          WhatsApp
        </button>

        {/* టెలిగ్రామ్ బటన్ */}
        <button
          onClick={() => handlePost("telegram")}
          className="bg-blue-500 text-white p-3 rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-200"
        >
          Telegram
        </button>

        {/* ఇన్‌స్టాగ్రామ్ బటన్ */}
        <button
          onClick={() => handlePost("instagram")}
          className="bg-pink-600 text-white p-3 rounded-xl font-bold hover:bg-pink-700 shadow-lg shadow-pink-200"
        >
          Instagram
        </button>

        {/* యూట్యూబ్ షార్ట్స్ కోసం */}
        <button
          onClick={() => handlePost("youtube")}
          className="bg-red-600 text-white p-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200"
        >
          YouTube
        </button>
      </div>

      {status && (
        <div className={`mt-6 p-3 rounded-lg text-center font-semibold text-sm ${status.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {status}
        </div>
      )}
    </div>
  );
}