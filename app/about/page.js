export const metadata = { title: "About Us | Sociials Blog" };

export default function About() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] py-12 px-4 md:px-6 font-sans text-black">
      {/* Main Container Card */}
      <div className="max-w-4xl mx-auto bg-white border-2 border-black rounded-[20px] md:rounded-[30px] shadow-[8px_8px_0px_#000] overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#A259FF] border-b-2 border-black p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <h1 className="relative z-10 unbounded-900 text-3xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[3px_3px_0px_#000]">
            About Us
          </h1>
          <p className="relative z-10 mt-4 font-bold text-white text-lg max-w-lg mx-auto leading-relaxed">
            Code, chaos, and the pursuit of pixel-perfect designs.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-gray-800 prose-a:text-[#A259FF] prose-a:no-underline hover:prose-a:underline">
            {/* Section 1: Intro */}
            <SectionHeader number="01" title="Who We Are" />
            <p className="text-xl leading-relaxed">
              Welcome to <strong>Sociials Blog</strong>, your digital playground
              for all things Web Development, Design, and Tech. We are dedicated
              to giving you the very best content, with a focus on real-world
              coding examples, unfiltered opinions, and practical tutorials.
            </p>

            {/* Section 2: The Story */}
            <SectionHeader number="02" title="The Story" />
            <p>
              Founded in {new Date().getFullYear()},{" "}
              <strong>Sociials Blog</strong> has come a long way from just a
              messy folder of Markdown files. When we first started out, our
              passion for
              <strong> "building cool stuff on the internet"</strong> drove us
              to do tons of research (and fix tons of bugs) so that we can offer
              you the world's most relatable dev content.
            </p>

            {/* Section 3: Creator Profile Card */}
            <div className="mt-12 not-prose">
              <div className="bg-[#F3F2EC] border-2 border-black rounded-xl p-6 md:p-8 relative shadow-[4px_4px_0px_#000]">
                {/* Badge */}
                <div className="absolute -top-3 -right-3 bg-black text-white text-xs font-bold px-3 py-1 border-2 border-white rotate-3 shadow-sm">
                  THE CREATOR
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar Placeholder */}
                  <div className="w-24 h-24 bg-white border-2 border-black rounded-full flex items-center justify-center text-4xl shadow-[2px_2px_0px_#A259FF] shrink-0">
                    👨‍💻
                  </div>

                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black uppercase mb-1">
                      Nishu
                    </h3>
                    <p className="text-sm font-bold text-[#A259FF] mb-3 uppercase tracking-wider">
                      Full Stack Developer
                    </p>
                    <p className="text-gray-700 font-medium leading-relaxed">
                      "I built this site to document my journey through the MERN
                      stack and beyond. I hope you enjoy reading these blogs as
                      much as I enjoy writing (and debugging) them."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Mission */}
            <SectionHeader number="03" title="The Mission" />
            <p>
              We aim to make tech accessible, fun, and slightly less
              frustrating. If you have any questions, comments, or just want to
              argue about which JavaScript framework is best, please don't
              hesitate to <a href="/contact">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component for consistency
function SectionHeader({ number, title }) {
  return (
    <div className="flex items-center gap-3 mt-10 mb-4 border-b-2 border-gray-100 pb-2">
      <span className="bg-black text-white font-black px-2 py-1 text-sm rounded border-2 border-black">
        {number}
      </span>
      <h3 className="text-2xl font-black uppercase m-0 tracking-tight">
        {title}
      </h3>
    </div>
  );
}
