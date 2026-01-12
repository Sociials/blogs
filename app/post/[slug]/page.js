import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";

// ✅ SEO CONFIG
export const revalidate = 60; // ISR: Cache for 60s
export const dynamicParams = true;

// --- DATA FETCHERS ---

// 1. Fetch Single Blog by Slug
async function getBlog(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// 2. Fetch Related Blogs (Client-side filtering of the main feed)
async function getRelatedBlogs(currentSlug, tags) {
  if (!tags) return [];

  // Convert tag string (D1 format "tag1, tag2") to array if needed
  const tagArray = Array.isArray(tags)
    ? tags
    : tags.split(",").map((t) => t.trim());

  if (tagArray.length === 0) return [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const allBlogs = await res.json();

    // Filter: Match tags, exclude current post, take top 3
    const related = allBlogs
      .filter((post) => {
        if (post.slug === currentSlug) return false;
        const postTags =
          typeof post.tags === "string"
            ? post.tags.split(",")
            : post.tags || [];
        return postTags.some((t) => tagArray.includes(t.trim()));
      })
      .slice(0, 3);

    return related;
  } catch (error) {
    return [];
  }
}

// --- SEO METADATA ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return { title: "Post Not Found" };

  return {
    title: blog.title,
    description: blog.summary,
    alternates: {
      canonical: `https://blogs.sociials.com/post/${slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.summary,
      url: `https://blogs.sociials.com/post/${slug}`,
      type: "article",
      images: [blog.coverImage || "https://blogs.sociials.com/default-og.png"],
      authors: [blog.authorName], // Added author to SEO metadata
    },
  };
}

// --- MAIN COMPONENT ---
export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(slug, blog.tags);

  // Handle Legacy Google Drive Images + New Cloudinary Images
  const displayImage = blog.coverImage?.includes("drive.google.com")
    ? `https://drive.google.com/uc?export=view&id=${
        blog.coverImage.split("/d/")[1].split("/")[0]
      }`
    : blog.coverImage;

  // Handle Tags (Convert string to array for display)
  const displayTags =
    typeof blog.tags === "string"
      ? blog.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : blog.tags || [];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col selection:bg-[#A259FF] selection:text-white">
      {/* NAVBAR */}
      <nav className="w-full border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
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
          <Link
            href="/"
            className="text-xs font-bold bg-white text-black border-2 border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition-all"
          >
            ← Back
          </Link>
        </div>
      </nav>

      <main className="flex-1 w-full">
        {/* HEADER */}
        <header className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="flex justify-center items-center gap-3 mb-6 text-sm font-bold uppercase tracking-widest text-gray-500">
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            {/* --- AUTHOR NAME ADDED HERE --- */}
            {blog.authorName && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-black">By {blog.authorName}</span>
              </>
            )}
            {/* ----------------------------- */}
          </div>
          <h1 className="unbounded-900 text-4xl md:text-6xl leading-[1.1] mb-8 text-black">
            {blog.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {blog.summary}
          </p>
        </header>

        {/* HERO IMAGE */}
        {displayImage && (
          <div className="max-w-5xl mx-auto px-4 md:px-6 mb-16">
            <div className="w-full h-auto rounded-[20px] overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000] bg-gray-100">
              <img
                src={displayImage}
                alt={blog.title}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {/* CONTENT */}
        <article className="max-w-3xl mx-auto px-6 pb-10">
          <div className="prose prose-lg md:prose-xl max-w-none text-gray-800 prose-headings:font-black prose-headings:text-black prose-a:text-[#A259FF] prose-a:no-underline prose-img:rounded-xl prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0px_#000]">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => {
                  const isInternal =
                    href &&
                    (href.startsWith("/") || href.includes("sociials.com"));
                  if (isInternal) {
                    return (
                      <Link
                        href={href}
                        className="text-[#A259FF] no-underline font-bold hover:text-black hover:underline"
                      >
                        {children}
                      </Link>
                    );
                  }
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#A259FF] no-underline font-bold hover:text-black hover:underline"
                    >
                      {children} ↗
                    </a>
                  );
                },
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* TAGS FOOTER */}
          {displayTags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/topic/${tag}`}
                    className="text-sm font-bold bg-white border-2 border-black px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* RELATED POSTS */}
        {relatedBlogs.length > 0 && (
          <section className="bg-gray-50 border-t border-gray-200 py-16">
            <div className="max-w-5xl mx-auto px-6">
              <h3 className="unbounded-900 text-2xl mb-8">Read Next</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/post/${post.slug}`}
                    className="group block h-full"
                  >
                    <article className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-black hover:shadow-[4px_4px_0px_#A259FF] hover:-translate-y-1 transition-all h-full flex flex-col">
                      {post.coverImage && (
                        <div className="h-40 bg-gray-100 overflow-hidden border-b-2 border-gray-100">
                          <img
                            src={post.coverImage}
                            className="w-full h-full object-cover"
                            alt={post.title}
                          />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <h4 className="font-bold text-lg leading-tight group-hover:text-[#A259FF] transition-colors mb-4">
                          {post.title}
                        </h4>
                        <span className="mt-auto text-xs font-bold underline decoration-gray-300 underline-offset-4 group-hover:decoration-[#A259FF]">
                          Read Article
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
