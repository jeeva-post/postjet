// @ts-ignore
import "./globals.css"; 
import { Providers } from "../components/Providers"; 

export const metadata = {
  title: "PostJet - Global Social Media Manager",
  description: "Automate your global social presence from one place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-[#f1f5f9]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}