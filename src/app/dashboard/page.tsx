import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, Send, Link as LinkIcon, Image as ImageIcon, Settings } from "lucide-react";

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login"); // లాగిన్ అవ్వకపోతే వెనక్కి పంపేస్తుంది
  }

  const user = await getUser();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <img src="/logo.png" alt="PostJet" className="w-5 h-5 invert" />
          </div>
          <span className="font-black text-lg tracking-tighter italic uppercase">PostJet</span>
        </div>

        <nav className="space-y-2 flex-1">
          <a href="#" className="flex items-center gap-3 bg-blue-50 text-blue-600 p-3 rounded-xl font-bold text-xs uppercase tracking-widest">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <LinkIcon size={18} /> Connect Accounts
          </a>
          <a href="#" className="flex items-center gap-3 text-slate-500 hover:bg-slate-50 p-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
            <Settings size={18} /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Welcome back, {user?.given_name}!</h2>
          <p className="text-slate-500 font-medium text-sm">Ready to blast your content everywhere?</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Composer */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Create New Post</h3>
            </div>
            
            <textarea 
              placeholder="What do you want to share today?"
              className="w-full h-40 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium resize-none mb-4"
            />

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition-all">
                <ImageIcon size={16} /> Add Image
              </button>
              
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                Post Everywhere <Send size={14} />
              </button>
            </div>
          </div>

          {/* Connected Platforms */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
             <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400 mb-6">Active Platforms</h3>
             <div className="space-y-4">
               {['Facebook', 'Instagram', 'Telegram', 'Pinterest'].map((platform) => (
                 <div key={platform} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{platform}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                 </div>
               ))}
               <button className="w-full mt-4 border-2 border-dashed border-slate-200 p-3 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-300 hover:text-blue-500 transition-all">
                 + Add Platform
               </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}