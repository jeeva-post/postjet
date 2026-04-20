import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = await getUser();

  return (
    <html lang="en">
      <body className="bg-slate-50">
        <header className="flex justify-between items-center p-5 bg-white border-b sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <img src="/logo.png" alt="PostJet" className="w-5 h-5 invert" />
            </div>
            <span className="font-black text-xl italic uppercase text-slate-900">PostJet</span>
          </div>

          <div className="flex items-center gap-4">
            {!isUserAuthenticated ? (
              <LoginLink className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">
                Sign In
              </LoginLink>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase">{user?.given_name}</span>
                <LogoutLink className="text-[10px] font-black text-red-500 uppercase border border-red-100 px-3 py-1.5 rounded-lg">
                  Log out
                </LogoutLink>
              </div>
            )}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}