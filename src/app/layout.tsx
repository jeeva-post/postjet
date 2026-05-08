import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 👈 Idhi unte ne dashboard ki design vasthundi
import { supabase } from '../utils/supabase'; // 👈 Idhi mee database connection

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PostJet - One Dashboard. Every Network.",
  description: "Manage 15+ social platforms from a single command center.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0F1C] antialiased`}>
        {children}
      </body>
    </html>
  );
}