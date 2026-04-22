import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { LayoutDashboard, Send, Settings, Image as ImageIcon } from "lucide-react";
import { postToTelegram } from "../actions/post-action";

async function syncUser(user: any) {
  if (!user) return;
  try {
    const client = await clientPromise;
    const db = client.db("postjet");
    await db.collection("users").updateOne(
      { kindeId: user.id },
      {
        $set: {
          kindeId: user.id,
          email: user.email,
          name: `${user.given_name} ${user.family_name}`,
          image: user.picture,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  } catch (e) {
    console.error("Database Sync Error:", e);
  }
}

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  const user = await getUser();
  await syncUser(user);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-xl text-white"><Send size={16} /></div>
          <span className="font-black text-xl italic uppercase tracking-tighter">PostJet</span>
        </div>
        <nav className="space-y-4">
          <a href="/dashboard" className="flex items-center gap-3 bg-blue-50 text-blue-600 p-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
            <LayoutDashboard size={18} /> Home
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-3 text-slate-400 p-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all">
            <Settings size={18} /> Connections
          </a>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-10">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
            Welcome, {user?.given_name}!
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Ready to blast content?</p>
        </header>

        <div className="max-w-4xl">
          <form action={postToTelegram} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Create Post</h3>
            </div>
            
            <textarea 
              name="content"
              required
              placeholder="Type your message here and it will go straight to Telegram..."
              className="w-full h-48 p-6 bg-slate-50 rounded-3xl border-none focus:ring-2 focus:ring-blue-100 text-slate-700 font-bold resize-none mb-6 text-lg"
            />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button type="button" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all bg-slate-100 px-5 py-3 rounded-xl">
                  <ImageIcon size={16} /> Image
                </button>
              </div>
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
              >
                Post Now <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}