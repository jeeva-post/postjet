import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-slate-50">
          <header className="flex justify-between items-center p-5 bg-white border-b sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-xl">
                 <img src="/logo.png" alt="PostJet" className="w-5 h-5 invert" />
              </div>
              <span className="font-black text-xl italic uppercase tracking-tighter">PostJet</span>
            </div>
            
            <div className="flex items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}