import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function PUT(
  req: NextRequest,
  // 1. Change type to a Promise to match Next.js 2026 requirements
  context: { params: Promise<{ id: string }> } 
) {
  // 2. Await the params
  const { id } = await context.params; 
  
  const body = await req.json();
  const cookie = req.headers.get("cookie") || "";

  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "cookie": cookie, // Forwarding the cookie string
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
