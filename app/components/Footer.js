import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* 1. BRAND COLUMN (4 Cols) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div>
              <Link
                href="/"
                className="unbounded-900 text-2xl tracking-tight text-gray-900 hover:text-[#A259FF] transition-colors"
              >
                Sociials<span className="text-gray-300">.</span>Blog
              </Link>
              <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-sm">
                Engineering deep dives, product updates, and unfiltered stories
                from the team building the future of link-in-bio.
              </p>
            </div>

            {/* Socials - Clean & Simple */}
            <div className="flex gap-4">
              <SocialLink href="#" icon="TW" />
              <SocialLink href="#" icon="GH" />
              <SocialLink href="#" icon="IN" />
            </div>
          </div>

          {/* 2. LINKS COLUMN (2 Cols) */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  Topics
                </Link>
              </li>
              <li>
                <Link
                  href="https://sociials.com"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  Main App ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. LEGAL COLUMN (2 Cols) */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3 text-sm text-gray-500 font-medium">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#A259FF] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. NEWSLETTER COLUMN (4 Cols) */}
          <div className="md:col-span-4 bg-gray-50 rounded-2xl p-6">
            <h4 className="font-bold text-gray-900 mb-2">
              Subscribe to the feed
            </h4>
            <p className="text-gray-500 text-xs mb-4">
              Latest stories delivered to your inbox weekly. No spam.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#A259FF] transition-colors"
              />
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#A259FF] transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
          <p>© {new Date().getFullYear()} Sociials. All rights reserved.</p>
          <p>Designed & Built in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}

// Helper for Social Icons
function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold hover:bg-black hover:text-white transition-all"
    >
      {icon}
    </a>
  );
}
