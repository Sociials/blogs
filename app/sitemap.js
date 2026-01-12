// app/sitemap.js

// Refresh sitemap every 24 hours
export const revalidate = 86400;

export default async function sitemap() {
  const baseUrl = "https://blogs.sociials.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let blogs = [];

  // 1. Fetch Dynamic Data from Cloudflare Worker
  try {
    const res = await fetch(`${apiUrl}/feed`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`API returned ${res.status}`);
    blogs = await res.json();
  } catch (err) {
    console.error("❌ Sitemap Error: Failed to fetch blogs from API", err);
    blogs = [];
  }

  // 2. Generate Blog Entries
  const blogEntries = blogs.map((blog) => ({
    url: `${baseUrl}/post/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Generate Tag Entries
  const uniqueTags = new Set();

  blogs.forEach((blog) => {
    if (blog.tags) {
      blog.tags
        .split(",")
        .map((t) => t.trim())
        .forEach((t) => {
          if (t) uniqueTags.add(t);
        });
    }
  });

  const tagEntries = Array.from(uniqueTags).map((tag) => ({
    url: `${baseUrl}/topic/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // 4. Static Pages
  const staticEntries = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
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
      priority: 0.3,
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
