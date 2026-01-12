// app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function proxyFormData(req: NextRequest, blogId: string) {
  try {
    const body = await req.arrayBuffer();

    const headers = new Headers(req.headers);
    headers.set("cookie", req.headers.get("cookie") || "");
    headers.delete("content-length");

    const url = `${API_BASE}/blogs/${blogId}`;

    const apiRes = await fetch(url, {
      method: "PUT",
      headers,
      body,
    });

    const text = await apiRes.text();

    try {
      return NextResponse.json(JSON.parse(text), {
        status: apiRes.status,
      });
    } catch {
      return new NextResponse(text, { status: apiRes.status });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing blog ID" },
      { status: 400 }
    );
  }

  return proxyFormData(req, id);
}
