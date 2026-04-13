// import "./globals.css";
// మనం @/ బదులు నేరుగా అడ్రస్ ఇస్తున్నాం (ఇది 100% పనిచేస్తుంది)
import { Providers } from "../components/Providers"; 

export const metadata = {
  title: "PostJet - Social Media Manager",
  description: "Manage your social media with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}