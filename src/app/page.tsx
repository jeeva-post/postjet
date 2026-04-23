"use client";
import React from "react";
import { motion } from "framer-motion";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  // తిరగాల్సిన యాప్ ఐకాన్లు (వీటిని నీకు నచ్చినట్టు మార్చుకోవచ్చు)
  const apps = [
    { name: "Telegram", color: "#0088cc", icon: "T" },
    { name: "Instagram", color: "#E1306C", icon: "I" },
    { name: "YouTube", color: "#FF0000", icon: "Y" },
    { name: "Pinterest", color: "#BD081C", icon: "P" },
    { name: "Snapchat", color: "#FFFC00", icon: "S" },
    { name: "Reddit", color: "#FF4500", icon: "R" },
  ];

  return (
    <div className="min-h-screen bg-[#E0F2FE] flex items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: Content & Form */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Simplify Your <br /> 
              <span className="text-blue-600 italic">Social Postings.</span>
            </h1>
            <p className="text-slate-500 font-bold text-lg uppercase tracking-widest">
              Manage all your accounts in one place
            </p>
          </div>

          <div className="space-y-4">
            {["Plan weeks in advance", "Auto-publish on schedule", "Cross-platform analytics", "Smart drafting tools"].map((text) => (
              <div key={text} className="flex items-center gap-3 text-slate-700 font-bold">
                <CheckCircle2 className="text-green-500 w-6 h-6" fill="currentColor" fillOpacity={0.2} />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* AUTH BOX */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-white max-w-md">
            <div className="text-center mb-8">
               <img src="/logo.jpg" alt="PostJet" className="w-20 mx-auto mb-4" />
               <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">PostJet</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multi-Platform Scheduler</p>
            </div>
            
            <div className="space-y-4">
              <LoginLink className="block w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-center uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                Sign In
              </LoginLink>
              <div className="text-center">
                <p className="text-slate-400 font-bold text-xs">
                  Don't have an account? <RegisterLink className="text-blue-600">Sign Up</RegisterLink>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Rocket Orbit Animation */}
        <div className="relative flex items-center justify-center h-[500px]">
          {/* Central Logo (The Rocket) */}
          <div className="relative z-10 w-48 h-48 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center p-4 border-4 border-blue-50">
            <img src="/logo.jpg" alt="Rocket Logo" className="w-full h-full object-contain" />
          </div>

          {/* Orbit Circles */}
          <div className="absolute w-[400px] h-[400px] border-2 border-dashed border-blue-200 rounded-full animate-[spin_20s_linear_infinite]" />
          
          {/* Orbiting App Icons */}
          {apps.map((app, index) => {
            const angle = (index / apps.length) * (2 * Math.PI);
            const radius = 200; // Orbit దూరం
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={app.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x, y }}
                transition={{ delay: index * 0.1 }}
                className="absolute w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100 group cursor-pointer"
                style={{ left: `calc(50% - 28px)`, top: `calc(50% - 28px)` }}
              >
                <div 
                   className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-inner"
                   style={{ backgroundColor: app.color }}
                >
                  {app.icon}
                </div>
                {/* Tooltip */}
                <span className="absolute -top-8 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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