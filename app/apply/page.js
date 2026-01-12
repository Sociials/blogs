"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to apply");

      alert("Application Submitted! Wait for approval.");
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F2EC] p-4">
      <div className="max-w-md w-full bg-white border-2 border-black shadow-[4px_4px_0px_#000] p-8 rounded-xl">
        <h1 className="unbounded-900 text-3xl mb-2">Join the Team</h1>
        <p className="text-gray-500 mb-6">Apply to become a writer.</p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 text-sm font-bold border-2 border-red-500 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Full Name
            </label>
            <input
              name="name"
              required
              type="text"
              className="w-full border-2 border-black p-2 rounded focus:outline-none focus:shadow-[2px_2px_0px_#A259FF]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Email
            </label>
            <input
              name="email"
              required
              type="email"
              className="w-full border-2 border-black p-2 rounded focus:outline-none focus:shadow-[2px_2px_0px_#A259FF]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase mb-1">
              Password
            </label>
            <input
              name="password"
              required
              type="password"
              className="w-full border-2 border-black p-2 rounded focus:outline-none focus:shadow-[2px_2px_0px_#A259FF]"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded border-2 border-black hover:bg-[#A259FF] transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit Application"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm font-bold">
          Already a writer?{" "}
          <Link href="/login" className="underline hover:text-[#A259FF]">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
