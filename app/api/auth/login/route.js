import { NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_URL;
export async function POST(req) {
  const body = await req.json();

  const workerRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await workerRes.json();

  // Forward response
  const response = NextResponse.json(data, {
    status: workerRes.status,
  });

  // 🔥 Forward Set-Cookie from Worker → Browser
  const setCookie = workerRes.headers.get("set-cookie");
  console.log("Set Cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
