import { Children, isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogImage from "../../components/BlogImage";
import Footer from "../../components/Footer";
import PostReadingTools from "../../components/PostReadingTools";

export const revalidate = 60;
export const dynamicParams = true;

async function getBlog(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getRelatedBlogs(currentSlug, tags) {
  if (!tags) return [];

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

    return allBlogs
      .filter((post) => {
        if (post.slug === currentSlug) return false;
        const postTags =
          typeof post.tags === "string"
            ? post.tags.split(",")
            : post.tags || [];
        return postTags.some((t) => tagArray.includes(t.trim()));
      })
      .slice(0, 3);
  } catch {
    return [];
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[`*_~[\](){}.!?,:;'"\\/+|]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getReadingStats(content) {
  const words = (content?.match(/\b[\w'-]+\b/g) || []).length;
  return {
    words,
    readTime: Math.max(1, Math.round(words / 220)),
  };
}

function extractHeadings(content) {
  const used = new Map();

  return content
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);
      if (!match) return null;

      const text = match[2].replace(/[*_`~[\]()]/g, "").trim();
      if (!text) return null;

      const base = slugify(text) || "section";
      const count = (used.get(base) || 0) + 1;
      used.set(base, count);

      return {
        level: match[1].length,
        text,
        id: count === 1 ? base : `${base}-${count}`,
      };
    })
    .filter(Boolean);
}

function flattenText(children) {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement(child)) {
        return flattenText(child.props.children);
      }

      return "";
    })
    .join("");
}

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
      authors: [blog.authorName],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  const relatedBlogs = await getRelatedBlogs(slug, blog.tags);
  const displayTags =
    typeof blog.tags === "string"
      ? blog.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : blog.tags || [];
  const stats = getReadingStats(blog.content || "");
  const headings = extractHeadings(blog.content || "").slice(0, 6);
  const headingMap = new Map();

  headings.forEach((heading) => {
    const existing = headingMap.get(heading.text) || [];
    existing.push(heading.id);
    headingMap.set(heading.text, existing);
  });

  function resolveHeadingId(children, fallback = "section") {
    const text = flattenText(children).trim();
    const queue = text ? headingMap.get(text) : null;
    if (queue?.length) {
      return queue.shift();
    }
    return slugify(text) || fallback;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col selection:bg-[#A259FF] selection:text-white">
      <nav className="w-full border-b border-gray-100 py-4 px-4 md:px-8 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
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
            {"<-"} Back
          </Link>
        </div>
      </nav>

      <main className="flex-1 w-full">
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-8 sm:pb-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-6 text-[11px] sm:text-sm font-bold uppercase tracking-[0.18em] text-gray-500">
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-gray-300">•</span>
            <span>{stats.readTime} min read</span>
            {blog.authorName ? (
              <>
                <span className="text-gray-300">•</span>
                <Link
                  href={`/author/${blog.authorId}`}
                  className="text-black hover:text-[#A259FF] transition-colors"
                >
                  By {blog.authorName}
                </Link>
              </>
            ) : null}
          </div>

          <h1 className="unbounded-900 text-2xl sm:text-4xl md:text-6xl leading-[1.1] mb-6 sm:mb-8 text-black">
            {blog.title}
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            {blog.summary}
          </p>

          {displayTags.length > 0 ? (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {displayTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/topic/${tag}`}
                  className="text-xs font-bold bg-[#F7F4EA] border border-black/10 px-3 py-2 rounded-full hover:border-black hover:bg-white transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </header>

        {blog.coverImage ? (
          <div className="max-w-5xl mx-auto px-4 md:px-6 mb-14 md:mb-16">
            <div className="w-full h-auto rounded-[20px] overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000] bg-gray-100">
              <BlogImage src={blog.coverImage} alt={blog.title} />
            </div>
          </div>
        ) : null}

        <article id="post-content" className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 overflow-hidden">
          <PostReadingTools articleId="post-content" title={blog.title} />

          {headings.length > 0 ? (
            <div className="mt-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400 mb-3">
                Jump Through The Story
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className="shrink-0 rounded-full border border-black/10 bg-[#F8F6F0] px-4 py-2 text-xs font-bold text-gray-600 hover:border-black hover:bg-white hover:text-black transition-all"
                  >
                    {heading.text}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 prose prose-sm sm:prose-lg md:prose-xl max-w-none text-gray-800 prose-headings:font-black prose-headings:text-black prose-headings:scroll-mt-28 prose-a:text-[#A259FF] prose-a:no-underline prose-img:rounded-xl prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0px_#000] break-words">
            <ReactMarkdown
              components={{
                h2: ({ children }) => {
                  const id = resolveHeadingId(children, "section");
                  return <h2 id={id}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const id = resolveHeadingId(children, "subsection");
                  return <h3 id={id}>{children}</h3>;
                },
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
                      {children} {"->"}
                    </a>
                  );
                },
                img: ({ src, alt }) => (
                  <span className="block overflow-hidden rounded-xl border-2 border-black shadow-[4px_4px_0px_#000]">
                    <BlogImage
                      src={src}
                      alt={alt || blog.title}
                      className="w-full h-auto object-contain"
                      disableHoverScale
                    />
                  </span>
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {blog.authorName ? (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                    Written By
                  </p>
                  <Link
                    href={`/author/${blog.authorId}`}
                    className="mt-2 inline-block text-lg font-black text-black hover:text-[#A259FF] transition-colors"
                  >
                    {blog.authorName}
                  </Link>
                </div>
              ) : (
                <div />
              )}

              {displayTags.length > 0 ? (
                <div className="flex flex-wrap gap-2 md:justify-end">
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
              ) : null}
            </div>
          </div>
        </article>

        {relatedBlogs.length > 0 ? (
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
                      {post.coverImage ? (
                        <div className="h-40 bg-gray-100 overflow-hidden border-b-2 border-gray-100">
                          <BlogImage src={post.coverImage} alt={post.title} />
                        </div>
                      ) : null}
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <h4 className="font-bold text-lg leading-tight group-hover:text-[#A259FF] transition-colors mb-3">
                          {post.title}
                        </h4>
                        {post.summary ? (
                          <p className="text-sm text-gray-600 leading-6 mb-4">
                            {post.summary}
                          </p>
                        ) : null}
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
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
