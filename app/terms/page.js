export const metadata = { title: "Terms & Conditions | Sociials Blog" };

export default function Terms() {
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
            Terms & Conditions
          </h1>
          <div className="relative z-10 mt-6">
            <span className="font-bold text-xs md:text-sm bg-black text-white px-4 py-2 rounded-full border border-black shadow-[4px_4px_0px_#fff]">
              Effective Date: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-gray-800 prose-a:text-[#A259FF] prose-a:no-underline hover:prose-a:underline">
            {/* Section 1 */}
            <SectionHeader number="01" title="Acceptance of Terms" />
            <p>
              By accessing this website, you agree to be bound by these website
              Terms and Conditions of Use, all applicable laws, and regulations,
              and agree that you are responsible for compliance with any
              applicable local laws. If you do not agree with any of these
              terms, you are prohibited from using or accessing this site.
            </p>

            {/* Section 2 */}
            <SectionHeader number="02" title="Use License" />
            <div className="bg-gray-50 border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_#000] my-6 not-prose">
              <p className="font-bold mb-2">
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Sociials Blog for
                personal, non-commercial transitory viewing only.
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Under this license, you may not:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm font-medium">
                <li>Modify or copy the materials;</li>
                <li>
                  Use the materials for any commercial purpose, or for any
                  public display;
                </li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on the site;
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <SectionHeader number="03" title="Disclaimer" />
            <p>
              The materials on <strong>Sociials Blog</strong> are provided "as
              is". We make no warranties, expressed or implied, and hereby
              disclaim and negate all other warranties, including without
              limitation, implied warranties or conditions of merchantability,
              fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>

            {/* Section 4 */}
            <SectionHeader number="04" title="Limitations" />
            <p>
              In no event shall we or our suppliers be liable for any damages
              (including, without limitation, damages for loss of data or
              profit, or due to business interruption) arising out of the use or
              inability to use the materials on this website, even if we or an
              authorized representative has been notified orally or in writing
              of the possibility of such damage.
            </p>

            {/* Section 5 */}
            <SectionHeader number="05" title="Revisions" />
            <p>
              The materials appearing on our website could include technical,
              typographical, or photographic errors. We do not warrant that any
              of the materials on its website are accurate, complete, or
              current. We may make changes to the materials contained on its
              website at any time without notice.
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
