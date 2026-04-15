"use client";

import { useState, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Facebook, Instagram, Send, Youtube, LayoutDashboard, Link2, 
  LogOut, Plus, X, Image as ImageIcon, Zap, Loader2
} from "lucide-react";

export default function Dashboard() {
  const { data: session }: any = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  // --- Media Upload States ---
  const [mediaUrl, setMediaUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
    { id: "facebook", name: "Facebook Page", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
    { id: "instagram", name: "Instagram Business", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
    { id: "youtube", name: "YouTube Channel", icon: Youtube, color: "#FF0000", bgColor: "#fff1f1" },
    { id: "telegram", name: "Telegram Channel", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  ];

  // --- Media Upload Handler (Handles both Images & Videos) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Note: Make sure your /api/upload handles the cloudinary upload correctly
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (data.url || data.secure_url) {
        setMediaUrl(data.secure_url || data.url);
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Error uploading file! Check your Cloudinary settings.");
    } finally {
      setIsUploading(false);
    }
  };

  // --- Multi-Platform Post Handler ---
  const handlePost = async () => {
    // 🔥 Validation: Content లేదా Platforms లేకపోతే ఆపుతుంది
    if (!postContent.trim()) return alert("Please type something in the composer, Jeevan!");
    if (selectedPlatforms.length === 0) return alert("Please select at least one icon (FB, IG, YT, or TG)!");

    setIsPosting(true);
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent,
          platforms: selectedPlatforms,
          accessToken: session?.accessToken,
          mediaUrl: mediaUrl, 
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("🔥 Adbhutham! Nee post pampinchanu Jeevan.");
        setIsModalOpen(false);
        setPostContent("");
        setMediaUrl("");
        setSelectedPlatforms([]); // Reset selection
      } else {
        alert("Post error: " + (data.error || "Check your API connection"));
      }
    } catch (err) {
      alert("Post failed! Something went wrong with the server.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen p-7">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Send size={24} /></div>
          <span className="text-2xl font-black">PostJet</span>
        </div>
        <nav className="flex-1 space-y-2">
          <div className="flex items-center gap-4 p-3 rounded-xl font-bold bg-blue-600 text-white cursor-pointer">
            <LayoutDashboard size={20} /> Overview
          </div>
          <div className="flex items-center gap-4 p-3 rounded-xl font-bold text-slate-500 cursor-pointer hover:bg-slate-50">
            <Link2 size={20} /> Integrations
          </div>
        </nav>
        <button onClick={() => signOut()} className="flex items-center gap-3 p-3 text-slate-500 font-bold hover:text-red-500 transition-colors">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black italic">Channels</h1>
            <p className="text-slate-400 font-medium">Your Social Media Command Center</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-200 hover:scale-105 transition-transform"
          >
            <Plus size={20} /> Create Post
          </button>
        </header>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((p) => {
            const isConnected = (p.id === "facebook" && !!session) || 
                               (p.id === "youtube" && !!session) ||
                               (p.id === "telegram"); // Custom logic based on your setup
            return (
              <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl" style={{ backgroundColor: p.bgColor, color: p.color }}>
                    <p.icon size={32} />
                  </div>
                  <span className={`px-4 py-1.5 text-[10px] tracking-widest font-black rounded-full border uppercase flex items-center gap-1 ${
                    isConnected ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"
                  }`}>
                    {isConnected && <Zap size={10} className="fill-green-600" />}
                    {isConnected ? "Active" : "Offline"}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                <p className="text-slate-400 text-sm mb-6">Connect and automate your {p.name} presence.</p>
                <button 
                  onClick={() => signIn(p.id === "youtube" ? "google" : "facebook")}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                    isConnected ? "bg-slate-100 text-slate-600" : "bg-slate-950 text-white hover:bg-blue-600"
                  }`}
                >
                  {isConnected ? "Connected" : "Connect Now"}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic">Post Composer</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={28} />
              </button>
            </div>

            {/* Platform Selector */}
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Select Destinations</p>
            <div className="flex gap-3 mb-8">
              {platforms.map(p => (
                <button 
                  key={p.id} 
                  type="button"
                  onClick={() => setSelectedPlatforms(prev => 
                    prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                  )}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedPlatforms.includes(p.id) 
                      ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100 scale-105" 
                      : "border-slate-100 bg-slate-50 hover:border-slate-200"
                  }`}
                >
                  <p.icon size={24} style={{ color: selectedPlatforms.includes(p.id) ? p.color : "#94a3b8" }} />
                </button>
              ))}
            </div>

            {/* Text Area */}
            <textarea 
              value={postContent} 
              onChange={(e) => setPostContent(e.target.value)} 
              className="w-full h-44 p-6 bg-slate-50 rounded-[2rem] mb-6 focus:ring-4 focus:ring-blue-100 border-none outline-none text-lg font-medium placeholder:text-slate-300 transition-all resize-none" 
              placeholder="What's on your mind, Jeevan?" 
            />

            {/* Media Upload Section */}
            <div className="mb-8">
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*,video/*" 
              />
              
              {!mediaUrl ? (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-3 text-slate-500 font-bold p-5 border-2 border-dashed border-slate-200 rounded-[2rem] w-full justify-center hover:bg-blue-50 hover:border-blue-200 transition-all group"
                >
                  {isUploading ? (
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                  ) : (
                    <>
                      <ImageIcon size={24} className="group-hover:text-blue-600 transition-colors" /> 
                      <span>Add Photo / Video</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden group border-4 border-slate-50 shadow-lg">
                  {mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video src={mediaUrl} className="w-full h-56 object-cover" controls />
                  ) : (
                    <img src={mediaUrl} className="w-full h-56 object-cover" alt="Preview" />
                  )}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => setMediaUrl("")}
                      className="bg-white/90 text-red-500 p-2 rounded-full shadow-xl hover:bg-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Post Button */}
            <button 
              onClick={handlePost} 
              disabled={isPosting || isUploading}
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              {isPosting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" /> 
                  <span>Blasting...</span>
                </div>
              ) : "Post Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}