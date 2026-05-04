import { ShieldCheck, Sparkles } from "lucide-react";

const tiers = [
  { title: "Free", price: "$0", benefits: ["Single-user access", "Basic publishing", "Limited channels"], lockedFeatures: ["Video upload", "Priority support", "Advanced integrations"] },
  { title: "Pro", price: "$29/mo", benefits: ["Up to 5 team members", "Image + video posts", "Premium channel access"], lockedFeatures: ["Enterprise workflows"] },
  { title: "Enterprise", price: "$99/mo", benefits: ["Unlimited channels", "Custom automation", "Dedicated account manager"], lockedFeatures: [] },
];

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="rounded-[3rem] border border-cyan-400/10 bg-slate-900/80 p-10 shadow-2xl backdrop-blur-xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Subscription Center</p>
            <h1 className="mt-4 text-5xl font-black">Choose the plan that powers your global campaigns.</h1>
            <p className="mt-6 text-slate-400 text-lg">PostJet offers flexible pricing for solo brands, growth teams, and enterprise media operations.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.title} className="rounded-[2rem] bg-slate-900/90 border border-white/10 p-8 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">{tier.title}</p>
                  <h2 className="mt-3 text-4xl font-black">{tier.price}</h2>
                </div>
                <div className="rounded-3xl bg-cyan-500/10 px-4 py-3 text-cyan-200">
                  <ShieldCheck size={24} />
                </div>
              </div>
              <ul className="space-y-3 text-slate-300 mb-8">
                {tier.benefits.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Sparkles size={18} className="mt-1 text-cyan-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-3xl bg-cyan-500 px-5 py-4 font-black uppercase tracking-[0.15em] text-slate-950 hover:bg-cyan-400 transition">
                Choose {tier.title}
              </button>
              {tier.lockedFeatures.length > 0 && (
                <p className="mt-5 text-xs text-slate-500">
                  Includes locked features: {tier.lockedFeatures.join(", ")}.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
