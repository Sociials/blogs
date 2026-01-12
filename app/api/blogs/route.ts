// app/api/blogs/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function proxyFormData(req: NextRequest, method: "POST") {
  try {
    // preserve FormData body
    const body = await req.arrayBuffer();
    const headers = new Headers(req.headers);
    headers.set("cookie", req.headers.get("cookie") || "");
    headers.delete("content-length"); // let fetch handle it

    // Determine target URL
    let url = `${API_BASE}/blogs`;
   

    const apiRes = await fetch(url, {
      method,
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

// --- Named exports per HTTP method ---
export async function POST(req: NextRequest) {
  return proxyFormData(req, "POST");
}


