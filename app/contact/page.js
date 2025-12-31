export const metadata = { title: "Contact Us | Sociials Blog" };

export default function Contact() {
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
            Contact Us
          </h1>
          <p className="relative z-10 mt-4 font-bold text-white text-lg max-w-lg mx-auto leading-relaxed">
            Got a question or just want to chat? We are here.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 md:p-12">
          {/* Intro Text */}
          <div className="text-center mb-10">
            <h3 className="text-xl font-black uppercase mb-2">Get in Touch</h3>
            <p className="font-medium text-gray-600 max-w-xl mx-auto">
              We prefer email for detailed queries. Reach out to us directly
              below, and we'll get back to you within 24 hours.
            </p>
          </div>

          {/* EMAIL CARD (Centered) */}
          <div className="max-w-xl mx-auto">
            <a
              href="mailto:contact@sociials.com"
              className="group block bg-[#F3F2EC] border-2 border-black rounded-xl p-8 md:p-12 text-center hover:bg-black hover:text-white transition-all hover:shadow-[4px_4px_0px_#A259FF] hover:-translate-y-1"
            >
              <div className="w-20 h-20 bg-white border-2 border-black rounded-full flex items-center justify-center mx-auto mb-6 text-4xl group-hover:bg-[#A259FF] group-hover:text-white group-hover:border-white transition-colors">
                📧
              </div>
              <h4 className="font-black uppercase text-sm mb-3 opacity-50 group-hover:opacity-80">
                Email Us At
              </h4>
              <p className="text-2xl md:text-4xl font-black break-all">
                contact@sociials.com
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
