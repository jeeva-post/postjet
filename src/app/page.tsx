import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export default async function Home() {
  const { isAuthenticated } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-white px-6 relative overflow-hidden">
      
      {/* Background Pattern - ఇక్కడ 'size' ని 'backgroundSize' గా మార్చాను */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} />

      <div className="max-w-5xl text-center z-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-blue-100">
          <Zap size={14} fill="currentColor" /> Simple • Powerful • Fast
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 mb-8 uppercase italic">
          SINGLE CLICK TO POST<br />
          <span className="text-blue-600 not-italic">ALL SOCIAL MEDIA PLATFORMS</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          Stop manual posting. Connect your accounts once and blast your content everywhere with just one tap. The ultimate tool for modern creators.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          {!isUserAuthenticated ? (
            <>
              <RegisterLink className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 active:scale-95 w-full sm:w-auto justify-center">
                Get Started For Free <ArrowRight size={18} strokeWidth={3} />
              </RegisterLink>
              <LoginLink className="text-slate-900 font-black text-xs uppercase tracking-widest px-8 py-5 hover:bg-slate-50 rounded-2xl transition-all border border-slate-200">
                Sign In
              </LoginLink>
            </>
          ) : (
            <a href="/dashboard" className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-black transition-all shadow-2xl active:scale-95">
              Open My Dashboard <ArrowRight size={18} strokeWidth={3} />
            </a>
          )}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
           <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> No Credit Card Required</div>
           <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Unlimited Platforms</div>
           <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Lightning Fast</div>
        </div>
      </div>
    </div>
  );
}