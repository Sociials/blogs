import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function normalizeProxyResponse(apiRes: Response) {
  const text = await apiRes.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return NextResponse.json(
      apiRes.ok ? { success: true } : { error: "Empty response from upstream service." },
      { status: apiRes.status }
    );
  }

  try {
    return NextResponse.json(JSON.parse(trimmed), {
      status: apiRes.status,
    });
  } catch {
    const isHtml = /^\s*<!doctype html>|^\s*<html/i.test(trimmed);
    const fallbackMessage = isHtml
      ? "Upstream service returned HTML instead of JSON."
      : trimmed;

    return NextResponse.json(
      apiRes.ok
        ? { success: true, message: fallbackMessage }
        : { error: fallbackMessage || "Request failed" },
      { status: apiRes.status }
    );
  }
}

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

    return normalizeProxyResponse(apiRes);
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

    return normalizeProxyResponse(apiRes);
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
