import Link from "next/link";

export default function Footer() {
  const linkClass =
    "block w-fit text-lg font-bold text-gray-800 hover:text-[#A259FF] hover:translate-x-1 transition-all duration-200";

  return (
    // 1. Full width container with a thick top border
    <footer className="w-full bg-white border-t-[3px] border-black mt-auto font-sans">
      {/* 2. The Grid Layout (Divided by black lines) */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* === SECTION 1: BRANDING (Takes up 5 columns) === */}
        {/* 'lg:border-r-[3px]' adds the vertical divider line */}
        <div className="lg:col-span-5 p-8 lg:p-12 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black flex flex-col justify-between h-full bg-[#A259FF]/5 relative overflow-hidden">
          {/* Background Texture (Dots) */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10">
            <h2 className="unbounded-900 text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4">
              Sociials
              <br />
              <span className="text-transparent stroke-text">Blog</span>.
            </h2>
            <p className="font-medium text-black max-w-sm mt-4">
              The chaotic, unfiltered, and pixelated diary of a developer
              building in public.
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Connect
            </p>
            <div className="flex gap-4">
              <SocialIcon label="TW" />
              <SocialIcon label="GH" />
              <SocialIcon label="IN" />
              <SocialIcon label="YT" />
            </div>
          </div>
        </div>

        {/* === SECTION 2: NAVIGATION (Takes up 3 columns) === */}
        <div className="lg:col-span-3 p-8 lg:p-12 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black">
          <h3 className="font-black text-xl mb-6 uppercase flex items-center gap-2">
            <span className="w-3 h-3 bg-[#A259FF] border border-black block"></span>
            Explore
          </h3>
          <ul className="space-y-4">
            <li>
              <Link href="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass}>
                About Creator
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="/rss.xml" className={linkClass}>
                RSS Feed
              </Link>
            </li>
            <li>
              <Link href="/admin" className={`${linkClass} text-gray-400`}>
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        {/* === SECTION 3: LEGAL / NEWSLETTER (Takes up 4 columns) === */}
        <div className="lg:col-span-4 p-8 lg:p-12 bg-gray-50">
          <h3 className="font-black text-xl mb-6 uppercase flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 border border-black block"></span>
            Legal Stuff
          </h3>
          <ul className="space-y-4 mb-8">
            <li>
              <Link href="/privacy-policy" className={linkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkClass}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/disclaimer" className={linkClass}>
                Disclaimer
              </Link>
            </li>
          </ul>

          {/* Newsletter Box */}
          <div className="mt-auto bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000]">
            <p className="text-xs font-bold mb-2">STAY UPDATED</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email..."
                className="w-full bg-gray-100 border border-black p-2 text-sm focus:outline-none"
              />
              <button className="bg-[#A259FF] text-white font-bold px-3 py-1 border border-black hover:bg-black transition-colors">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === BOTTOM BAR === */}
      <div className="border-t-[3px] border-black bg-black text-white p-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono font-bold">
          <p>COPYRIGHT © {new Date().getFullYear()} SOCIIALS.</p>
          <p></p>
        </div>
      </div>
    </footer>
  );
}

// Mini Component for Social Buttons
function SocialIcon({ label }) {
  return (
    <a
      href="#"
      className="w-10 h-10 flex items-center justify-center border-2 border-black font-black hover:bg-[#A259FF] hover:text-white hover:-translate-y-1 hover:shadow-[3px_3px_0px_#000] transition-all bg-white"
    >
      {label}
    </a>
  );
}
