import Link from "next/link";
import { notFound } from "next/navigation";
import BlogImage from "../../components/BlogImage";
import Footer from "../../components/Footer";

export const revalidate = 60;

// Fetch author data from dedicated endpoint
async function getAuthorData(authorId) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/authors/${authorId}`,
            { next: { revalidate: 60 } }
        );
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Error fetching author:", error);
        return null;
    }
}

// SEO Metadata
export async function generateMetadata({ params }) {
    const { id } = await params;
    const data = await getAuthorData(id);

    if (!data?.author)
        return { title: "Author Not Found — Sociials Blog" };

    const { author } = data;
    const description = author.bio
        ? `${author.bio.slice(0, 150)}…`
        : `Read all posts by ${author.name} on Sociials Blog.`;

    return {
        title: `${author.name} — Sociials Blog`,
        description,
        alternates: {
            canonical: `https://blogs.sociials.com/author/${id}`,
        },
        openGraph: {
            title: `${author.name} — Sociials Blog`,
            description,
            url: `https://blogs.sociials.com/author/${id}`,
            type: "profile",
            ...(author.avatar && { images: [{ url: author.avatar }] }),
        },
    };
}

export default async function AuthorPage({ params }) {
    const { id } = await params;
    const data = await getAuthorData(id);

    if (!data?.author) notFound();

    const { author, blogs } = data;

    // Parse social links
    let socialLinks = {};
    if (author.socialLinks) {
        try {
            socialLinks = JSON.parse(author.socialLinks);
        } catch { }
    }

    const hasSocials =
        socialLinks.twitter || socialLinks.instagram || socialLinks.website;

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col selection:bg-[#A259FF] selection:text-white">
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
                        ← Home
                    </Link>
                </div>
            </nav>

            <main className="flex-1 max-w-5xl mx-auto px-4 md:px-8 py-10 sm:py-16 w-full">
                {/* Author Header */}
                <div className="mb-12 sm:mb-16 border-b border-gray-100 pb-8 sm:pb-10">
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5 mb-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] overflow-hidden bg-[#A259FF] flex items-center justify-center flex-shrink-0">
                            {author.avatar ? (
                                <img
                                    src={author.avatar}
                                    alt={author.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-xl sm:text-2xl font-black select-none">
                                    {author.name
                                        .split(" ")
                                        .map((w) => w[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="unbounded-900 text-2xl sm:text-3xl md:text-4xl tracking-tight text-black leading-tight">
                                {author.name}
                            </h1>
                            <p className="text-sm text-gray-500 font-medium mt-1">
                                {blogs.length} {blogs.length === 1 ? "article" : "articles"}{" "}
                                published
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    {author.bio && (
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mb-4">
                            {author.bio}
                        </p>
                    )}

                    {!author.bio && (
                        <p className="text-gray-400 text-base leading-relaxed max-w-2xl mb-4">
                            All stories and articles written by{" "}
                            <strong className="text-black">{author.name}</strong> on Sociials
                            Blog.
                        </p>
                    )}

                    {/* Social Links */}
                    {hasSocials && (
                        <div className="flex flex-wrap gap-2">
                            {socialLinks.twitter && (
                                <a
                                    href={
                                        socialLinks.twitter.startsWith("http")
                                            ? socialLinks.twitter
                                            : `https://${socialLinks.twitter}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
                                >
                                    𝕏 Twitter
                                </a>
                            )}
                            {socialLinks.instagram && (
                                <a
                                    href={
                                        socialLinks.instagram.startsWith("http")
                                            ? socialLinks.instagram
                                            : `https://${socialLinks.instagram}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
                                >
                                    📸 Instagram
                                </a>
                            )}
                            {socialLinks.website && (
                                <a
                                    href={
                                        socialLinks.website.startsWith("http")
                                            ? socialLinks.website
                                            : `https://${socialLinks.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
                                >
                                    🌐 Website
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Blog Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                        <p className="text-lg font-bold mb-2">No posts yet</p>
                        <p className="text-sm">
                            This author hasn&apos;t published anything yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/post/${blog.slug}`}
                                className="group block h-full"
                            >
                                <article className="flex flex-col h-full bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-[4px_4px_0px_#A259FF] hover:-translate-y-1 transition-all duration-300">
                                    {blog.coverImage && (
                                        <div className="w-full aspect-[16/10] relative bg-gray-50 overflow-hidden border-b-2 border-gray-100">
                                            <BlogImage src={blog.coverImage} alt={blog.title} />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                        </div>
                                    )}
                                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            {blog.tags && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-[10px] font-bold uppercase text-[#A259FF] border border-[#A259FF]/30 px-2 py-0.5 rounded-full">
                                                        {typeof blog.tags === "string"
                                                            ? blog.tags.split(",")[0].trim()
                                                            : blog.tags[0]}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <h2 className="font-bold text-lg sm:text-xl leading-snug mb-2 group-hover:text-[#A259FF] transition-colors">
                                            {blog.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-4">
                                            {blog.summary}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <span className="text-xs font-bold text-black group-hover:translate-x-1 transition-transform inline-block">
                                                Read Article →
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
