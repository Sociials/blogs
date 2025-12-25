import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import Blog from "../../../model/Blog";

// GET: Fetch all blogs
export async function GET() {
  await dbConnect();
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }); // Newest first
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// POST: Create a new blog
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const blog = await Blog.create(body);
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();

    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    await dbConnect();

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(
      { message: "Updated", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
