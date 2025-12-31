export const metadata = { title: "Privacy Policy | Sociials Blog" };

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F3F2EC] py-12 px-4 md:px-6 font-sans text-black">
      {/* Main Container Card */}
      <div className="max-w-4xl mx-auto bg-white border-2 border-black rounded-[20px] md:rounded-[30px] shadow-[8px_8px_0px_#000] overflow-hidden">
        {/* Header Section with Accent Color */}
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
            Privacy Policy
          </h1>
          <div className="relative z-10 mt-6">
            <span className="font-bold text-xs md:text-sm bg-black text-white px-4 py-2 rounded-full border border-black shadow-[4px_4px_0px_#fff]">
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-p:font-medium prose-p:text-gray-800 prose-a:text-[#A259FF] prose-a:no-underline hover:prose-a:underline">
            {/* Section 1 */}
            <SectionHeader number="01" title="Introduction" />
            <p>
              We at <strong>Sociials Blog</strong> respect your privacy and are
              committed to protecting it. This policy explains what information
              we collect and how we use it regarding our specific services and
              tools.
            </p>

            {/* Section 2 */}
            <SectionHeader number="02" title="Log Files" />
            <p>
              Like many other websites, we make use of log files. These files
              log visitors to the site—a standard procedure for hosting
              companies and a part of hosting services' analytics. The
              information collected includes internet protocol (IP) addresses,
              browser type, Internet Service Provider (ISP), date/time stamp,
              referring/exit pages, and possibly the number of clicks.
            </p>

            {/* Section 3 */}
            <SectionHeader number="03" title="Cookies & Web Beacons" />
            <p>
              We use cookies to store information about visitors' preferences,
              to record user-specific information on which pages the site
              visitor accesses or visits, and to personalize or customize our
              web page content based on visitors' browser type or other
              information that the visitor sends via their browser.
            </p>

            {/* Section 4 */}
            <SectionHeader number="04" title="Google AdSense" />
            <div className="bg-gray-50 border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_#000] my-6 not-prose">
              <ul className="space-y-4 list-none pl-0">
                <li className="flex gap-3">
                  <span className="min-w-[10px] h-[10px] mt-2 bg-[#A259FF] border border-black block rounded-full"></span>
                  <p className="text-sm font-bold m-0">
                    Google is a third-party vendor on our site. It uses cookies
                    (DART cookies) to serve ads based on visits to our site and
                    others on the internet.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="min-w-[10px] h-[10px] mt-2 bg-[#A259FF] border border-black block rounded-full"></span>
                  <p className="text-sm font-bold m-0">
                    Visitors may choose to decline the use of DART cookies by
                    visiting the Google Ad and Content Network Privacy Policy:
                    <a
                      href="https://policies.google.com/technologies/ads"
                      target="_blank"
                      className="block mt-1 text-blue-600 hover:text-black underline decoration-2 underline-offset-2 break-all"
                    >
                      https://policies.google.com/technologies/ads
                    </a>
                  </p>
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <SectionHeader number="05" title="Consent" />
            <p>
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms.
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
