"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Ikkada logic: Dashboard pages lo unnapudu aa patha navbar ni poorthiga hide chesthunnam
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Ikkada Dashboard kaani pages lo matrame Navbar kanipisthundi */}
        {!isDashboard && (
          <nav className="flex items-center justify-between p-6 bg-[#020617] border-b border-white/5 sticky top-0 z-[100]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-black text-xl">
                P
              </div>
              <span className="text-xl font-bold text-white tracking-tighter italic">
                PostJet
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                Login
              </button>
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-cyan-500/20">
                Get Started Free
              </button>
            </div>
          </nav>
        )}

        {/* Children (Dashboard content) ikkada render avthundi */}
        <main>{children}</main>
      </body>
    </html>
  );
}