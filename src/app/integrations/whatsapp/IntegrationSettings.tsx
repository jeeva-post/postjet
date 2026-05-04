"use client";
import { useState } from "react";
import { Link2, ShieldCheck, Zap } from "lucide-react";

export default function WhatsappIntegrationSettings() {
  const [connected, setConnected] = useState(false);
  const [feedback, setFeedback] = useState("Configure your connection settings and sync with PostJet.");

  const toggleConnection = async () => {
    const action = connected ? "disconnect" : "connect";
    setFeedback(`${action.charAt(0).toUpperCase() + action.slice(1)}ing whatsapp...`);
    try {
      const res = await fetch(`/api/integrations/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setConnected(!connected);
        setFeedback(data.message);
      } else {
        setFeedback(data.error || "Unable to update connection.");
      }
    } catch (error) {
      setFeedback("Network error while updating integration.");
    }
  };

  return (
    <div className="p-8 bg-white rounded-[2rem] shadow-2xl border border-slate-200">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black capitalize">whatsapp</h2>
          <p className="text-slate-500 mt-2">Manage authentication, feature access, and publishing settings.</p>
        </div>
        <div className={`rounded-3xl px-4 py-3 font-bold text-sm ${connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
          {connected ? "Connected" : "Not connected"}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        <div className="rounded-3xl border border-slate-100 p-5 bg-slate-50">
          <h3 className="font-bold text-slate-900">Platform Control</h3>
          <p className="text-slate-500 text-sm mt-2">Update publish profiles and sync credentials for whatsapp content delivery.</p>
        </div>
        <div className="rounded-3xl border border-slate-100 p-5 bg-white shadow-sm">
          <h3 className="font-bold text-slate-900">Enterprise Mode</h3>
          <p className="text-slate-500 text-sm mt-2">Enterprise-grade automation with role-based access and audit-ready logs.</p>
        </div>
      </div>

      <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-xl mb-8">
        <div className="flex items-center gap-3">
          <Zap size={24} />
          <div>
            <p className="text-sm uppercase tracking-[0.3em] font-black">Instant sync</p>
            <p className="mt-2 text-base leading-6">Enable auto-post routing and schedule content workflows to the whatsapp channel.</p>
          </div>
        </div>
      </div>

      <button
        onClick={toggleConnection}
        className="w-full rounded-3xl px-5 py-4 font-bold text-white transition hover:opacity-90 bg-slate-900"
      >
        {connected ? "Disconnect" : "Connect"} WHATSAPP
      </button>

      <p className="mt-4 text-sm text-slate-500">{feedback}</p>
    </div>
  );
}
