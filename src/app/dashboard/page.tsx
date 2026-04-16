"use client";
import { useState } from "react";

export default function DashboardPage() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatus("Uploading to Cloud...");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postjet_preset"); 
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/upload`, {
        method: "POST", body: formData,
      });
      const data = await res.json();
      setMediaUrl(data.secure_url);
      setStatus("Media ready to post.");
    } catch (err) {
      setStatus("Upload failed.");
    } finally { setUploading(false); }
  };

  const handlePost = async (platform: string) => {
    if (!content && !mediaUrl) return alert("Please enter text or select media!");
    setLoading(true);
    setStatus(`Posting to ${platform}...`);
    try {
      const res = await fetch(`/api/post/${platform}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, mediaUrl }),
      });
      const data = await res.json();
      if (data.success) setStatus(`Success: Posted to ${platform}`);
      else setStatus(`Error: ${data.error}`);
    } catch (err) { setStatus("Connection failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 font-sans">
      <div className="max-w-xl mx-auto border-2 border-black p-8 rounded-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-2">
          PostJet <span className="bg-black text-white px-2">Dashboard</span>
        </h1>
        
        {/* Input Area */}
        <textarea
          className="w-full p-4 border-2 border-black rounded-none h-40 outline-none focus:bg-gray-50 transition-all text-lg mb-4"
          placeholder="Type your message here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* System Media Button */}
        <div className="mb-8">
          <label className="block w-full text-center bg-white border-2 border-black p-4 font-bold cursor-pointer hover:bg-black hover:text-white transition-all uppercase tracking-widest">
            {uploading ? "Uploading..." : "📁 Open Media Library"}
            <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
          </label>
          
          {mediaUrl && (
            <div className="mt-4 border-2 border-black p-2 relative">
              {mediaUrl.includes("video") ? (
                <video src={mediaUrl} className="w-full h-48 object-cover grayscale" controls />
              ) : (
                <img src={mediaUrl} className="w-full h-48 object-cover grayscale" alt="preview" />
              )}
              <button onClick={() => setMediaUrl("")} className="absolute -top-3 -right-3 bg-black text-white w-8 h-8 font-bold border-2 border-white">✕</button>
            </div>
          )}
        </div>

        {/* Buttons Grid - Black & White Style */}
        <div className="grid grid-cols-2 gap-4">
          {[
            "whatsapp", "facebook", "instagram", "linkedin", "youtube", 
            "telegram", "pinterest", "reddit", "discord", "whatsapp-business"
          ].map((app) => (
            <button
              key={app}
              onClick={() => handlePost(app)}
              className="bg-black text-white p-3 font-bold uppercase text-xs hover:bg-white hover:text-black border-2 border-black transition-all active:translate-y-1"
            >
              Post to {app.replace("-", " ")}
            </button>
          ))}
        </div>

        {status && (
          <div className="mt-8 p-4 border-2 border-black bg-gray-100 text-center font-black uppercase text-xs animate-pulse">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}