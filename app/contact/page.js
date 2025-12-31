import Link from "next/link";

export const metadata = { title: "Contact Us | Sociials Blog" };

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] p-4 md:p-8 font-sans text-black flex items-center justify-center">
      {/* --- BENTO GRID CONTAINER --- */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* 1. HERO / TITLE BLOCK (Full Width) */}
        <div className="md:col-span-12 bg-[#A259FF] border-2 border-black rounded-[30px] p-8 md:p-16 text-center shadow-[8px_8px_0px_#000] relative overflow-hidden text-white">
          {/* Abstract Decoration */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 text-9xl opacity-10 rotate-12 pointer-events-none select-none">
            💬
          </div>

          <h1 className="relative z-10 unbounded-900 text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Let's <span className="text-black bg-white px-2">Talk.</span>
          </h1>
          <p className="relative z-10 mt-6 text-xl md:text-2xl font-bold text-white/90 max-w-2xl mx-auto">
            Questions, feedback, or just want to say hello? <br />
            We are always listening.
          </p>
        </div>

        {/* 2. MAIN EMAIL BLOCK (Left, Larger) */}
        <a
          href="mailto:contact@sociials.com"
          className="md:col-span-7 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#000] group relative overflow-hidden hover:-translate-y-1 hover:shadow-[8px_8px_0px_#A259FF] transition-all cursor-pointer flex flex-col justify-center min-h-[300px]"
        >
          <div className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full border border-black group-hover:bg-[#A259FF] group-hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </div>

          <div>
            <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
              Primary Contact
            </span>
            <h2 className="unbounded-900 text-3xl md:text-5xl mt-2 break-all group-hover:text-[#A259FF] transition-colors">
              contact@
              <br />
              sociials.com
            </h2>
            <p className="mt-4 font-bold text-gray-600 text-lg">
              We usually respond within 24 hours.
            </p>
          </div>
        </a>

        {/* 3. SUPPORT & SOCIALS (Right Column) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          {/* Top: Support Card */}
          <div className="flex-1 bg-black border-2 border-black rounded-[30px] p-8 text-white shadow-[8px_8px_0px_#A259FF] flex flex-col justify-center">
            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-2xl border border-white mb-4">
              🛠️
            </div>
            <h3 className="text-2xl font-bold mb-1">Need Technical Help?</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              If you are facing issues with your <strong>Sociials.com</strong>{" "}
              page, please include your username in the subject line.
            </p>
          </div>

          {/* Bottom: Social Links */}
          <div className="flex-1 bg-[#F3F2EC] border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#000] flex flex-col justify-center border-dashed">
            <span className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">
              Find us elsewhere
            </span>
            <div className="flex gap-3">
              <SocialButton icon="TW" href="#" />
              <SocialButton icon="IG" href="#" />
              <SocialButton icon="GH" href="#" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini Component for Social Buttons
function SocialButton({ icon, href }) {
  return (
    <a
      href={href}
      className="w-12 h-12 flex items-center justify-center bg-white border-2 border-black rounded-xl font-black text-sm hover:bg-[#A259FF] hover:text-white hover:-translate-y-1 transition-all shadow-[2px_2px_0px_#000]"
    >
      {icon}
    </a>
  );
}
