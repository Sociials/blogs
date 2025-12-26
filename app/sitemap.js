import dbConnect from "../lib/db";
import Blog from "../model/Blog";

export default async function sitemap() {
  const baseUrl = "https://blogs.sociials.com"; // ⚠️ Replace with your actual domain

  await dbConnect();

  // 1. Fetch slug AND updatedAt
  const blogs = await Blog.find({}, "slug updatedAt").lean();

  const blogEntries = blogs.map((blog) => {
    // ⚠️ SAFEGUARD: If updatedAt is missing/invalid, use current date
    const date = blog.updatedAt ? new Date(blog.updatedAt) : new Date();
    // Double check if date is valid, if not, fallback to now
    const validDate = isNaN(date.getTime()) ? new Date() : date;

    return {
      url: `${baseUrl}/post/${blog.slug}`,
      lastModified: validDate,
      changeFrequency: "weekly",
      priority: 0.7,
    };
  });

  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Add other static pages like /about if you have them
  ];

  return [...staticEntries, ...blogEntries];
}
