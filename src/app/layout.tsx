import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PostJet - 17+ Platforms, One Dashboard",
  description: "Automate your social media presence with AI",
  verification: {
    google: "ipW75CHMsTe_ZsAwdXlqqB5DhlL39nzINgFnMipob-8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent"
            >
              PostJet
            </Link>
            <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
              <Link href="/dashboard" className="hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/billing" className="hover:text-white transition">
                Pricing
              </Link>
              <Link
                href="/billing"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </nav>

        <main className="min-h-screen">{children}</main>

        <Footer />
      </body>
    </html>
  );
}