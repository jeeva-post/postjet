import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, Send, Settings, 
  BarChart3, Users, Zap, Bell, Search
} from "lucide-react";
import Composer from "@/components/Composer"; // Ippudu manam deeni create cheddam

export default async function Dashboard() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  if (!(await isAuthenticated())) redirect("/api/auth/login");
  const user = await getUser();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar - Pro Design */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-200 text-white">
            <Send size={24} strokeWidth={2.5} />
          </div>
          <span className="font-black text-2xl italic uppercase tracking-tighter text-slate-900">PostJet<span className="text-blue-600">.</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 ml-4">Main Menu</p>
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem href="/dashboard/analytics" icon={<BarChart3 size={20} />} label="Analytics" />
          <NavItem href="/dashboard/accounts" icon={<Settings size={20} />} label="Connections" />
          <NavItem href="/dashboard/team" icon={<Users size={20} />} label="Team Members" />
        </nav>

        <div className="mt-auto p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-xs font-black uppercase text-slate-400 mb-2">Pro Plan</p>
            <p className="text-[10px] text-slate-500 font-medium mb-4">Unlock 20+ more platforms</p>
            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Upgrade</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
              Control Room
            </h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Welcome back, {user?.given_name}</p>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 cursor-pointer hover:text-blue-600 transition-all"><Search size={20} /></div>
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 cursor-pointer hover:text-blue-600 transition-all"><Bell size={20} /></div>
              <img src={user?.picture || ""} className="w-12 h-12 rounded-2xl border-2 border-white shadow-lg" alt="Profile" />
          </div>
        </header>

        {/* Composer & Preview Component */}
        <Composer />
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: any) {
  return (
    <a href={href} className={`flex items-center gap-4 p-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'}`}>
      {icon} {label}
    </a>
  );
}