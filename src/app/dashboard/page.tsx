import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, Send, Settings, Image as ImageIcon, Video, Paperclip } from "lucide-react";
import { postToTelegram } from "../actions/post-action";

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");
  const user = await getUser();

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8">
        <div className="flex items-center gap-3 mb-12 font-black text-2xl italic uppercase tracking-tighter text-blue-600">PostJet</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="flex items-center gap-4 bg-blue-50 text-blue-600 p-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest">
            <LayoutDashboard size={20} /> Home
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:text-blue-600 transition-all">
            <Settings size={20} /> Connections
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-12">
        <header className="mb-10">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic text-slate-900">Welcome, {user?.given_name}!</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Ready to post everywhere?</p>
        </header>

        <form action={postToTelegram} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl max-w-4xl">
          <textarea 
            name="content"
            required
            placeholder="What's the plan for today?"
            className="w-full h-56 p-8 bg-slate-50 rounded-[2.5rem] border-none text-slate-700 font-bold mb-8 text-xl focus:ring-2 focus:ring-blue-100 transition-all"
          />

          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-4">
                {/* Media Upload Label */}
                <label className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase bg-slate-50 px-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition-all">
                    <Paperclip size={18} />
                    <span>Add Image / Video</span>
                    <input type="file" name="media" accept="image/*,video/*" className="hidden" />
                </label>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-12 py-5 rounded-[1.5rem] font-black uppercase text-[11px] flex items-center gap-4 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
              Post Now <Send size={18} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}