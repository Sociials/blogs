import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// GET /api/profile → proxy to backend /profile
export async function GET(req: NextRequest) {
    try {
        const headers = new Headers(req.headers);
        headers.set("cookie", req.headers.get("cookie") || "");

        const apiRes = await fetch(`${API_BASE}/profile`, {
            method: "GET",
            headers,
        });

        const text = await apiRes.text();
        try {
            return NextResponse.json(JSON.parse(text), { status: apiRes.status });
        } catch {
            return new NextResponse(text, { status: apiRes.status });
        }
    } catch (err) {
        console.error("GET PROFILE PROXY ERROR:", err);
        return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
    }
}

// PUT /api/profile → proxy FormData to backend /profile
export async function PUT(req: NextRequest) {
    try {
        const body = await req.arrayBuffer();
        const headers = new Headers(req.headers);
        headers.set("cookie", req.headers.get("cookie") || "");
        headers.delete("content-length");

        const apiRes = await fetch(`${API_BASE}/profile`, {
            method: "PUT",
            headers,
            body,
        });

        const text = await apiRes.text();
        try {
            return NextResponse.json(JSON.parse(text), { status: apiRes.status });
        } catch {
            return new NextResponse(text, { status: apiRes.status });
        }
    } catch (err) {
        console.error("PUT PROFILE PROXY ERROR:", err);
        return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
    }
}
