import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { 
  LayoutDashboard, Globe, BarChart3, 
  Rocket, Clock, Zap, Send, TrendingUp 
} from "lucide-react";
import Composer from "@/components/Composer";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getUserAccounts } from "@/app/actions/account-actions";

// హిస్టరీ డేటా తెచ్చే ఫంక్షన్
async function getHistory(userId: string) {
  const client = await clientPromise;
  return await client.db("postjet").collection("posts")
    .find({ userId })
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();
}

export default async function DashboardPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");
  
  const user = await getUser();
  // డేటాబేస్ నుండి రియల్ అకౌంట్స్ మరియు హిస్టరీ తెస్తున్నాం
  const [accounts, history] = await Promise.all([
    getUserAccounts(),
    getHistory(user?.id || "")
  ]);

  const stats = [
    { label: "Total Posts", value: history.length.toString(), icon: <Send size={20}/>, color: "bg-blue-500" },
    { label: "Reach", value: "Active", icon: <TrendingUp size={20}/>, color: "bg-purple-500" },
    { label: "Platforms", value: accounts.length.toString(), icon: <Globe size={20}/>, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex font-sans overflow-hidden">
      
      {/* 🚀 Futuristic Sidebar */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col p-8 sticky top-0 h-screen z-30">
        <div className="flex items-center gap-3 mb-16">
          <img src="/logo.png" alt="PostJet" className="w-12" />
          <span className="font-black text-3xl italic tracking-tighter">
            Post<span className="text-blue-500">Jet</span>
          </span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <a href="#" className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all">
            <Globe size={20} /> Connections
          </a>
          <a href="#" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-all">
            <BarChart3 size={20} /> Analytics
          </a>
        </nav>

        <div className="pt-8 border-t border-slate-800">
           <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl p-6 border border-blue-500/30 relative overflow-hidden mb-6">
              <Rocket className="absolute -right-4 -bottom-4 text-blue-500/20 rotate-45" size={100} />
              <p className="font-black text-[10px] uppercase tracking-widest text-blue-400 mb-1">Status</p>
              <p className="text-xl font-black italic">PRO ACTIVE</p>
           </div>
           <LogoutLink className="flex items-center gap-4 text-slate-500 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:text-red-400 transition-all">
              Logout
           </LogoutLink>
        </div>
      </aside>

      {/* 🌌 Main Command Center */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />

        <header className="mb-12 flex justify-between items-end relative z-10">
            <div>
              <p className="text-blue-400 font-black uppercase text-[10px] tracking-[0.4em] mb-2">Command Center</p>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic">Mission Control</h2>
            </div>
            <div className="flex gap-4">
               {stats.map((stat) => (
                 <div key={stat.label} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-4 rounded-2xl min-w-[140px]">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-slate-500 font-black text-[9px] uppercase tracking-widest">{stat.label}</span>
                       <div className={`${stat.color} p-1.5 rounded-lg text-white`}>{stat.icon}</div>
                    </div>
                    <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
                 </div>
               ))}
            </div>
        </header>

        {/* COMPOSER (Real Data లింక్ అయి ఉంటుంది) */}
        <div className="mb-16 relative z-10">
          <Composer connectedAccounts={accounts} />
        </div>

        {/* HISTORY LOGS */}
        <section className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-slate-800" />
              <h3 className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-3">
                <Clock size={16} className="text-blue-500" /> History Logs
              </h3>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-slate-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {history.map((post: any) => (
                <div key={post._id.toString()} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] group hover:border-blue-500/50 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex gap-2">
                        {post.platforms?.map((p: string) => (
                          <div key={p} className="w-2 h-2 rounded-full bg-blue-500" title={p} />
                        ))}
                     </div>
                     <Zap size={18} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm leading-relaxed mb-6 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-600">
                     <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1 text-green-500">Success</span>
                  </div>
                </div>
              ))}
            </div>
        </section>
      </main>
    </div>
  );
}