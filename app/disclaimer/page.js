import Link from "next/link";

export const metadata = { title: "Disclaimer | Sociials Blog" };

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] p-4 md:p-8 font-sans text-black flex items-center justify-center">
      {/* --- BENTO GRID CONTAINER --- */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* 1. HERO TITLE BLOCK (Full Width) */}
        <div className="md:col-span-12 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 text-center shadow-[8px_8px_0px_#000] relative overflow-hidden">
          {/* Abstract Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#A259FF] rounded-bl-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-tr-full opacity-20"></div>

          <h1 className="relative z-10 unbounded-900 text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Legal <span className="text-[#A259FF]">Brief</span>.
          </h1>
          <p className="relative z-10 mt-4 text-xl font-bold text-gray-600 max-w-2xl mx-auto">
            The fine print. Please read this carefully before copy-pasting code
            into production.
          </p>
        </div>

        {/* 2. GENERAL LIABILITY (Left, Large) */}
        <div className="md:col-span-7 bg-white border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#000] flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#A259FF] text-white px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
              01. General
            </span>
            <h2 className="font-black text-2xl uppercase">No Warranties</h2>
          </div>
          <p className="font-medium text-gray-700 leading-relaxed text-lg">
            The information provided on <strong>Sociials Blog</strong> is for
            general informational purposes only. All information is provided in
            good faith, however, we make no representation or warranty of any
            kind regarding the accuracy, adequacy, validity, reliability, or
            completeness of any information on the Site.
          </p>
          <p className="mt-4 font-bold border-t-2 border-gray-100 pt-4 text-sm text-gray-500">
            Basically: Use your own judgment. We are not liable for any losses.
          </p>
        </div>

        {/* 3. EXTERNAL LINKS WARNING (Right, Warning Color) */}
        <div className="md:col-span-5 bg-yellow-50 border-2 border-black rounded-[30px] p-8 md:p-12 shadow-[8px_8px_0px_#000] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-8xl opacity-10 rotate-12 select-none">
            🔗
          </div>

          <div className="flex items-center gap-3 mb-4 relative z-10">
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
              02. Links
            </span>
            <h2 className="font-black text-2xl uppercase">External Sites</h2>
          </div>
          <p className="relative z-10 font-medium text-gray-800 leading-relaxed">
            We may link to other websites. We do not monitor or check these
            external sites for accuracy. We are not responsible for the content
            or privacy practices of third-party sites.
          </p>
        </div>

        {/* 4. TECH DISCLAIMER (Left, Styled like Code Editor) */}
        <div className="md:col-span-6 bg-[#1a1a1a] border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#A259FF] text-gray-300 font-mono text-sm relative overflow-hidden group">
          {/* Mac Window Controls */}
          <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          <p className="mb-4">
            <span className="text-[#A259FF]">const</span>{" "}
            <span className="text-yellow-400">devWarning</span> ={" "}
            <span className="text-green-400">"Read carefully"</span>;
          </p>
          <p className="leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            // Code snippets and tutorials are provided "as is". <br />
            // Tech stacks change rapidly. A solution that works today might
            break tomorrow. <br />
            // We are not responsible if you break your production DB.
          </p>
          <p className="mt-4 text-[#A259FF]">{`> Always_test_in_staging();`}</p>
        </div>

        {/* 5. AFFILIATE / ADS (Right, Standard) */}
        <div className="md:col-span-6 bg-white border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#000] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full border-2 border-black font-bold text-xs uppercase shadow-[2px_2px_0px_#000]">
                $$$
              </span>
              <h2 className="font-black text-2xl uppercase">
                Affiliates & Ads
              </h2>
            </div>
            <p className="font-medium text-gray-700 leading-relaxed">
              This site may contain affiliate links (we earn a commission if you
              buy something) and Google AdSense advertisements. This helps keep
              the server running and the coffee flowing.
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center text-xs font-bold text-gray-400 uppercase">
            Transparency First. Always.
          </div>
        </div>
      </div>
    </div>
  );
}
