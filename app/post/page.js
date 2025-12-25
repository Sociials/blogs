import Link from "next/link";
import dbConnect from "../../lib/db";
import Blog from "../../model/Blog";

// This ensures the page always fetches fresh data when visited
export const dynamic = "force-dynamic";

async function getBlogs() {
  await dbConnect();
  // .lean() converts the Mongoose document to a plain JavaScript object
  const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
  return blogs;
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  // Brand Colors for rotation (Purple, Pink, Yellow, Mint)
  const hoverColors = [
    "hover:shadow-[8px_8px_0px_#A259FF]",
    "hover:shadow-[8px_8px_0px_#FF00A8]",
    "hover:shadow-[8px_8px_0px_#F4D35E]",
    "hover:shadow-[8px_8px_0px_#15F5BA]",
  ];

  return (
    <div className="min-h-screen bg-[#F3F2EC] py-12 px-6 font-sans text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="unbounded-900 text-4xl sm:text-5xl mb-12 text-center">
          Sociials{" "}
          <span className="yesteryear-regular text-[#A259FF] font-normal">
            Blog
          </span>
        </h1>

        {blogs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-400 rounded-[20px]">
            <p className="text-gray-500 font-medium">No blogs posted yet.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {blogs.map((blog, index) => {
              // Cycle through the brand colors
              const hoverClass = hoverColors[index % hoverColors.length];

              return (
                <div
                  key={blog._id}
                  className={`
                    bg-white p-6 sm:p-8 
                    rounded-[20px] border-2 border-black 
                    shadow-[4px_4px_0px_#000] 
                    transition-all duration-300 
                    hover:-translate-y-1 
                    ${hoverClass}
                  `}
                >
                  <Link href={`/post/${blog.slug}`}>
                    <h2 className="unbounded-900 text-2xl sm:text-3xl mb-3 cursor-pointer hover:underline decoration-2 underline-offset-4">
                      {blog.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {blog.summary}
                  </p>

                  <div className="flex justify-between items-center text-sm font-bold">
                    {/* Date Pill */}
                    <span className="bg-black text-white px-3 py-1 rounded-md uppercase tracking-wider text-xs">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>

                    {/* Read More Arrow */}
                    <Link
                      href={`/post/${blog.slug}`} // Fixed: Changed from /blog/ to /post/
                      className="group flex items-center hover:underline decoration-2 underline-offset-4"
                    >
                      Read more
                      <svg
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
