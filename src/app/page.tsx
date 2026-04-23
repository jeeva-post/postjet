"use client";
import React from "react";
import { motion } from "framer-motion";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { CheckCircle2, Eye, Mail, Lock } from "lucide-react";

export default function LandingPage() {
  // రాకెట్ చుట్టూ తిరగాల్సిన సోషల్ మీడియా యాప్స్ (official logos)
  const apps = [
    { name: "Facebook", color: "#1877F2", icon: "F" },
    { name: "YouTube", color: "#FF0000", icon: "Y" },
    { name: "TikTok", color: "#000000", icon: "T" },
    { name: "Pinterest", color: "#BD081C", icon: "P" },
    { name: "Instagram", color: "#E1306C", icon: "I" },
    { name: "Gmail", color: "#EA4335", icon: "G" },
    { name: "Discord", color: "#5865F2", icon: "D" },
    { name: "WordPress", color: "#21759B", icon: "W" },
    // నీ ఇమేజ్ లో ఉన్న మరికొన్ని యాప్స్ (సాంపుల్ గా)
    { name: "X (Twitter)", color: "#000000", icon: "X" }, 
    { name: "LinkedIn", color: "#0077B5", icon: "L" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden">
      
      {/* Small Bottom-Left Logo */}
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 border-2 border-blue-100 z-50">
        <span className="font-black text-2xl italic text-blue-600">N</span>
      </div>

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-12 items-center relative">
        
        {/* LEFT SIDE: Content & Feature List */}
        <div className="space-y-10 lg:col-span-1">
          <div className="space-y-4">
            <h1 className="text-7xl font-black text-slate-950 tracking-tighter leading-none">
              Simplify Your <br /> 
              <span className="text-blue-600 italic">Social Postings.</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-widest pt-2">
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
              <div key={text} className="flex items-center gap-4 text-slate-800 font-bold text-lg">
                <CheckCircle2 className="text-green-500 w-7 h-7" fill="currentColor" fillOpacity={0.2} strokeWidth={2.5}/>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER SIDE: The White Form Card */}
        <div className="lg:col-span-1 flex justify-center">
          <form className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-white max-w-md w-full relative z-20">
            {/* Form Header with Central Logo */}
            <div className="text-center mb-10 flex flex-col items-center">
               <img src="/logo.jpg" alt="PostJet Rocket" className="w-24 mx-auto mb-6" />
               <h2 className="text-3xl font-black uppercase tracking-tighter">
                 <span className="text-blue-600">Post</span>
                 <span className="text-orange-500 italic">Jet</span>
               </h2>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest pt-1">Multi-Platform Scheduler</p>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-6 mb-10">
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                <input type="email" placeholder="your.name@email.com" className="w-full bg-slate-50 p-6 pl-16 rounded-2xl border-none font-bold text-slate-800 focus:ring-4 focus:ring-blue-100 mb-2"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5"/>
                <input type="password" placeholder="Password" className="w-full bg-slate-50 p-6 pl-16 rounded-2xl border-none font-bold text-slate-800 focus:ring-4 focus:ring-blue-100"/>
                <Eye className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 cursor-pointer"/>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"/>
                  <span>Keep me logged in</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700">Forgot Password?</a>
              </div>
            </div>

            <div className="space-y-5 text-center">
              <LoginLink className="block w-full bg-slate-950 text-white py-6 rounded-[1.5rem] font-black text-center uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                Sign In
              </LoginLink>
              <p className="text-slate-400 font-bold text-xs pt-2">
                  Don't have an account? <RegisterLink className="text-blue-600">Sign Up</RegisterLink>
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: The Main Rocket Orbit Animation */}
        <div className="lg:col-span-1 relative flex items-center justify-center h-[600px] z-10 lg:-ml-16">
          {/* Static Orbit Paths (Concentric dashed circles) */}
          <div className="absolute w-[450px] h-[450px] border-2 border-dashed border-blue-300 rounded-full" />
          <div className="absolute w-[250px] h-[250px] border-2 border-dashed border-blue-300 rounded-full" />
          
          {/* Central Logo (The Rocket) */}
          <div className="relative z-10 w-56 h-56 bg-white rounded-[3.5rem] shadow-2xl flex items-center justify-center p-6 border-4 border-blue-50">
            <img src="/logo.jpg" alt="Rocket Logo" className="w-full h-full object-contain" />
          </div>
          
          {/* Orbiting App Icons (Continuous Rotation) */}
          {apps.map((app, index) => {
            const angle = (index / apps.length) * (2 * Math.PI);
            const radius = 225; // Orbit దూరం
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={app.name}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1, 
                  x, 
                  y,
                  rotate: -360 // యాప్స్ తమంతట తాము తిరగకుండా ఉండటానికి, మొత్తం ఆరోహణం (360) కి ఎదురుగా (-360) యానిమేట్ చేస్తున్నాం
                }}
                transition={{ 
                   opacity: { delay: index * 0.1 },
                   rotate: { repeat: Infinity, duration: 20, ease: "linear" }, // ఇది యాప్ ని ఎప్పుడూ ఒకే వైపు చూసేలా చేస్తుంది
                   x: { repeat: Infinity, duration: 20, ease: "linear" }, // ఇది యాప్ ని రాకెట్ చుట్టూ తిప్పుతుంది
                   y: { repeat: Infinity, duration: 20, ease: "linear" }  // ఇది యాప్ ని రాకెట్ చుట్టూ తిప్పుతుంది
                }}
                className="absolute w-16 h-16 bg-white rounded-[1.25rem] shadow-xl flex items-center justify-center border border-slate-100 group cursor-pointer"
                style={{ left: `calc(50% - 32px)`, top: `calc(50% - 32px)` }}
              >
                <div 
                   className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-inner"
                   style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                </div>
                {/* Tooltip on Hover */}
                <span className="absolute -top-10 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap tracking-widest">
                  {app.name}
                </span>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}