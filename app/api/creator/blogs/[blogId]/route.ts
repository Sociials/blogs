import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

/* ---------------------------
   PUT → FormData (image upload)
---------------------------- */
async function proxyFormData(
  req: NextRequest,
  blogId: string
) {
  try {
    const body = await req.arrayBuffer();

    const headers = new Headers(req.headers);
    headers.set("cookie", req.headers.get("cookie") || "");
    headers.delete("content-length"); // critical

    const apiRes = await fetch(
      `${API_BASE}/creator/blogs/${blogId}`,
      {
        method: "PUT",
        headers,
        body,
      }
    );

    const text = await apiRes.text();

    try {
      return NextResponse.json(JSON.parse(text), {
        status: apiRes.status,
      });
    } catch {
      return new NextResponse(text, {
        status: apiRes.status,
      });
    }
  } catch (err) {
    console.error("PUT CREATOR BLOG PROXY ERROR:", err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}

/* ---------------------------
   GET / DELETE → JSON
---------------------------- */
async function proxyJSON(
  req: NextRequest,
  method: "GET" | "DELETE",
  blogId: string
) {
  try {
    const headers = new Headers(req.headers);
    headers.set("cookie", req.headers.get("cookie") || "");

    const apiRes = await fetch(
      `${API_BASE}/creator/blogs/${blogId}`,
      {
        method,
        headers,
      }
    );

    const text = await apiRes.text();

    try {
      return NextResponse.json(JSON.parse(text), {
        status: apiRes.status,
      });
    } catch {
      return new NextResponse(text, {
        status: apiRes.status,
      });
    }
  } catch (err) {
    console.error("JSON CREATOR BLOG PROXY ERROR:", err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}

/* ---------------------------
   Route handlers
---------------------------- */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { error: "Missing blog ID" },
      { status: 400 }
    );
  }

  return proxyJSON(req, "GET", params.id);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { blogId: string } }
) {
  const { blogId} = await params

  console.log(blogId,await params)
  if (!blogId) {
    return NextResponse.json(
      { error: "Missing blog ID" },
      { status: 400 }
    );
  }

  return proxyFormData(req, blogId);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { blogId: string } }
) {
  const {blogId} = await params;
  if (!blogId) {
    return NextResponse.json(
      { error: "Missing blog ID" },
      { status: 400 }
    );
  }

  return proxyJSON(req, "DELETE",blogId);
}
