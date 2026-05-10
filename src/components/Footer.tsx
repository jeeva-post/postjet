import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-white font-bold text-xl italic uppercase tracking-tighter">
            PostJet<span className="text-indigo-500">.</span>
          </div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            © 2026 All Rights Reserved
          </p>
        </div>

        <div className="flex gap-8 items-center">
          <a href="/terms" className="text-slate-400 hover:text-white text-xs uppercase font-bold tracking-widest transition-colors">
            Terms
          </a>
          <a href="/privacy" className="text-slate-400 hover:text-white text-xs uppercase font-bold tracking-widest transition-colors">
            Privacy
          </a>
          <a href="mailto:support@postjet.vercel.app" className="text-slate-400 hover:text-white text-xs uppercase font-bold tracking-widest transition-colors">
            Support
          </a>
        </div>

        <div className="text-slate-600 text-[10px] uppercase tracking-tighter text-center md:text-right font-bold">
          Merchant of Record: <br/> 
          <span className="text-indigo-400">Paddle</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;