import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { 
  Settings, User, Shield, Link as LinkIcon, 
  CheckCircle2, AlertCircle, ChevronRight, LayoutDashboard 
} from "lucide-react";

export default async function SettingsPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");
  const user = await getUser();

  const connectedApps = [
    { name: "Telegram", status: "Connected", iconColor: "text-[#0088cc]", bg: "bg-[#0088cc]10" },
    { name: "Instagram", status: "Not Connected", iconColor: "text-[#E1306C]", bg: "bg-[#E1306C]10" },
    { name: "YouTube", status: "Not Connected", iconColor: "text-[#FF0000]", bg: "bg-[#FF0000]10" },
    { name: "Pinterest", status: "Connected", iconColor: "text-[#BD081C]", bg: "bg-[#BD081C]10" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg italic font-black">PJ</div>
          <span className="font-black text-xl italic uppercase tracking-tighter">PostJet</span>
        </div>
        <nav className="space-y-2">
          <a href="/dashboard" className="flex items-center gap-4 text-slate-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="/dashboard/accounts" className="flex items-center gap-4 bg-blue-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100">
            <Settings size={20} /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-12">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-900">Settings Center</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Manage your profile and social connections</p>
        </header>

        <div className="max-w-4xl space-y-10">
          {/* Section 1: Profile */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8 border-b pb-6">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-600"><User size={24}/></div>
                <h3 className="font-black uppercase text-sm tracking-widest">Personal Account</h3>
            </div>
            <div className="flex items-center gap-6">
                <img src={user?.picture || ""} className="w-20 h-20 rounded-3xl border-4 border-slate-50 shadow-md" alt="Avatar" />
                <div>
                    <p className="text-xl font-black text-slate-900">{user?.given_name} {user?.family_name}</p>
                    <p className="text-slate-400 font-bold text-sm">{user?.email}</p>
                </div>
                <button className="ml-auto bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] uppercase border border-slate-200 hover:bg-slate-100">Edit</button>
            </div>
          </section>

          {/* Section 2: Social Connections */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8 border-b pb-6">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><LinkIcon size={24}/></div>
                <h3 className="font-black uppercase text-sm tracking-widest">App Connections</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectedApps.map((app) => (
                    <div key={app.name} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${app.bg} ${app.iconColor} rounded-2xl flex items-center justify-center font-black italic shadow-sm`}>{app.name[0]}</div>
                            <div>
                                <p className="font-black text-sm">{app.name}</p>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${app.status === 'Connected' ? 'text-green-500' : 'text-slate-400'}`}>{app.status}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600" />
                    </div>
                ))}
            </div>
          </section>

          {/* Section 3: API & Security */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8 border-b pb-6">
                <div className="bg-purple-100 p-3 rounded-2xl text-purple-600"><Shield size={24}/></div>
                <h3 className="font-black uppercase text-sm tracking-widest">Developer Keys</h3>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl text-white">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-green-400" />
                        <span className="font-bold text-[11px] uppercase tracking-widest">MongoDB Status</span>
                    </div>
                    <span className="text-[10px] font-black text-green-400">ACTIVE</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl text-white opacity-80">
                    <div className="flex items-center gap-3">
                        <AlertCircle size={18} className="text-orange-400" />
                        <span className="font-bold text-[11px] uppercase tracking-widest">Cloudinary Status</span>
                    </div>
                    <span className="text-[10px] font-black text-orange-400">CHECK KEYS</span>
                </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}