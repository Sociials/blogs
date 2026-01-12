import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const workerRes = await fetch("http://127.0.0.1:8787/auth/login", {
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
