// app/api/auth/login/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  // Check against an Environment Variable (Add this to your .env.local file)
  if (body.password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });

    // Set a cookie named "admin_token" that lasts for 1 day
    response.cookies.set("admin_token", "authenticated", {
      httpOnly: true, // Client-side JS cannot read this (secure)
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
