import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { 
  LayoutDashboard, Settings, Clock, 
  CheckCircle2, Zap, Rocket, Globe, BarChart3 
} from "lucide-react";
import Composer from "@/components/Composer";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

async function getHistory(userId: string) {
  const client = await clientPromise;
  return await client.db("postjet").collection("posts").find({ userId }).sort({ createdAt: -1 }).limit(6).toArray();
}

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");
  const user = await getUser();
  const history = await getHistory(user?.id || "");

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-blue-100 hidden xl:flex flex-col p-8 sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-12">
          <img src="/logo.png" alt="PostJet" className="w-10" />
          <span className="font-black text-2xl italic uppercase tracking-tighter text-slate-900">
            Post<span className="text-blue-600">Jet</span>
          </span>
        </div>
        
        <nav className="flex-1 space-y-3">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4 mb-2">Menu</p>
          <a href="#" className="flex items-center gap-4 bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all">
            <Globe size={20} /> Connections
          </a>
          <a href="#" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all">
            <BarChart3 size={20} /> Analytics
          </a>
        </nav>

        <div className="pt-8 border-t border-slate-100">
           <div className="bg-slate-900 rounded-3xl p-5 mb-6 relative overflow-hidden group">
              <Rocket className="absolute -right-2 -bottom-2 text-white/10 group-hover:scale-125 transition-transform" size={80} />
              <p className="text-white font-black text-[10px] uppercase tracking-widest mb-1 relative z-10">Pro Plan</p>
              <p className="text-blue-400 font-bold text-[9px] relative z-10">Unlimited Posting</p>
           </div>
           <LogoutLink className="flex items-center gap-4 text-red-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all w-full">
              Logout
           </LogoutLink>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-12 flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">Broadcast Hub</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Welcome back, {user?.given_name} 🦾</p>
            </div>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-3xl border border-blue-50 shadow-sm">
                <img src={user?.picture || ""} className="w-12 h-12 rounded-2xl shadow-md border-2 border-white" />
                <div>
                   <p className="text-xs font-black uppercase tracking-tighter">{user?.given_name}</p>
                   <p className="text-[9px] font-bold text-green-500 uppercase">Online</p>
                </div>
            </div>
        </header>

        {/* COMPOSER COMPONENT */}
        <div className="mb-16">
          <Composer />
        </div>

        {/* HISTORY SECTION */}
        <section>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Clock size={16} className="text-blue-500" /> Recent Transmissions
              </h3>
              <a href="#" className="text-[9px] font-black uppercase text-blue-600 hover:underline">View All History</a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((post: any) => (
                <div key={post._id.toString()} className="bg-white p-8 rounded-[2.5rem] border border-blue-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                     <Zap size={20} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed line-clamp-3 mb-6">
                    {post.content || "No text content"}
                  </p>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <div className="flex gap-2">
                      {post.platforms?.map((p: string) => (
                        <span key={p} className="w-2 h-2 rounded-full bg-blue-500" title={p}></span>
                      ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {history.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-blue-100">
                   <p className="text-slate-300 font-black uppercase text-xs tracking-widest">No transmissions yet. Start your first jet!</p>
                </div>
              )}
            </div>
        </section>
      </main>
    </div>
  );
}