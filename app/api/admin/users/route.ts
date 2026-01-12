// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";

  const res = await fetch(`${API_BASE}/admin/users`, {
    headers: {
      cookie, // 🔥 forward cookie manually
    },
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
