import dbConnect from "../lib/db";
import Blog from "../model/Blog";

export default async function sitemap() {
  // ⚠️ CHANGE THIS to your actual live domain
  const baseUrl = "https://blogs.sociials.com";

  // 1. Fetch all blog slugs from MongoDB
  await dbConnect();
  const blogs = await Blog.find({}, "slug updatedAt").lean();

  // 2. Map blogs to sitemap format
  const blogEntries = blogs.map((blog) => ({
    url: `${baseUrl}/post/${blog.slug}`, // Check if your route is /post/ or /blog/
    lastModified: new Date(blog.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 3. Define your static pages (Home, About, etc.)
  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Add other static pages here
  ];

  // 4. Return combined list
  return [...staticEntries, ...blogEntries];
}
