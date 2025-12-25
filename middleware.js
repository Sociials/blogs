// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the admin cookie
  const adminToken = request.cookies.get("admin_token");

  // If user is trying to access /admin AND doesn't have the token
  if (request.nextUrl.pathname.startsWith("/admin") && !adminToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Tell Next.js to only run this middleware on /admin routes
export const config = {
  matcher: "/admin/:path*",
};
