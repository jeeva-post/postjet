import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import { 
  LayoutDashboard, Send, Settings, 
  Image as ImageIcon, Clock, CheckCircle2, 
  Video as VideoIcon, FileText
} from "lucide-react";
import Composer from "@/components/Composer";

// మంగోడిబి నుండి పోస్టులు తెచ్చే ఫంక్షన్
async function getRecentPosts(userId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("postjet");
    const posts = await db.collection("posts")
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    return posts;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");
  
  const user = await getUser();
  const recentPosts = await getRecentPosts(user?.id || "");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-200 text-white">
            <Send size={24} strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl italic uppercase tracking-tighter">PostJet<span className="text-blue-600">.</span></span>
        </div>
        <nav className="flex-1 space-y-4">
          <a href="/dashboard" className="flex items-center gap-4 bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all">
            <Settings size={20} /> Connections
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Control Room</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Welcome, {user?.given_name}</p>
          </div>
          <img src={user?.picture || ""} className="w-12 h-12 rounded-2xl border-4 border-white shadow-lg" alt="User" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Composer */}
          <div className="lg:col-span-8">
            <Composer />
          </div>

          {/* Right: Recent History */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-4 flex items-center gap-2">
              <Clock size={14} /> Recent Activity
            </h3>
            
            <div className="space-y-4">
              {recentPosts.length === 0 ? (
                <div className="bg-white p-8 rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 text-xs font-bold">
                  No posts yet. Start broadcasting!
                </div>
              ) : (
                recentPosts.map((post: any) => (
                  <div key={post._id.toString()} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-slate-50 p-2 rounded-xl text-blue-600">
                        {post.mediaType === "image" ? <ImageIcon size={16} /> : post.mediaType === "video" ? <VideoIcon size={16} /> : <FileText size={16} />}
                      </div>
                      <span className="text-[9px] font-black uppercase text-green-500 bg-green-50 px-3 py-1 rounded-full">
                        {post.platform}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm font-bold line-clamp-2 mb-3 leading-relaxed">
                      {post.content || "Media Post"}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                       <span className="text-[9px] font-bold text-slate-300 uppercase">
                         {new Date(post.createdAt).toLocaleDateString()}
                       </span>
                       <CheckCircle2 size={14} className="text-blue-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}