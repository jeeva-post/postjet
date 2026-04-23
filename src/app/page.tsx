"use client";
import React from "react";
import { motion } from "framer-motion";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { CheckCircle2, Eye, Mail, Lock } from "lucide-react";

export default function LandingPage() {
  // రియల్ యాప్ లోగోలు (CDN లింక్స్)
  const apps = [
    { name: "Facebook", img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" },
    { name: "Instagram", img: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
    { name: "YouTube", img: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" },
    { name: "TikTok", img: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" },
    { name: "Pinterest", img: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png" },
    { name: "X", img: "https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png" },
    { name: "Reddit", img: "https://upload.wikimedia.org/wikipedia/en/b/bd/Reddit_Logo_Icon.svg" },
    { name: "Snapchat", img: "https://upload.wikimedia.org/wikipedia/en/a/ad/Snapchat_logo.svg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 blur-[120px] rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 blur-[120px] rounded-full -ml-20 -mb-20" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT SIDE: Text Content */}
        <div className="lg:col-span-4 space-y-10">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              Simplify Your <br /> 
              <span className="text-blue-600">Social Postings.</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-widest pt-4">
              Manage all your accounts in one place
            </p>
          </div>

          <div className="space-y-5">
            {[
              "Plan weeks in advance", 
              "Auto-publish content on schedule", 
              "View full cross-platform analytics", 
              "Draft posts with smart tools"
            ].map((text) => (
              <div key={text} className="flex items-center gap-4 text-slate-800 font-bold text-lg group">
                <CheckCircle2 className="text-green-500 w-7 h-7 group-hover:scale-110 transition-transform" fill="currentColor" fillOpacity={0.2}/>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER SIDE: Auth Form Card */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="bg-white p-10 md:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border-4 border-white w-full max-w-md">
            <div className="text-center mb-10">
               <img src="/logo.png" alt="PostJet Logo" className="w-20 mx-auto mb-4" />
               <h2 className="text-3xl font-black uppercase tracking-tighter">
                 <span className="text-slate-900">Post</span>
                 <span className="text-blue-600 italic">Jet</span>
               </h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Multi-Platform Scheduler</p>
            </div>
            
            <div className="space-y-5 mb-8">
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5"/>
                <input type="email" placeholder="your.name@email.com" className="w-full bg-slate-50 p-5 pl-14 rounded-2xl border border-slate-100 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5"/>
                <input type="password" placeholder="Password" className="w-full bg-slate-50 p-5 pl-14 rounded-2xl border border-slate-100 font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"/>
                <Eye className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 cursor-pointer hover:text-blue-500"/>
              </div>
              <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-400 px-2">
                <label className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-100"/>
                  <span>Keep me logged in</span>
                </label>
                <a href="#" className="hover:text-blue-600">Forgot Password?</a>
              </div>
            </div>

            <LoginLink className="block w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-center uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100">
              Sign In
            </LoginLink>
            <div className="text-center mt-6">
                <p className="text-slate-400 font-bold text-xs">
                  Don't have an account? <RegisterLink className="text-blue-600 hover:underline">Sign Up</RegisterLink>
                </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Non-stop Orbiting Animation */}
        <div className="lg:col-span-4 relative flex items-center justify-center h-[500px]">
          {/* Dashed Orbits */}
          <div className="absolute w-[300px] h-[300px] border-2 border-dashed border-blue-200 rounded-full" />
          <div className="absolute w-[450px] h-[450px] border-2 border-dashed border-blue-200 rounded-full" />
          
          {/* Central Rocket Logo */}
          <div className="relative z-10 w-44 h-44 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center p-6 border-4 border-blue-50 animate-pulse">
            <img src="/logo.png" alt="Rocket" className="w-full h-full object-contain" />
          </div>
          
          {/* Continuous Rotation Container */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            {apps.map((app, index) => {
              const angle = (index / apps.length) * (2 * Math.PI);
              const radius = 210; // ఆర్బిట్ దూరం
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={app.name}
                  className="absolute"
                  style={{ 
                    left: `calc(50% + ${x}px - 28px)`, 
                    top: `calc(50% + ${y}px - 28px)` 
                  }}
                >
                  {/* Counter-rotation to keep icons upright */}
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center p-3 border border-slate-50 hover:scale-125 transition-transform"
                  >
                    <img src={app.img} alt={app.name} className="w-full h-full object-contain" />
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </div>
  );
}