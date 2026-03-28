"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBanner from "../components/StatusBanner";
import { getErrorMessage, parseResponseOrThrow } from "../lib/http";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" });

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: "", type: "" });

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

      const data = await parseResponseOrThrow(
        res,
        "Login failed. Check your email and password and try again."
      );

      if (data.role) localStorage.setItem("role", data.role);
      if (data.name) localStorage.setItem("userName", data.name);

      if (data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard/create";
      }
    } catch (err) {
      console.error("Login Error:", err);
      setStatus({
        text: getErrorMessage(
          err,
          "We could not sign you in right now. Please try again."
        ),
        type: "error",
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-b bg-[#F3F2EC] p-4 font-sans">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-8 rounded-xl">
        <h1 className="unbounded-900 text-3xl mb-6 text-black">Writer Login</h1>

        <StatusBanner
          message={status.text}
          type={status.type}
          className="mb-4"
          onDismiss={() => setStatus({ text: "", type: "" })}
        />

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
              className="w-full border-2 border-black text-black p-3 rounded-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_#A259FF] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
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
            {"<-"} Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
