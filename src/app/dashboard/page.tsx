"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { 
  Facebook, Instagram, Send, Twitter, Linkedin, Youtube, Globe, MessageSquare, Play, Hash,
  LayoutDashboard, Link2, Calendar, BarChart3, Settings, LogOut, Bell, Plus, UserCircle, ChevronRight, Zap, X, Image as ImageIcon, Smile
} from "lucide-react";

export const dynamic = "force-dynamic";

const platforms = [
  { id: "facebook", name: "Facebook", icon: Facebook, color: "#1877F2", bgColor: "#e7f3ff" },
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#E4405F", bgColor: "#fdf2f8" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#FF0000", bgColor: "#fff1f1" },
  { id: "telegram", name: "Telegram", icon: Send, color: "#0088cc", bgColor: "#e0f2fe" },
  { id: "slack", name: "Slack", icon: MessageSquare, color: "#4A154B", bgColor: "#f3e8ff" },
  { id: "discord", name: "Discord", icon: MessageSquare, color: "#5865F2", bgColor: "#f0f2ff" },
];

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const handleConnect = async (platformId: string) => {
    const provider = (platformId === "instagram") ? "facebook" : 
                     (platformId === "youtube") ? "google" : platformId;
    await signIn(provider);
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handlePost = async () => {
    if (!postContent || selectedPlatforms.length === 0) {
      alert("Please write something and select at least one platform!");
      return;
    }
    setIsPosting(true);
    // TODO: ఇక్కడ మనం తర్వాత API కాల్ రాద్దాం
    setTimeout(() => {
      alert("Success! Your post has been scheduled to selected platforms.");
      setIsPosting(false);
      setIsModalOpen(false);
      setPostContent("");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans antialiased text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-screen sticky top-0 shadow-sm">
        <div className="p-7 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg text-white">
            <Send size={24} className="rotate-12" />
          </div>
          <span className="text-2xl font-black tracking-tighter">PostJet</span>
        </div>
        <nav className="flex-1 px-4 mt-8 space-y-1.5">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem icon={<Link2 size={20} />} label="Integrations" active />
          <NavItem icon={<Calendar size={20} />} label="Schedules" />
          <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
        </nav>
        <div className="p-5 border-t border-slate-100">
          <button onClick={() => signIn()} className="flex items-center gap-3 px-5 py-4 w-full text-slate-500 hover:text-white hover:bg-slate-900 rounded-2xl transition-all font-bold">
            <LogOut size={20} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Grid */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen bg-[#f8fafc]">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Channels</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium italic">Command Center</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-blue-700 shadow-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={20} /> Create Post
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {platforms.map((platform) => (
            <div key={platform.id} className="group bg-white rounded-[2rem] border border-slate-100 p-7 shadow-sm hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3.5 rounded-2xl shadow-inner" style={{ backgroundColor: platform.bgColor, color: platform.color }}>
                  <platform.icon size={32} />
                </div>
                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black rounded-full uppercase">Offline</span>
              </div>
              <h3 className="text-xl font-black text-slate-950">{platform.name}</h3>
              <p className="text-slate-500 text-sm mt-1 mb-6 h-10 line-clamp-2">Connect and automate your {platform.name}.</p>
              <button onClick={() => handleConnect(platform.id)} className="w-full py-3.5 rounded-2xl font-bold text-sm bg-slate-950 text-white hover:bg-slate-800">
                Connect <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* --- THE POST COMPOSER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">Create Global Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              {/* Platform Selector in Modal */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {platforms.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex-shrink-0 p-3 rounded-2xl transition-all border-2 ${
                      selectedPlatforms.includes(p.id) ? "border-blue-600 bg-blue-50" : "border-slate-100 bg-white"
                    }`}
                  >
                    <p.icon size={20} style={{ color: selectedPlatforms.includes(p.id) ? p.color : "#94a3b8" }} />
                  </button>
                ))}
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's the global buzz today? Write your message here..."
                  className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-blue-500 text-lg font-medium placeholder:text-slate-400 resize-none"
                />
                <div className="absolute bottom-4 right-6 flex gap-4 text-slate-400">
                  <Smile size={20} className="cursor-pointer hover:text-blue-500" />
                  <ImageIcon size={20} className="cursor-pointer hover:text-blue-500" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Save Draft
                </button>
                <button 
                  onClick={handlePost}
                  disabled={isPosting}
                  className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 ${
                    isPosting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isPosting ? "Processing..." : <><Send size={20} /> Blast to All Channels</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl transition-all font-bold text-sm ${
      active ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
    }`}>
      {icon} <span>{label}</span>
    </button>
  );
}