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

  // --- Image Upload States ---
  const [mediaUrl, setMediaUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
    { id: "facebook", name: "Facebook Page", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
    { id: "instagram", name: "Instagram Business", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
    { id: "youtube", name: "YouTube Channel", icon: Youtube, color: "#FF0000", bgColor: "#fff1f1" },
    { id: "telegram", name: "Telegram Channel", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  ];

  // --- Image Upload Handler ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setMediaUrl(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Error uploading file!");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePost = async () => {
    if (!postContent || selectedPlatforms.length === 0) return alert("Please add content and select a platform!");
    setIsPosting(true);

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent,
          platforms: selectedPlatforms,
          accessToken: session?.accessToken,
          mediaUrl: mediaUrl, // Pass image URL to backend
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("🔥 Adbhutham! Nee post pampinchanu Jeevan.");
        setIsModalOpen(false);
        setPostContent("");
        setMediaUrl("");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Post failed!");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar - Emi marchaledu */}
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

        {/* Platform Cards - Ivvi kuda alaage untayi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((p) => {
            const isConnected = (p.id === "facebook" && !!session) || (p.id === "telegram" && !!process.env.NEXT_PUBLIC_TELEGRAM_SET);
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

      {/* --- MODAL WITH GALLERY OPTION --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl scale-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black italic">Post Composer</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={28} />
              </button>
            </div>

            {/* Platform Selector */}
            <div className="flex gap-3 mb-8">
              {platforms.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedPlatforms.includes(p.id) ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100" : "border-slate-100 bg-slate-50"
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
              className="w-full h-44 p-6 bg-slate-50 rounded-[2rem] mb-6 focus:ring-4 focus:ring-blue-100 border-none outline-none text-lg font-medium placeholder:text-slate-300 transition-all" 
              placeholder="What's on your mind, Jeevan?" 
            />

            {/* --- MEDIA UPLOAD SECTION (Gallery Option) --- */}
            <div className="mb-8">
              <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept="image/*" />
              
              {!mediaUrl ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-3 text-slate-500 font-bold p-5 border-2 border-dashed border-slate-200 rounded-[2rem] w-full justify-center hover:bg-blue-50 hover:border-blue-200 transition-all group"
                >
                  {isUploading ? (
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                  ) : (
                    <>
                      <ImageIcon size={24} className="group-hover:text-blue-600 transition-colors" /> 
                      <span>Add Photos from Gallery</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="relative rounded-[2rem] overflow-hidden group border-4 border-slate-50 shadow-lg">
                  <img src={mediaUrl} className="w-full h-56 object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button 
                      onClick={() => setMediaUrl("")}
                      className="bg-white text-red-500 p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Post Button */}
            <button 
              onClick={handlePost} 
              disabled={isPosting || isUploading}
              className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isPosting ? "Blasting Post..." : "Post Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}