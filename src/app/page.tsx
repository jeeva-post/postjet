import Link from "next/link";
import { Send, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-cyan-500/10 px-5 py-3 text-sm uppercase tracking-[0.35em] text-cyan-300">
              <Sparkles size={18} /> SaaS platform for global teams
            </div>
            <div className="space-y-6">
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl">PostJet automates your global social media publishing.</h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">Compose text, image, and video posts, schedule campaigns, and publish across 15+ integrations from a single enterprise dashboard.</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-3xl bg-cyan-500 px-8 py-4 font-black text-slate-950 transition hover:bg-cyan-400">
                Open dashboard <ArrowRight size={18} />
              </Link>
              <Link href="/subscription" className="inline-flex items-center justify-center rounded-3xl border border-white/10 px-8 py-4 text-white transition hover:bg-white/10">
                Explore plans
              </Link>
            </div>
          </section>

          <section className="rounded-[3rem] border border-white/10 bg-slate-900/80 p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                <Send size={28} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">What you get</p>
                <p className="mt-2 text-2xl font-black">Unified publishing for all major networks.</p>
              </div>
            </div>
            <div className="space-y-5">
              {[
                "Multi-platform post composer",
                "Subscription-based feature gating",
                "Supabase storage cleanup on delivery",
              ].map((item) => (
                <div key={item} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <div className="rounded-3xl bg-slate-800 p-3 text-cyan-300">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
