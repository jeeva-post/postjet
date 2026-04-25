"use client";
import React from "react";
// నీ ఫైల్ స్ట్రక్చర్ ప్రకారం ఇక్కడ పాత్ సరిగ్గా చూడు
import { getUserAccounts } from "../actions/account-actions"; 

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] p-12">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-black italic uppercase">Overview</h1>
        <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">Welcome back, Commander</p>
      </header>
      <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
        <p className="text-slate-400 text-sm italic font-medium">Select a platform to start broadcasting content.</p>
      </div>
    </div>
  );
}