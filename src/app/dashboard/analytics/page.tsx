"use client";

import React from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, 
  ArrowUpRight, ArrowDownRight, Share2, 
  Instagram, Facebook, Linkedin, Youtube 
} from 'lucide-react';

const stats = [
  { label: 'Total Reach', value: '1.2M', growth: '+12.5%', trend: 'up' },
  { label: 'Engagement', value: '85.4K', growth: '+5.2%', trend: 'up' },
  { label: 'New Followers', value: '12,302', growth: '-2.1%', trend: 'down' },
  { label: 'Total Posts', value: '458', growth: '+18', trend: 'up' },
];

const topPlatforms = [
  { name: 'Instagram', reach: '450K', engagement: '8.2%', icon: <Instagram size={18} className="text-pink-500" /> },
  { name: 'YouTube', reach: '380K', engagement: '12.5%', icon: <Youtube size={18} className="text-red-500" /> },
  { name: 'LinkedIn', reach: '210K', engagement: '5.1%', icon: <Linkedin size={18} className="text-blue-500" /> },
  { name: 'Facebook', reach: '160K', engagement: '3.4%', icon: <Facebook size={18} className="text-blue-600" /> },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Performance Analytics</h2>
        <p className="text-slate-500 mt-1">Real-time data across all your connected 15+ platforms.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <span className={`flex items-center text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.growth}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CHART PLACEHOLDER */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-cyan-500" size={20} /> Audience Growth
            </h3>
            <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-xs text-slate-400 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          
          {/* Visual Graph Representation (CSS Based) */}
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75, 40, 85].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  style={{ height: `${h}%` }} 
                  className="bg-cyan-500/20 group-hover:bg-cyan-500/50 rounded-t-lg transition-all duration-500"
                ></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}k
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-4 pt-4 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        {/* TOP PLATFORMS LIST */}
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Share2 className="text-cyan-500" size={20} /> Best Platforms
          </h3>
          <div className="space-y-6">
            {topPlatforms.map((platform, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl">{platform.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{platform.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{platform.reach} Reach</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-cyan-400">{platform.engagement}</p>
                  <p className="text-[9px] text-slate-600 uppercase">Eng.</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 rounded-2xl text-xs font-bold text-slate-400 hover:text-cyan-400 transition-all">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}