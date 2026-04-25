"use client";
import React from "react";
// ఇక్కడ కేవలం ఒకటే '../' ఉండాలి, ఎందుకంటే dashboard ఫోల్డర్ app లోనే ఉంది
import { getUserAccounts } from "../actions/account-actions"; 

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] p-8 md:p-16">
      <header className="mb-10">
        <h1 className="text-5xl font-black text-black italic uppercase tracking-tighter">Overview</h1>
        <p className="text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-[0.3em]">Welcome back, Commander Jeevan</p>
      </header>

      <div className="bg-white border border-slate-100 p-12 rounded-[3rem] shadow-sm flex items-center justify-center min-h-[300px]">
        <p className="text-slate-400 text-sm font-medium italic">
          Select a platform to start broadcasting content.
        </p>
      </div>
    </div>
  );
}