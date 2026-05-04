"use client";

import React from 'react';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Post Scheduler</h2>
        <p className="text-slate-500 mt-1">Pick a date and time to blast your content across all 15+ platforms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CALENDAR VIEW (Simplified for now) */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2 italic">
              <CalendarIcon className="text-cyan-500" size={20} /> May 2026
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-sm">Today</button>
            </div>
          </div>
          
          {/* Simple Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className="aspect-square flex items-center justify-center bg-black/20 border border-white/5 rounded-xl hover:border-cyan-500/50 cursor-pointer transition-all text-sm text-slate-400">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* TIME & QUEUE */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="text-cyan-400" size={18} /> Select Time
            </h3>
            <input type="time" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:ring-1 focus:ring-cyan-500" />
            <button className="w-full mt-6 bg-cyan-500 text-black font-extrabold py-3 rounded-xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all">
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}