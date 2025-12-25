// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // This command deletes the cookie
  response.cookies.delete("admin_token");

  return response;
}
