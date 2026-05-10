import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent"
          >
            PostJet
          </Link>
          <p className="mt-4 text-zinc-500 text-sm leading-relaxed">
            Automate your social media presence across 17+ platforms. One
            dashboard, infinite reach.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-zinc-500 text-sm">
            <li>
              <Link href="/dashboard" className="hover:text-blue-500 transition">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/billing" className="hover:text-blue-500 transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-blue-500 transition">
                Features
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-zinc-500 text-sm">
            <li>
              <Link href="/docs" className="hover:text-blue-500 transition">
                Documentation
              </Link>
            </li>
            <li>
              <Link
                href="mailto:support@postjet.com"
                className="hover:text-blue-500 transition"
              >
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-zinc-500 text-sm">
            <li>
              <Link
                href="/refund"
                className="text-zinc-400 hover:text-blue-500 transition font-medium"
              >
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-blue-500 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-500 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-zinc-600 text-xs">
        <p>© {new Date().getFullYear()} PostJet AI. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <span>Made for Web Developers</span>
        </div>
      </div>
    </footer>
  );
}