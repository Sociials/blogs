// app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function proxyFormData(req: NextRequest, blogId: string) {
  try {
    const body = await req.arrayBuffer();
    const headers = new Headers(req.headers);
    headers.set("cookie", req.headers.get("cookie") || "");
    headers.delete("content-length"); // let fetch handle it

    const url = `${API_BASE}/blogs/${blogId}`;

    const apiRes = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    const text = await apiRes.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: apiRes.status });
    } catch {
      return new NextResponse(text, { status: apiRes.status });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { blogId: string } }) {
  const { blogId } =await params;
  console.log("Params",await params)
  if (!blogId) return NextResponse.json({ error: "Missing blog ID" }, { status: 400 });
  return proxyFormData(req, blogId);
}
