import Link from "next/link";

export const metadata = { title: "Privacy Policy | Sociials Blog" };

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] p-4 md:p-8 font-sans text-black flex items-center justify-center">
      {/* --- BENTO GRID CONTAINER --- */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* 1. HERO TITLE BLOCK (Full Width) */}
        <div className="md:col-span-12 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 text-center shadow-[8px_8px_0px_#000] relative overflow-hidden">
          {/* Abstract Decoration */}
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#A259FF] rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute right-10 bottom-10 w-20 h-20 bg-black rounded-full opacity-5"></div>

          <h1 className="relative z-10 unbounded-900 text-4xl md:text-7xl font-black uppercase tracking-tighter">
            Privacy{" "}
            <span
              className="text-transparent stroke-text"
              style={{ WebkitTextStroke: "2px #A259FF" }}
            >
              Policy
            </span>
            .
          </h1>
          <p className="relative z-10 mt-4 text-xl font-bold text-gray-600 max-w-2xl mx-auto">
            Your data. Your rights. Plain English. <br />
            <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full mt-2 inline-block border border-gray-300">
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* 2. INTRO BLOCK (Left, Large) */}
        <div className="md:col-span-7 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#000] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-black text-white px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#A259FF]">
              01. The Basics
            </span>
            <h2 className="font-black text-2xl uppercase">Introduction</h2>
          </div>
          <p className="font-medium text-gray-700 leading-relaxed text-lg">
            We at <strong>Sociials Blog</strong> respect your privacy. This
            policy isn't just legal jargon—it's our promise to protect your
            information. We only collect what is necessary to improve your
            experience and keep the site running smoothly.
          </p>
        </div>

        {/* 3. TERMINAL BLOCK: LOGS (Right, Tech Style) */}
        <div className="md:col-span-5 bg-[#1a1a1a] border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#A259FF] font-mono text-sm relative overflow-hidden flex flex-col justify-center group">
          {/* Window Controls */}
          <div className="flex gap-2 mb-4 absolute top-6 left-6">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          <div className="mt-8 text-gray-300 space-y-2">
            <p>
              <span className="text-[#A259FF]">➜</span>{" "}
              <span className="text-green-400">~/logs</span> cat server_logs.txt
            </p>
            <p className="opacity-80">
              [INFO] IP_Address: Collected <br />
              [INFO] Browser_Type: User_Agent <br />
              [INFO] Time_Stamp: {new Date().toLocaleTimeString()} <br />
              [INFO] ISP: Recorded
            </p>
            <p className="text-gray-500 italic mt-2">
              // We use standard log files for analytics, just like every other
              hosting service.
            </p>
          </div>
        </div>

        {/* 4. COOKIES & ADSENSE (Left, Warning/Info) */}
        <div className="md:col-span-6 bg-[#A259FF] border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#000] text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="relative z-10">
            <h2 className="unbounded-900 text-3xl font-black uppercase leading-none mb-4">
              Google Ads & <br />
              Cookies
            </h2>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-sm font-medium leading-relaxed">
              <p className="mb-3">
                Google (a third-party vendor) uses <strong>DART cookies</strong>{" "}
                to serve ads based on your visits to this site and others on the
                internet.
              </p>
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                className="inline-block bg-white text-black px-4 py-2 rounded-lg font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors"
              >
                Opt Out of DART Cookies ↗
              </a>
            </div>
          </div>
        </div>

        {/* 5. CONSENT (Right, Simple) */}
        <div className="md:col-span-6 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-white text-black px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
                04. Agreement
              </span>
              <h2 className="font-black text-2xl uppercase">Your Consent</h2>
            </div>
            <p className="font-medium text-gray-700 leading-relaxed text-lg">
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms. If we update this policy, those changes will
              be posted here.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all"
            >
              Go Home
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-gray-100 text-black rounded-xl font-bold border-2 border-black hover:bg-[#A259FF] hover:border-black hover:text-white transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
