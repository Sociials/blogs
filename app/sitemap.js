import dbConnect from "../lib/db";
import Blog from "../model/Blog";

// Force the sitemap to be refreshed periodically (e.g., every 24 hours)
// so new blog posts appear without a full redeploy.
export const revalidate = 86400;

export default async function sitemap() {
  const baseUrl = "https://blogs.sociials.com"; // Ensure this is your EXACT production domain

  await dbConnect();

  // 1. Fetch Dynamic Blog Posts
  const blogs = await Blog.find({}, "slug updatedAt").lean();

  const blogEntries = blogs.map((blog) => {
    const date = blog.updatedAt ? new Date(blog.updatedAt) : new Date();
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return {
      url: `${baseUrl}/post/${blog.slug}`,
      lastModified: validDate,
      changeFrequency: "weekly",
      priority: 0.8, // Blogs are high priority
    };
  });
  const tagEntries = tags.map((tag) => ({
    url: `${baseUrl}/topic/${tag}`, // Clean URL
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));
  // 2. Add All Static Pages (Crucial for Indexing)
  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0, // Home is highest
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9, // Explore is important for discovery
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3, // Legal pages are low priority for SEO
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...blogEntries, ...tagEntries];
}
