// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const cookie = req.headers.get("cookie") || "";
  const body = await req.json();
const{ id }= await params
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
// app/api/blogs/[id]/route.ts

