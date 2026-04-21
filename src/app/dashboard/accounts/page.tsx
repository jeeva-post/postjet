import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { 
  Youtube, 
  Instagram, 
  Facebook, 
  Send, 
  CheckCircle2, 
  PlusCircle,
  Link2
} from "lucide-react";

export default async function AccountsPage() {
  const { isAuthenticated } = getKindeServerSession();
  
  // యూజర్ లాగిన్ అవ్వకపోతే లాగిన్ పేజీకి పంపిస్తుంది
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  // సోషల్ మీడియా ప్లాట్‌ఫామ్స్ లిస్ట్ - ఇక్కడ లోకల్ ఐకాన్స్ వాడటం లేదు
  const platforms = [
    { 
      name: "Telegram", 
      icon: <Send size={28} className="text-blue-500" />, 
      status: "Connected",
      desc: "Connect your Telegram bot or channel"
    },
    { 
      name: "Instagram", 
      icon: <Instagram size={28} className="text-pink-600" />, 
      status: "Not Connected",
      desc: "Post directly to your Insta feed"
    },
    { 
      name: "Facebook", 
      icon: <Facebook size={28} className="text-blue-700" />, 
      status: "Not Connected",
      desc: "Manage your Facebook pages"
    },
    { 
      name: "YouTube", 
      icon: <Youtube size={28} className="text-red-600" />, 
      status: "Not Connected",
      desc: "Upload shorts and videos"
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                <Link2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">
                Connections
            </h1>
        </div>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            Link your social profiles to start blasting content
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {platforms.map((p) => (
          <div key={p.name} className="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-300">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              {p.status === "Connected" ? (
                <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                  <CheckCircle2 size={10} /> Active
                </div>
              ) : (
                <div className="bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                  Inactive
                </div>
              )}
            </div>
            
            <h3 className="font-black text-2xl text-slate-900 mb-2 italic uppercase tracking-tighter">{p.name}</h3>
            <p className="text-slate-400 text-[11px] font-medium mb-8 leading-relaxed">{p.desc}</p>
            
            <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
              p.status === "Connected" 
              ? "bg-white text-slate-400 border border-slate-200 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20"
            }`}>
              {p.status === "Connected" ? "Linked Successfully" : <><PlusCircle size={14} /> Connect Account</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}