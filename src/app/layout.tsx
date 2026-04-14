import "./globals.css";
import { NextAuthProvider } from "./providers";

export const metadata = {
  title: "PostJet - Global Social Media Manager",
  description: "Automate your social presence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}