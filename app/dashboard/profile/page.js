"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBanner from "../../components/StatusBanner";
import {
  getErrorMessage,
  parseResponseOrThrow,
  readResponseBody,
} from "../../lib/http";

function normalizeSociialsBioLink(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const withProtocol = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  let url;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new Error("Sociials bio link must be a valid URL");
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname !== "sociials.com" && hostname !== "www.sociials.com") {
    throw new Error("Only sociials.com/username links are allowed");
  }

  if (url.search || url.hash) {
    throw new Error("Sociials bio link cannot include query params or fragments");
  }

  const pathSegments = url.pathname.split("/").filter(Boolean);
  if (pathSegments.length !== 1) {
    throw new Error("Sociials bio link must look like sociials.com/username");
  }

  return `https://sociials.com/${pathSegments[0]}`;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/profile");
        const data = await readResponseBody(res);

        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/login";
            return;
          }

          throw new Error(
            getErrorMessage(data, "We could not load your profile.")
          );
        }

        setProfile(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setAvatarPreview(data.avatar || null);

        if (data.socialLinks) {
          try {
            const links = JSON.parse(data.socialLinks);
            setWebsite(links.website || "");
          } catch {}
        }
      } catch (err) {
        console.error(err);
        setMsg({
          text: getErrorMessage(
            err,
            "We could not load your profile. Refresh and try again."
          ),
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: "", type: "" });

    let normalizedWebsite = "";
    try {
      normalizedWebsite = normalizeSociialsBioLink(website);
    } catch (err) {
      setMsg({ text: err.message, type: "error" });
      return;
    }

    setSaving(true);

    const payload = new FormData();
    payload.append("name", name);
    payload.append("bio", bio);
    payload.append(
      "socialLinks",
      JSON.stringify({
        website: normalizedWebsite || undefined,
      })
    );

    if (avatarFile) {
      payload.append("avatar", avatarFile);
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        body: payload,
      });

      await parseResponseOrThrow(
        res,
        "We could not save your profile changes."
      );

      localStorage.setItem("userName", name);
      setMsg({ text: "Profile updated.", type: "success" });
    } catch (err) {
      setMsg({
        text: getErrorMessage(
          err,
          "We could not save your profile changes."
        ),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F2EC] flex items-center justify-center">
        <div className="text-gray-500 font-bold animate-pulse text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F2EC] text-black font-sans">
      <nav className="bg-white border-b-2 border-black sticky top-0 z-50 px-4 md:px-6">
        <div className="flex justify-between items-center h-14 max-w-4xl mx-auto">
          <Link
            href="/dashboard/create"
            className="font-bold text-sm hover:text-[#A259FF] transition-colors inline-flex items-center gap-1.5"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <h1 className="unbounded-900 text-lg">My Profile</h1>
          <div className="w-20" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
            <label className="text-xs font-bold uppercase text-gray-500 mb-3 block">
              Profile Photo
            </label>
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full border-2 border-black shadow-[3px_3px_0px_#000] overflow-hidden bg-gray-100 flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-black text-gray-300">
                      {name
                        ? name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "?"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="relative border-2 border-dashed border-black rounded-xl p-3 text-center cursor-pointer hover:bg-gray-50 hover:border-[#A259FF] transition-colors group">
                  <span className="text-xs font-bold group-hover:text-[#A259FF]">
                    {avatarFile ? (
                      avatarFile.name
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                        Upload Photo
                      </span>
                    )}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  JPG, PNG. Recommended 200 x 200 px.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                Display Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-2 border-black rounded-lg p-3 font-bold focus:outline-none focus:shadow-[3px_3px_0px_#A259FF] transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={profile?.email || ""}
                disabled
                className="w-full border-2 border-gray-200 rounded-lg p-3 text-gray-400 bg-gray-50 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Email cannot be changed.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">
                Bio
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell readers a little about yourself..."
                className="w-full border-2 border-black rounded-lg p-3 text-sm resize-none focus:outline-none focus:shadow-[3px_3px_0px_#A259FF] transition-all"
                maxLength={300}
              />
              <p className="text-[10px] text-gray-400 text-right">
                {bio.length}/300
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
            <h3 className="text-xs font-bold uppercase text-gray-500">Bio Link</h3>

            <div className="flex items-center gap-3">
              <span className="w-6 flex justify-center text-gray-500">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="sociials.com/username"
                  className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm focus:border-black focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  One link only. Use `sociials.com/username`.
                </p>
              </div>
            </div>
          </div>

          {profile?.id && (
            <div className="bg-gray-100 border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Your public author page
                </span>
              </span>
              <Link
                href={`/author/${profile.id}`}
                className="text-xs font-bold bg-white px-4 py-2 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all inline-flex items-center gap-1.5"
              >
                View Page
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#15F5BA] text-black border-2 border-black py-4 rounded-xl font-black text-lg hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {saving ? "SAVING..." : "SAVE PROFILE"}
          </button>

          <StatusBanner
            message={msg.text}
            type={msg.type}
            onDismiss={() => setMsg({ text: "", type: "" })}
          />
        </form>
      </main>
    </div>
  );
}
