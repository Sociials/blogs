// app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Send password to our API
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      // If success, redirect to admin dashboard
      router.push("/admin");
    } else {
      setError("Invalid Password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F2EC] font-sans text-black px-4">
      {/* --- Main Card --- */}
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[30px] border-2 border-black shadow-[8px_8px_0px_#000]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="unbounded-900 text-3xl sm:text-4xl mb-2">
            Admin <span className="text-[#A259FF]">Login</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Enter your password to access the dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full p-4 bg-white border-2 border-black rounded-xl focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-100 border-2 border-black text-red-900 px-4 py-2 rounded-lg font-bold text-center text-sm shadow-[2px_2px_0px_#000]">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-2 w-full bg-black text-white font-bold text-lg py-4 rounded-xl border-2 border-black hover:bg-[#A259FF] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 active:translate-y-0 transition-all"
          >
            Login
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm font-bold text-gray-400 hover:text-black hover:underline decoration-2 underline-offset-4 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
