"use client";
import { useState } from "react";
import MediaGallery from "@/components/MediaGallery";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handlePost = async () => {
    if (!content && !mediaUrl) return alert("Please add content or select an image!");
    setLoading(true);
    setStatus("🚀 Processing...");

    try {
      const res = await fetch("/api/post/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("✅ Posted Successfully!");
        setContent(""); setMediaUrl("");
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Connection Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-4 mt-10">
      <h1 className="text-xl font-bold text-gray-800">Create PostJet Post</h1>
      
      <textarea
        className="w-full p-4 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your message here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <MediaGallery onSelect={(url) => setMediaUrl(url)} selectedUrl={mediaUrl} />

      {mediaUrl && <p className="text-[10px] text-blue-600 truncate">Selected: {mediaUrl}</p>}

      <button
        onClick={handlePost}
        disabled={loading}
        className={`w-full p-4 rounded-lg font-bold text-white ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
      >
        {loading ? "Sending..." : "Send to WhatsApp"}
      </button>

      {status && <p className="text-center text-sm font-semibold">{status}</p>}
    </div>
  );
}