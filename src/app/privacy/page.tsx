import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-8 md:p-20 font-sans leading-relaxed">
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-16 rounded-[40px] shadow-sm border border-slate-100">
        <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter text-slate-900 border-b-4 border-indigo-600 inline-block">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8 italic uppercase tracking-widest font-bold">Safe & Secure Data Handling</p>

        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">1. Information We Collect</h2>
            <p>We collect your email and name during registration. When you connect social media accounts, we store secure access tokens. **We do not store your social media passwords.**</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">2. How We Use Your Data</h2>
            <p>Your data is strictly used to facilitate the posting of content that you initiate. We do not sell or share your data with third-party advertisers.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">3. Data Security</h2>
            <p>We use industry-standard encryption to protect your data. Authentication is handled securely via Supabase and OAuth protocols.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">4. Third-Party Services</h2>
            <p>Our service interacts with APIs from Facebook, LinkedIn, Twitter, etc. Your use of these services is also subject to their respective privacy policies.</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
          <a href="/register" className="text-indigo-600 font-bold hover:underline">← Back to Register</a>
          <p className="text-[10px] font-black text-slate-400 uppercase">PostJet © 2026</p>
        </div>
      </div>
    </div>
  );
}