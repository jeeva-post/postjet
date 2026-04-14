"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Facebook, Instagram, Send, Youtube, LayoutDashboard, Link2, Calendar, BarChart3, 
  LogOut, Plus, ChevronRight, Zap, X, Image as ImageIcon, Smile 
} from "lucide-react";

export default function Dashboard() {
  const { data: session }: any = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000", bgColor: "#fff1f1" },
    { id: "telegram", name: "Telegram", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  ];

  const handlePost = async () => {
    if (!postContent || selectedPlatforms.length === 0) return alert("Please fill content and select platform!");
    setIsPosting(true);

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent,
          platforms: selectedPlatforms,
          accessToken: session?.accessToken, // Facebook టోకెన్ ఇక్కడ పంపిస్తున్నాం
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("🔥 అద్భుతం! నీ పోస్ట్ పంపించేశాను జీవన్.");
        setIsModalOpen(false);
        setPostContent("");
      }
    } catch (err) {
      alert("Error posting!");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen p-7">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Send size={24} /></div>
          <span className="text-2xl font-black">PostJet</span>
        </div>
        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem icon={<Link2 size={20} />} label="Connect" />
        </nav>
        <button onClick={() => signOut()} className="flex items-center gap-3 p-3 text-slate-500 font-bold"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black italic">Channels</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200"><Plus size={20} /> Create Post</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p) => {
            const isConnected = (p.id === "facebook" && !!session) || (p.id === "telegram" && !!process.env.NEXT_PUBLIC_TELEGRAM_SET);
            return (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between mb-4">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: p.bgColor, color: p.color }}><p.icon size={28} /></div>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${isConnected ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"}`}>{isConnected ? "Active" : "Offline"}</span>
                </div>
                <h3 className="text-xl font-bold">{p.name}</h3>
                <button onClick={() => signIn(p.id === "youtube" ? "google" : "facebook")} className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
                  {isConnected ? "Connected" : "Connect Now"}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xl rounded-[2rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Post Composer</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex gap-2 mb-6">
              {platforms.map(p => (
                <button key={p.id} onClick={() => setSelectedPlatforms(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                  className={`p-3 rounded-xl border-2 transition-all ${selectedPlatforms.includes(p.id) ? "border-blue-600 bg-blue-50" : "border-slate-100"}`}>
                  <p.icon size={20} style={{ color: selectedPlatforms.includes(p.id) ? p.color : "#94a3b8" }} />
                </button>
              ))}
            </div>
            <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)} className="w-full h-40 p-4 bg-slate-50 rounded-2xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="What's on your mind, Jeevan?" />
            <button onClick={handlePost} disabled={isPosting} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200">
              {isPosting ? "Blasting..." : "Post Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false }: any) {
  return <div className={`flex items-center gap-4 p-3 rounded-xl font-bold cursor-pointer ${active ? "bg-blue-600 text-white" : "text-slate-500"}`}>{icon} {label}</div>;
}