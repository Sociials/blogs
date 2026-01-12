import Link from "next/link";
import { notFound } from "next/navigation";
import BlogImage from "../../components/BlogImage";
import Footer from "../../components/Footer";

// ✅ SEO CONFIG
export const revalidate = 60; // Regenerate page every 60 seconds
export const dynamicParams = true;

// --- DATA FETCHERS ---

// 1. Fetch All Blogs (Cached)
async function getFeed() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Feed fetch error:", error);
    return [];
  }
}

// 2. Extract All Unique Tags
async function getAllTags() {
  const blogs = await getFeed();
  const tags = new Set();

  blogs.forEach((blog) => {
    // Handle D1 string format "tag1, tag2"
    const tagList =
      typeof blog.tags === "string"
        ? blog.tags.split(",").map((t) => t.trim())
        : blog.tags || [];

    tagList.forEach((t) => {
      if (t) tags.add(t);
    });
  });

  return Array.from(tags).sort();
}

// 3. Filter Blogs by Specific Tag
async function getBlogsByTag(tag) {
  const allBlogs = await getFeed();
  const decodedTag = decodeURIComponent(tag).toLowerCase();

  return allBlogs.filter((blog) => {
    const blogTags =
      typeof blog.tags === "string"
        ? blog.tags.split(",").map((t) => t.trim().toLowerCase())
        : (blog.tags || []).map((t) => t.toLowerCase());

    return blogTags.includes(decodedTag);
  });
}

// --- NEXT.JS PAGE CONFIG ---

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
  const { tag } = await params; // Await params in Next.js 15+
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedTag} Posts | Sociials Blog`,
    description: `Read the latest stories and tutorials about ${decodedTag} on Sociials.`,
    alternates: {
      canonical: `https://blogs.sociials.com/topic/${tag}`,
    },
    openGraph: {
      title: `Posts about ${decodedTag}`,
      description: `Explore our collection of articles on ${decodedTag}.`,
    },
  };
}

// Generate Static Paths (Pre-build popular tags)
export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag: tag }));
}

// --- MAIN COMPONENT ---

export default async function TagPage({ params }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  // Parallel Data Fetching
  const [blogs, allTags] = await Promise.all([
    getBlogsByTag(tag),
    getAllTags(),
  ]);

  if (blogs.length === 0) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col selection:bg-[#A259FF] selection:text-white">
      {/* NAVBAR */}
      <nav className="w-full border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 select-none">
            <a
              href="https://sociials.com"
              className="unbounded-900 text-lg md:text-xl tracking-tight hover:text-[#A259FF]"
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
            href="/explore"
            className="text-xs font-bold bg-white text-black border-2 border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition-all"
          >
            ← All Topics
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto px-4 md:px-6 py-16 w-full">
        {/* HEADER */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2 block">
            Topic
          </span>
          <h1 className="unbounded-900 text-4xl sm:text-6xl mb-8 tracking-tighter text-black capitalize">
            #{decodedTag}
          </h1>

          {/* Quick Nav to other tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/topic/${t}`}
                className={`px-4 py-1.5 rounded-lg border-2 border-black text-xs font-bold uppercase tracking-wide transition-all ${
                  t === decodedTag
                    ? "bg-[#A259FF] text-white border-[#A259FF]"
                    : "bg-white text-black hover:border-[#A259FF] hover:text-[#A259FF]"
                }`}
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>

        {/* POST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id} // D1 uses 'id', not '_id'
              href={`/post/${blog.slug}`}
              className="group block h-full outline-none"
            >
              <article className="flex flex-col h-full bg-white border-2 border-black rounded-[20px] overflow-hidden shadow-[4px_4px_0px_#000] hover:shadow-[4px_4px_0px_#A259FF] hover:-translate-y-1 transition-all duration-300">
                <div className="w-full h-64 border-b-2 border-black relative bg-gray-50">
                  {blog.coverImage && (
                    <BlogImage src={blog.coverImage} alt={blog.title} />
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h2 className="unbounded-900 text-2xl mb-3 leading-tight group-hover:text-[#A259FF] transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
                    {blog.summary}
                  </p>
                  <div className="mt-auto flex items-center text-xs font-bold text-black border-t border-gray-100 pt-4 group-hover:border-black transition-colors">
                    Read Article →
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
