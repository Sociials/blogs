import Link from "next/link";

export const metadata = { title: "About Us | Sociials Blog" };

export default function About() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] p-4 md:p-8 font-sans text-black flex items-center justify-center">
      {/* --- BENTO GRID CONTAINER --- */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* 1. HERO TITLE BLOCK (Full Width) */}
        <div className="md:col-span-12 bg-white border-2 border-black rounded-[30px] p-8 md:p-16 text-center shadow-[8px_8px_0px_#000] relative overflow-hidden">
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-[#A259FF]"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gray-100 rounded-full blur-3xl -z-0"></div>

          <h1 className="relative z-10 unbounded-900 text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
            Beyond the{" "}
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #A259FF" }}
            >
              Link
            </span>
            .
          </h1>
          <p className="relative z-10 mt-6 text-xl md:text-2xl font-bold text-gray-600 max-w-2xl mx-auto">
            Sociials Blog is the editorial arm of the Sociials ecosystem. <br />
            We explore what happens <i>after</i> the click.
          </p>
        </div>

        {/* 2. "WHAT IS THIS" BLOCK (Left, Larger) */}
        <div className="md:col-span-7 bg-[#A259FF] border-2 border-black rounded-[30px] p-8 md:p-12 text-white shadow-[8px_8px_0px_#000] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 text-9xl opacity-20 rotate-12 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
            📝
          </div>

          <div>
            <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded-full border border-white">
              The Mission
            </span>
            <h2 className="unbounded-900 text-3xl md:text-4xl mt-6 leading-tight">
              A Digital Magazine for the Creator Economy.
            </h2>
          </div>

          <div className="mt-8 space-y-4 font-medium text-lg md:text-xl border-t border-white/30 pt-8">
            <p>
              While <strong>Sociials.com</strong> simplifies your digital
              presence, this blog complicates it—in a good way.
            </p>
            <p>
              We dive deep into trends, dissect platform updates, and share
              stories that don't fit in a bio.
            </p>
          </div>
        </div>

        {/* 3. "MAIN PLATFORM" LINK BLOCK (Right, Sidebar style) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          {/* Top: The Link-in-bio Plug */}
          <a
            href="https://sociials.com"
            target="_blank"
            className="flex-1 bg-black border-2 border-black rounded-[30px] p-8 text-white shadow-[8px_8px_0px_#A259FF] hover:translate-x-1 hover:-translate-y-1 transition-transform group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold mb-1">Sociials.com</h3>
                <p className="text-gray-400 text-sm font-mono">
                  The Mother Ship
                </p>
              </div>
              <span className="text-3xl group-hover:rotate-45 transition-transform duration-300">
                ↗
              </span>
            </div>

            <div className="mt-8">
              <p className="font-bold text-lg leading-tight text-gray-200">
                Need a page to host all your links? Build your free Sociials
                page today.
              </p>
            </div>
          </a>

          {/* Bottom: Topics/Tags */}
          <div className="flex-1 bg-white border-2 border-black rounded-[30px] p-8 shadow-[8px_8px_0px_#000] flex flex-col justify-center">
            <span className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">
              What we cover
            </span>
            <div className="flex flex-wrap gap-2">
              <Tag text="Growth" />
              <Tag text="Design" />
              <Tag text="Monetization" />
              <Tag text="Tech" />
              <Tag text="Lifestyle" />
              <Tag text="Web3" />
            </div>
          </div>
        </div>

        {/* 4. FOOTER / MANIFESTO BLOCK (Full Width) */}
        <div className="md:col-span-12 bg-[#F3F2EC] border-2 border-black rounded-[30px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-dashed">
          <div className="text-center md:text-left">
            <h3 className="font-black text-2xl uppercase">
              Unfiltered & Open Source
            </h3>
            <p className="font-medium text-gray-600 mt-2">
              We believe knowledge should be free. No paywalls, just value.
            </p>
          </div>

          <Link
            href="/"
            className="bg-white text-black text-lg font-bold px-8 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-[#A259FF] hover:text-white transition-all hover:shadow-[2px_2px_0px_#000] active:translate-y-1"
          >
            Start Reading Blogs →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Simple Tag Component
function Tag({ text }) {
  return (
    <span className="px-3 py-1 bg-gray-100 border border-black rounded-lg font-bold text-sm hover:bg-[#A259FF] hover:text-white hover:border-black transition-colors cursor-default">
      #{text}
    </span>
  );
}
