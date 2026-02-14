"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });

    // Form state
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [twitter, setTwitter] = useState("");
    const [instagram, setInstagram] = useState("");
    const [website, setWebsite] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Fetch profile
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/profile");
                if (!res.ok) {
                    if (res.status === 401) {
                        window.location.href = "/login";
                        return;
                    }
                    throw new Error("Failed to load profile");
                }
                const data = await res.json();
                setProfile(data);
                setName(data.name || "");
                setBio(data.bio || "");
                setAvatarPreview(data.avatar || null);

                // Parse social links
                if (data.socialLinks) {
                    try {
                        const links = JSON.parse(data.socialLinks);
                        setTwitter(links.twitter || "");
                        setInstagram(links.instagram || "");
                        setWebsite(links.website || "");
                    } catch { }
                }
            } catch (err) {
                console.error(err);
                setMsg({ text: "Failed to load profile", type: "error" });
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMsg({ text: "", type: "" });

        const payload = new FormData();
        payload.append("name", name);
        payload.append("bio", bio);
        payload.append(
            "socialLinks",
            JSON.stringify({
                twitter: twitter || undefined,
                instagram: instagram || undefined,
                website: website || undefined,
            })
        );
        if (avatarFile) payload.append("avatar", avatarFile);

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                body: payload,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save");
            }

            // Update localStorage name if changed
            localStorage.setItem("userName", name);

            setMsg({ text: "✅ Profile updated!", type: "success" });
        } catch (err) {
            setMsg({ text: `❌ ${err.message}`, type: "error" });
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
            {/* Header */}
            <nav className="bg-white border-b-2 border-black sticky top-0 z-50 px-4 md:px-6">
                <div className="flex justify-between items-center h-14 max-w-4xl mx-auto">
                    <Link
                        href="/dashboard/create"
                        className="font-bold text-sm hover:text-[#A259FF] transition-colors"
                    >
                        ← Dashboard
                    </Link>
                    <h1 className="unbounded-900 text-lg">My Profile</h1>
                    <div className="w-20" />
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
                        <label className="text-xs font-bold uppercase text-gray-500 mb-3 block">
                            Profile Photo
                        </label>
                        <div className="flex items-center gap-5">
                            {/* Avatar preview */}
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
                                                    .map((w) => w[0])
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
                                        {avatarFile ? avatarFile.name : (<span className="inline-flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg> Upload Photo</span>)}
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
                                    JPG, PNG. Recommended 200×200px.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
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

                    {/* Social Links */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-4">
                        <h3 className="text-xs font-bold uppercase text-gray-500">
                            Social Links
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="w-6 flex justify-center text-gray-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></span>
                                <input
                                    type="text"
                                    value={twitter}
                                    onChange={(e) => setTwitter(e.target.value)}
                                    placeholder="twitter.com/username"
                                    className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 text-sm focus:border-black focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-6 flex justify-center text-gray-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></span>
                                <input
                                    type="text"
                                    value={instagram}
                                    onChange={(e) => setInstagram(e.target.value)}
                                    placeholder="instagram.com/username"
                                    className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 text-sm focus:border-black focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-6 flex justify-center text-gray-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg></span>
                                <input
                                    type="text"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    placeholder="yourwebsite.com"
                                    className="flex-1 border-2 border-gray-200 rounded-lg p-2.5 text-sm focus:border-black focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Author Page Preview Link */}
                    {profile?.id && (
                        <div className="bg-gray-100 border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-600">
                                <span className="inline-flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg> Your public author page</span>
                            </span>
                            <Link
                                href={`/author/${profile.id}`}
                                className="text-xs font-bold bg-white px-4 py-2 rounded-lg border-2 border-black hover:bg-black hover:text-white transition-all"
                            >
                                View Page →
                            </Link>
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-[#15F5BA] text-black border-2 border-black py-4 rounded-xl font-black text-lg hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-all disabled:opacity-50"
                    >
                        {saving ? "SAVING..." : "SAVE PROFILE"}
                    </button>

                    {msg.text && (
                        <div
                            className={`p-4 rounded-xl text-sm font-bold text-center border-2 ${msg.type === "error"
                                ? "bg-red-50 border-red-300 text-red-800"
                                : "bg-green-50 border-green-300 text-green-800"
                                }`}
                        >
                            {msg.text}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}
