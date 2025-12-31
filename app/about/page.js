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
            About The Blog
          </h1>
          <p className="relative z-10 mt-4 font-bold text-white text-lg max-w-lg mx-auto leading-relaxed">
            More than just a link in bio. A space for stories, insights, and
            ideas.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-gray-800 prose-a:text-[#A259FF] prose-a:no-underline hover:prose-a:underline">
            {/* Section 1: Intro */}
            <SectionHeader number="01" title="The Big Picture" />
            <p className="text-xl leading-relaxed">
              Welcome to <strong>Sociials Blog</strong>, the official content
              hub for the Sociials ecosystem. While{" "}
              <strong>Sociials.com</strong> helps you connect your audience to
              your links, this blog exists to connect you to new ideas.
            </p>
            <p>
              We cover a wide range of topics—from digital culture and creator
              economy trends to lifestyle tips and platform updates. We believe
              that everyone has a story that takes more than just a single URL
              to tell.
            </p>

            {/* Section 2: Origin */}
            <SectionHeader number="02" title="Why We Write" />
            <p>
              In a world of 15-second clips and character limits, we wanted to
              carve out a corner of the internet for long-form expression.
            </p>
            <p>
              This blog serves as a digital magazine for the creators, thinkers,
              and users who make up the Sociials community. Whether it's a deep
              dive into productivity, a showcase of user creativity, or just
              unfiltered thoughts on the state of the internet, you'll find it
              here.
            </p>

            {/* Section 3: Call to Action Box (Replaces Creator Card) */}
            <div className="mt-12 not-prose">
              <div className="bg-[#F3F2EC] border-2 border-black rounded-xl p-6 md:p-8 relative shadow-[4px_4px_0px_#000]">
                {/* Badge */}
                <div className="absolute -top-3 -right-3 bg-black text-white text-xs font-bold px-3 py-1 border-2 border-white rotate-3 shadow-sm">
                  ECOSYSTEM
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Logo Placeholder */}
                  <div className="w-20 h-20 bg-white border-2 border-black rounded-full flex items-center justify-center text-3xl shadow-[2px_2px_0px_#A259FF] shrink-0 font-black">
                    S.
                  </div>

                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-black uppercase mb-1">
                      Sociials.com
                    </h3>
                    <p className="text-sm font-bold text-[#A259FF] mb-3 uppercase tracking-wider">
                      The Main Platform
                    </p>
                    <p className="text-gray-700 font-medium leading-relaxed mb-4">
                      "Organize your digital life with a single link. Sociials
                      is the ultimate tool for creators to showcase everything
                      they do in one place."
                    </p>
                    <a
                      href="https://sociials.com"
                      target="_blank"
                      className="inline-block bg-black text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#A259FF] transition-colors"
                    >
                      Create Your Page →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Vision */}
            <SectionHeader number="03" title="The Vision" />
            <p>
              Our goal is simple: <strong>To amplify voices.</strong>
            </p>
            <p>
              We are building a resource that grows alongside our users. From
              helpful guides on growing your online presence to casual reads for
              your coffee break, Sociials Blog is designed to be your go-to
              bookmark for quality content.
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
