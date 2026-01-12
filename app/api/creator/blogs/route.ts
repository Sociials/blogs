import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/* ---------------------------
   POST → FormData (image upload)
---------------------------- */
async function proxyFormData(req: NextRequest) {
  try {
    const body = await req.arrayBuffer();

    const headers = new Headers(req.headers);
    headers.set("cookie", req.headers.get("cookie") || "");
    headers.delete("content-length"); // critical

    const apiRes = await fetch(
      `${API_BASE}/creator/blogs`,
      {
        method: "POST",
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
    console.error("POST CREATOR BLOG PROXY ERROR:", err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}

/* ---------------------------
   GET → JSON
---------------------------- */
async function proxyJSON(req: NextRequest) {
  try {
    const headers = new Headers(req.headers);
    headers.set("cookie", req.headers.get("cookie") || "");

    const apiRes = await fetch(
      `${API_BASE}/creator/blogs`,
      {
        method: "GET",
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
    console.error("GET CREATOR BLOGS PROXY ERROR:", err);
    return NextResponse.json(
      { error: "Proxy failed" },
      { status: 500 }
    );
  }
}

/* ---------------------------
   Route handlers
---------------------------- */

export async function GET(req: NextRequest) {
  return proxyJSON(req);
}

export async function POST(req: NextRequest) {
  return proxyFormData(req);
}
