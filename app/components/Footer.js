import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto font-sans pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
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

            <div className="flex gap-4">
              <SocialLink
                href="https://discord.gg/SNJfYQqwxa"
                label="Discord"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.249-.192.367-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.118.1.241.198.367.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.04.107c.36.698.771 1.363 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .031-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.21 0 2.166 1.094 2.157 2.418 0 1.333-.955 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.21 0 2.166 1.094 2.157 2.418 0 1.333-.947 2.418-2.157 2.418Z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://www.instagram.com/besociials/"
                label="Instagram"
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                }
              />
            </div>
          </div>

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
                  Main App {"->"}
                </Link>
              </li>
            </ul>
          </div>

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

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium uppercase tracking-wide">
          <p>(c) {new Date().getFullYear()} Sociials. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold hover:bg-black hover:text-white transition-all"
    >
      {icon}
    </a>
  );
}
