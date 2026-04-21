import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle2, PlusCircle, Link2 } from "lucide-react";

// Brand Icons as SVGs (No dependency needed)
const Icons = {
  Telegram: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Instagram: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
  ),
  Facebook: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  YouTube: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
  )
};

export default async function AccountsPage() {
  const { isAuthenticated } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const platforms = [
    { name: "Telegram", icon: <Icons.Telegram />, status: "Connected", desc: "Link your Bot or Channel" },
    { name: "Instagram", icon: <Icons.Instagram />, status: "Not Connected", desc: "Post directly to your feed" },
    { name: "Facebook", icon: <Icons.Facebook />, status: "Not Connected", desc: "Manage your FB pages" },
    { name: "YouTube", icon: <Icons.YouTube />, status: "Not Connected", desc: "Upload shorts and videos" },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-xl">
                <Link2 className="text-white w-5 h-5" />
            </div>
            <h1 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter">Connections</h1>
        </div>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Manage your social profiles</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {platforms.map((p) => (
          <div key={p.name} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 transition-all">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-white rounded-2xl shadow-sm">{p.icon}</div>
              {p.status === "Connected" ? (
                <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">
                  <CheckCircle2 size={10} /> Active
                </div>
              ) : (
                <div className="bg-slate-200 text-slate-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">Inactive</div>
              )}
            </div>
            <h3 className="font-black text-2xl text-slate-900 mb-2 italic uppercase tracking-tighter">{p.name}</h3>
            <p className="text-slate-400 text-[11px] mb-8 leading-relaxed">{p.desc}</p>
            <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              p.status === "Connected" ? "bg-white text-slate-300 border border-slate-200" : "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
            }`}>
              {p.status === "Connected" ? "Connected" : <PlusCircle size={14} className="inline mr-2" />} 
              {p.status !== "Connected" && "Connect Account"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}