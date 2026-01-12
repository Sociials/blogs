import { MetadataRoute } from 'next';

// Refresh sitemap every 24 hours
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://blogs.sociials.com"; 
  // ensure this env var is set in Vercel/Next.js environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; 

  let blogs: any[] = [];
  
  // 1. Fetch Dynamic Data from Cloudflare Worker
  try {
    // We use your existing '/feed' endpoint which returns all blogs
    const res = await fetch(`${apiUrl}/feed`, {
      next: { revalidate: 86400 } // Cache this request for 24h
    });
    
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    blogs = await res.json();
  } catch (err) {
    console.error("❌ Sitemap Error: Failed to fetch blogs from API", err);
    // Fallback: If API fails, we still return static pages so the build doesn't crash
    blogs = [];
  }

  // 2. Generate Blog Entries
  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/post/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Generate Tag Entries (Extract unique tags from blog list)
  // Assuming 'tags' in DB is a comma-separated string like "tech, coding, nextjs"
  const uniqueTags = new Set<string>();
  
  blogs.forEach((blog) => {
    if (blog.tags) {
      // Split by comma, trim whitespace, and add to Set
      blog.tags.split(',').map((t: string) => t.trim()).forEach((t: string) => {
        if (t) uniqueTags.add(t);
      });
    }
  });

  const tagEntries: MetadataRoute.Sitemap = Array.from(uniqueTags).map((tag) => ({
    url: `${baseUrl}/topic/${encodeURIComponent(tag)}`, // Clean URL for tags
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // 4. Static Pages
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...blogEntries, ...tagEntries];
}