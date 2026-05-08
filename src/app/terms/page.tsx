import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 p-8 md:p-20 font-sans leading-relaxed">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-8 italic uppercase tracking-tighter text-slate-900 border-b-4 border-indigo-600 inline-block">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8 italic uppercase tracking-widest font-bold">Last Updated: May 2026</p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">1. Acceptance of Terms</h2>
            <p>By accessing or using PostJet, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">2. Description of Service</h2>
            <p>PostJet is a multi-platform social media management tool. We provide the ability to blast content to various third-party platforms. We are not responsible for the policies or actions of these platforms.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">3. User Conduct</h2>
            <p>You agree not to use PostJet for any unlawful purpose, spamming, or violating the community guidelines of the social media platforms you connect to.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3 text-slate-900">4. Limitation of Liability</h2>
            <p>PostJet shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service or any account suspensions by social media platforms.</p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-slate-100">
          <a href="/dashboard" className="text-indigo-600 font-bold hover:underline">← Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}