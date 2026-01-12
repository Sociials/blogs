"use client";
import { useState } from "react";
import Link from "next/link"; // Recommended for the "Back" button or footer links
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Success! The Cookie is now safely stored in the browser (HttpOnly).

      // Store public info for UI (like "Welcome, Admin")
      // Do NOT store the token here.
      if (data.role) localStorage.setItem("role", data.role);
      if (data.name) localStorage.setItem("userName", data.name);

      console.log("Login success, redirecting...");

      // 🔄 Force Hard Redirect to ensure Middleware/Server sees the new Cookie
      if (data.role === "admin") {
        console.log("Here");

        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard/create";
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
      setLoading(false); // Only stop loading on error
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-b bg-[#F3F2EC] p-4 font-sans">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-8 rounded-xl">
        <h1 className="unbounded-900 text-3xl mb-6 text-black">Writer Login</h1>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-600 font-bold p-3 mb-4 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="you@sociials.com"
              required
              className="w-full border-2 border-black text-black   p-3 rounded-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full border-2 border-black p-3 text-black rounded-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#15F5BA] text-black font-black py-4 rounded-lg border-2 border-black hover:bg-[#A259FF] hover:text-white hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "AUTHENTICATING..." : "ENTER DASHBOARD"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-bold text-gray-400 hover:text-black underline decoration-2 underline-offset-4"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
