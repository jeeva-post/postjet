import Link from "next/link";
import { ChevronRight, Link2 } from "lucide-react";

const apps = [
  { id: "facebook", label: "Facebook", color: "bg-blue-600" },
  { id: "instagram", label: "Instagram", color: "bg-pink-500" },
  { id: "linkedin", label: "LinkedIn", color: "bg-sky-700" },
  { id: "telegram", label: "Telegram", color: "bg-cyan-500" },
  { id: "twitter", label: "Twitter", color: "bg-sky-500" },
  { id: "youtube", label: "YouTube", color: "bg-red-600" },
  { id: "pinterest", label: "Pinterest", color: "bg-red-500" },
  { id: "whatsapp", label: "WhatsApp", color: "bg-emerald-600" },
  { id: "tiktok", label: "TikTok", color: "bg-black" },
  { id: "reddit", label: "Reddit", color: "bg-orange-500" },
  { id: "discord", label: "Discord", color: "bg-violet-700" },
  { id: "snapchat", label: "Snapchat", color: "bg-yellow-400" },
  { id: "mastodon", label: "Mastodon", color: "bg-slate-900" },
  { id: "twitch", label: "Twitch", color: "bg-violet-600" },
  { id: "medium", label: "Medium", color: "bg-slate-800" },
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[3rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Integration Center</p>
              <h1 className="text-4xl sm:text-5xl font-black">Manage every channel from one SaaS hub.</h1>
            </div>
            <div className="rounded-3xl bg-slate-900/80 px-6 py-4 border border-white/10">
              <p className="text-sm text-slate-300">15+ connected networks</p>
              <p className="mt-2 text-3xl font-extrabold">Global Reach</p>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {apps.map((app) => (
              <Link key={app.id} href={`/integrations/${app.id}`} className="group block rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
                <div className={`inline-flex items-center justify-center rounded-3xl p-4 text-white ${app.color}`}>
                  <Link2 size={22} />
                </div>
                <div className="mt-6">
                  <h2 className="text-2xl font-black capitalize">{app.label}</h2>
                  <p className="mt-3 text-slate-400">Configure account access, publishing rules and enterprise automation for {app.label}.</p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-[0.2em]">
                  Open settings <ChevronRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
