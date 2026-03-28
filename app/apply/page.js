"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StatusBanner from "../components/StatusBanner";
import { getErrorMessage, parseResponseOrThrow } from "../lib/http";

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: "", type: "" });

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await parseResponseOrThrow(
        res,
        "We could not submit your application. Please try again."
      );

      setStatus({
        text: "Application submitted. We will review it and get back to you.",
        type: "success",
      });

      setTimeout(() => {
        router.push("/");
      }, 900);
    } catch (err) {
      setStatus({
        text: getErrorMessage(
          err,
          "We could not submit your application. Please try again."
        ),
        type: "error",
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F2EC] p-4 font-sans">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-8 rounded-xl">
        <h1 className="unbounded-900 text-3xl mb-2 text-black">
          Join the Team
        </h1>
        <p className="text-gray-500 mb-6 font-bold text-sm">
          Apply to become a writer.
        </p>

        <StatusBanner
          message={status.text}
          type={status.type}
          className="mb-4"
          onDismiss={() => setStatus({ text: "", type: "" })}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
              Full Name
            </label>
            <input
              name="name"
              required
              type="text"
              className="w-full bg-white border-2 border-black text-black p-2 rounded font-bold focus:outline-none focus:shadow-[2px_2px_0px_#A259FF]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
              Email
            </label>
            <input
              name="email"
              required
              type="email"
              className="w-full bg-white border-2 border-black text-black p-2 rounded font-bold focus:outline-none focus:shadow-[2px_2px_0px_#A259FF]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1 text-gray-500">
              Password
            </label>
            <input
              name="password"
              required
              type="password"
              className="w-full bg-white border-2 border-black text-black p-2 rounded font-bold focus:outline-none focus:shadow-[2px_2px_0px_#A259FF]"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded border-2 border-black hover:bg-[#A259FF] transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit Application"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm font-bold text-black">
          Already a writer?{" "}
          <Link href="/login" className="underline hover:text-[#A259FF]">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
