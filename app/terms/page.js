import Link from "next/link";

export const metadata = { title: "Terms & Conditions | Sociials Blog" };

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] p-4 md:p-8 font-sans text-black flex items-center justify-center">
      {/* --- BENTO GRID CONTAINER --- */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* 1. HERO TITLE BLOCK (Full Width) */}
        <div className="md:col-span-12 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 text-center shadow-[8px_8px_0px_#000] relative overflow-hidden">
          {/* Abstract Decoration */}
          <div className="absolute top-0 right-0 w-full h-4 bg-black"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#A259FF] rounded-full blur-3xl opacity-30"></div>

          <h1 className="relative z-10 unbounded-900 text-4xl md:text-7xl font-black uppercase tracking-tighter">
            Terms of{" "}
            <span className="text-[#A259FF] underline decoration-4 underline-offset-4">
              Service
            </span>
            .
          </h1>
          <p className="relative z-10 mt-6 text-xl font-bold text-gray-600 max-w-2xl mx-auto">
            The rules of the road. By using Sociials Blog, you agree to play by
            these rules.
            <br />
            <span className="text-xs font-mono text-gray-400 mt-2 block">
              Effective Date: {new Date().toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* 2. ACCEPTANCE (Left, Large) */}
        <div className="md:col-span-7 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#000] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-black text-white px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#A259FF]">
              01. Agreement
            </span>
            <h2 className="font-black text-2xl uppercase">
              Acceptance of Terms
            </h2>
          </div>
          <p className="font-medium text-gray-700 leading-relaxed text-lg">
            By accessing <strong>Sociials Blog</strong> (the "Site"), you agree
            to be bound by these Terms and Conditions, all applicable laws, and
            regulations. If you do not agree with any of these terms, you are
            prohibited from using or accessing this site.
          </p>
          <div className="mt-6 p-4 bg-[#F3F2EC] border-l-4 border-[#A259FF] text-sm font-bold text-gray-600">
            Put simply: If you use the site, you agree to the rules. If not,
            please close this tab.
          </div>
        </div>

        {/* 3. INTELLECTUAL PROPERTY (Right, Visual) */}
        <div className="md:col-span-5 bg-white border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#000] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 rotate-12 select-none">
            ©
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-white text-black px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
                02. Copyright
              </span>
              <h2 className="font-black text-2xl uppercase">Use License</h2>
            </div>
            <p className="font-medium text-gray-700 leading-relaxed">
              Permission is granted to temporarily download one copy of the
              materials for{" "}
              <strong>personal, non-commercial transitory viewing only</strong>.
            </p>
          </div>
          <ul className="mt-6 space-y-2 font-bold text-sm text-gray-500">
            <li className="flex items-center gap-2">
              ❌ Do not modify or copy materials
            </li>
            <li className="flex items-center gap-2">
              ❌ Do not use for commercial purposes
            </li>
            <li className="flex items-center gap-2">
              ❌ Do not remove copyright notations
            </li>
          </ul>
        </div>

        {/* 4. PROHIBITED ACTS (Full Width, Dark Mode / Error Style) */}
        <div className="md:col-span-12 bg-[#111] border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#A259FF] text-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="font-black text-3xl text-red-500 mb-2 font-mono">
                &lt;Prohibited_Actions /&gt;
              </h2>
              <p className="text-gray-400 font-mono text-sm mb-6">
                Engaging in the following will result in immediate termination
                of access:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="bg-white/5 p-3 rounded border border-white/10 text-sm font-bold hover:bg-red-500/10 hover:border-red-500 transition-colors">
                  🚫 Attempting to decompile or reverse engineer any software on
                  the Site.
                </li>
                <li className="bg-white/5 p-3 rounded border border-white/10 text-sm font-bold hover:bg-red-500/10 hover:border-red-500 transition-colors">
                  🚫 Using the Site for any unlawful purpose or to solicit
                  others to perform illegal acts.
                </li>
                <li className="bg-white/5 p-3 rounded border border-white/10 text-sm font-bold hover:bg-red-500/10 hover:border-red-500 transition-colors">
                  🚫 Harassing, abusing, insulting, harming, or discriminating
                  based on gender, religion, or race.
                </li>
                <li className="bg-white/5 p-3 rounded border border-white/10 text-sm font-bold hover:bg-red-500/10 hover:border-red-500 transition-colors">
                  🚫 Spamming, phishing, or scraping data (automated data
                  collection).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. DISCLAIMERS (Left) */}
        <div className="md:col-span-6 bg-yellow-50 border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#000]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
              04. Liability
            </span>
            <h2 className="font-black text-2xl uppercase">Disclaimer</h2>
          </div>
          <p className="font-medium text-gray-800 leading-relaxed">
            The materials on Sociials Blog are provided "as is". We make no
            warranties, expressed or implied.
          </p>
          <p className="mt-4 font-medium text-gray-800 leading-relaxed">
            In no event shall Sociials Blog or its suppliers be liable for any
            damages (including loss of data or profit) arising out of the use or
            inability to use the materials on the Site.
          </p>
        </div>

        {/* 6. GOVERNING LAW (Right) */}
        <div className="md:col-span-6 bg-white border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#A259FF] text-white px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
                05. Resolution
              </span>
              <h2 className="font-black text-2xl uppercase">
                Resolving Concerns
              </h2>
            </div>
            <p className="font-medium text-gray-700 leading-relaxed">
              We believe most issues can be resolved quickly and fairly through
              open communication. If you have any questions, concerns, or
              disputes related to these terms, we kindly ask that you reach out
              to us first so we can work together toward a solution.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300">
            <p className="text-xs font-bold text-gray-400 uppercase mb-2">
              Need help or clarification?
            </p>
            <Link
              href="/contact"
              className="text-black font-black text-lg hover:text-[#A259FF] hover:underline"
            >
              Email our support team →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
