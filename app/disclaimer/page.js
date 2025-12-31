export const metadata = { title: "Disclaimer | Sociials Blog" };

export default function Disclaimer() {
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
            Disclaimer
          </h1>
          <div className="relative z-10 mt-6">
            <span className="font-bold text-xs md:text-sm bg-black text-white px-4 py-2 rounded-full border border-black shadow-[4px_4px_0px_#fff]">
              Read Carefully
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-gray-800 prose-a:text-[#A259FF] prose-a:no-underline hover:prose-a:underline">
            {/* Section 1: General */}
            <SectionHeader number="01" title="General Information" />
            <p>
              The information provided on <strong>Sociials Blog</strong> is for
              general informational purposes only. All information on the Site
              is provided in good faith, however, we make no representation or
              warranty of any kind, express or implied, regarding the accuracy,
              adequacy, validity, reliability, availability, or completeness of
              any information on the Site.
            </p>

            <p>
              Under no circumstance shall we have any liability to you for any
              loss or damage of any kind incurred as a result of the use of the
              site or reliance on any information provided on the site. Your use
              of the site and your reliance on any information on the site is
              solely at your own risk.
            </p>

            {/* Section 2: External Links (Styled as Warning) */}
            <SectionHeader number="02" title="External Links" />

            <div className="bg-yellow-50 border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_#000] my-8 not-prose relative">
              {/* Warning Icon Badge */}
              <div className="absolute -top-4 -left-4 bg-yellow-400 text-black w-10 h-10 flex items-center justify-center border-2 border-black rounded-full font-black text-xl shadow-[2px_2px_0px_#000]">
                ⚠️
              </div>

              <h4 className="font-black uppercase text-lg mb-2 mt-2">
                Third Party Content
              </h4>
              <p className="font-medium text-gray-800 leading-relaxed">
                The Site may contain (or you may be sent through the Site) links
                to other websites or content belonging to or originating from
                third parties. Such external links are not investigated,
                monitored, or checked for accuracy, adequacy, validity,
                reliability, availability, or completeness by us.
              </p>
              <p className="font-bold text-sm mt-4 border-t-2 border-black pt-2 inline-block">
                We do not warrant, endorse, guarantee, or assume responsibility
                for the accuracy or reliability of any information offered by
                third-party websites linked through the site.
              </p>
            </div>

            {/* Section 3: Professional Disclaimer */}
            <SectionHeader number="03" title="Professional Advice" />
            <p>
              The Site cannot and does not contain professional advice (e.g.,
              legal, financial, or coding advice). The information is provided
              for general informational and educational purposes only and is not
              a substitute for professional advice.
            </p>
            <p>
              Accordingly, before taking any actions based upon such
              information, we encourage you to consult with the appropriate
              professionals. We do not provide any kind of professional advice.
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
