import dbConnect from "../../../lib/db";
import Blog from "../../../model/Blog";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogImage from "../../components/BlogImage";
import Footer from "../../components/Footer";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

async function getBlog(slug) {
  await dbConnect();
  const blog = await Blog.findOne({ slug: slug }).lean();
  if (!blog) return null;
  return JSON.parse(JSON.stringify(blog));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col selection:bg-[#A259FF] selection:text-white">
      {/* --- NAVBAR --- */}
      <nav className="w-full border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <a
              href="https://sociials.com"
              className="unbounded-900 text-lg md:text-xl tracking-tight hover:text-[#A259FF] transition-colors"
            >
              Sociials
            </a>
            <span className="text-gray-300 text-xl font-light">/</span>
            <Link
              href="/"
              className="font-bold text-lg md:text-xl text-gray-900"
            >
              Blog
            </Link>
          </div>

          {/* Back Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold bg-white text-black border-2 border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition-all"
            >
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">
        {/* --- ARTICLE HEADER --- */}
        <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          {/* Meta Info */}
          <div className="flex justify-center items-center gap-3 mb-6 text-sm font-bold uppercase tracking-widest text-gray-500">
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-[#A259FF]">
              {(blog.tags && blog.tags[0]) || "Update"}
            </span>
          </div>

          {/* Title */}
          <h1 className="unbounded-900 text-4xl md:text-6xl leading-[1.1] mb-8 text-black">
            {blog.title}
          </h1>

          {/* Summary/Lead */}
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {blog.summary}
          </p>
        </header>

        {/* --- HERO IMAGE (Natural Height Fix) --- */}
        {blog.coverImage && (
          <div className="max-w-5xl mx-auto px-4 md:px-6 mb-16">
            {/* Used 'h-auto' instead of aspect-ratio to prevent cutting/skewing.
                   The image will show in its full natural dimensions.
                */}
            <div className="w-full h-auto rounded-[20px] overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000] bg-gray-100">
              <img
                src={
                  blog.coverImage.includes("drive.google.com")
                    ? `https://drive.google.com/uc?export=view&id=${
                        blog.coverImage.split("/d/")[1].split("/")[0]
                      }`
                    : blog.coverImage
                }
                alt={blog.title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* --- CONTENT --- */}
        <article className="max-w-3xl mx-auto px-6 pb-20">
          <div
            className="
                prose prose-lg md:prose-xl max-w-none text-gray-800
                prose-headings:font-black prose-headings:text-black prose-headings:font-sans
                prose-p:leading-relaxed prose-p:text-gray-600
                prose-a:text-[#A259FF] prose-a:no-underline prose-a:font-bold hover:prose-a:text-black hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-[#A259FF] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:font-medium
                prose-img:rounded-xl prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0px_#000]
                prose-code:bg-gray-100 prose-code:text-black prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-hr:border-black prose-hr:my-12
            "
          >
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>

          {/* --- TAGS FOOTER --- */}
          {(blog.tags || []).length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Filed Under
              </p>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?tag=${tag}`}
                    className="text-sm font-bold bg-white border-2 border-black px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
