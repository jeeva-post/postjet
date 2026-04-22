import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { LayoutDashboard, Send, Settings, Clock, CheckCircle2 } from "lucide-react";
import Composer from "@/components/Composer";

async function getHistory(userId: string) {
  const client = await clientPromise;
  return await client.db("postjet").collection("posts").find({ userId }).sort({ createdAt: -1 }).limit(5).toArray();
}

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");
  const user = await getUser();
  const history = await getHistory(user?.id || "");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-white border-r border-slate-200 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="font-black text-2xl italic uppercase mb-12 text-blue-600">PostJet.</div>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-4 bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase shadow-lg">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[10px] uppercase hover:text-blue-600">
            <Settings size={20} /> Settings
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-12">
        <header className="mb-10 flex justify-between items-center">
            <div>
                <h2 className="text-4xl font-black uppercase italic">Control Room</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase mt-2">Welcome, {user?.given_name}</p>
            </div>
            <img src={user?.picture || ""} className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white" />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          <div className="xl:col-span-8"><Composer /></div>
          
          <div className="xl:col-span-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 flex items-center gap-2"><Clock size={14}/> Recent Activity</h3>
            <div className="space-y-4">
              {history.map((post: any) => (
                <div key={post._id.toString()} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                  <p className="text-sm font-bold text-slate-700 line-clamp-2 mb-4">{post.content || "Media Broadcast"}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <span className="text-[9px] font-black text-slate-300 uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <CheckCircle2 size={14} className="text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}