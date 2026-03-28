import Link from "next/link";

function Action({
  href,
  label,
  tone = "light",
}: {
  href: string;
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border-2 border-black px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] ${
        tone === "dark"
          ? "bg-black text-white hover:bg-[#A259FF]"
          : "bg-white text-black"
      }`}
    >
      {label}
    </Link>
  );
}

function DraftLine({
  width,
  faded = false,
  thick = false,
}: {
  width: string;
  faded?: boolean;
  thick?: boolean;
}) {
  return (
    <div
      className={`rounded-full ${
        thick ? "h-4" : "h-3"
      } ${faded ? "bg-[linear-gradient(90deg,#111_0%,#111_45%,rgba(17,17,17,0.15)_78%,rgba(17,17,17,0)_100%)]" : "bg-black/85"}`}
      style={{ width }}
    />
  );
}

export default function NotFoundPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F5EEDF] text-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.18)_48%,rgba(245,238,223,0)_82%)]" />
        <div className="absolute left-[-5rem] top-10 h-44 w-44 rounded-full bg-[#15F5BA]/12 blur-3xl" />
        <div className="absolute right-[-5rem] top-20 h-52 w-52 rounded-full bg-[#FFD84D]/18 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 md:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <section>
            <Link
              href="/"
              className="unbounded-900 text-lg tracking-tight text-black transition-colors hover:text-[#A259FF]"
            >
              Sociials<span className="text-gray-300">.</span>Blog
            </Link>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
              <span className="inline-block h-2 w-2 rounded-full bg-black" />
              Missing Manuscript / 404
            </div>

            <h1 className="mt-6 max-w-xl text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-7xl">
              This page lost its train of thought.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 md:text-lg">
              The draft began well, the cursor moved, then the writing just...
              stopped. What survived is a title, a few lines, and a very honest
              `404`.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Action href="/" label="Go Home" tone="dark" />
              <Action href="/explore" label="Explore Stories" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
              <Link
                href="/login"
                className="rounded-full border border-black/15 bg-white/75 px-4 py-2 transition-colors hover:text-[#A259FF]"
              >
                Writer Login
              </Link>
              <Link
                href="/apply"
                className="rounded-full border border-black/15 bg-white/75 px-4 py-2 transition-colors hover:text-[#A259FF]"
              >
                Become A Writer
              </Link>
              <span className="rounded-full border border-dashed border-black/15 px-4 py-2">
                Draft Unsent
              </span>
            </div>
          </section>

          <section className="relative">
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute inset-4 rotate-[3deg] rounded-[2.25rem] border-2 border-black bg-[#EDE3CF]" />

              <div className="absolute -left-2 top-6 rotate-[-8deg] rounded-full border-2 border-black bg-[#15F5BA] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] shadow-[4px_4px_0px_#000]">
                editor: needs actual page
              </div>

              <div className="absolute right-10 top-12 rotate-[7deg] rounded-full border-2 border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] shadow-[4px_4px_0px_#000]">
                filed under nowhere
              </div>

              <div className="relative rotate-[-2deg] rounded-[2.25rem] border-2 border-black bg-[#FFFDF8] shadow-[10px_10px_0px_#000]">
                <div className="flex items-center justify-between border-b-2 border-black px-6 py-4">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full border border-black bg-[#FF8A65]" />
                    <span className="h-3 w-3 rounded-full border border-black bg-[#FFD84D]" />
                    <span className="h-3 w-3 rounded-full border border-black bg-[#15F5BA]" />
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
                    Untitled Draft
                  </p>
                </div>

                <div
                  className="relative overflow-hidden rounded-b-[2.1rem] px-6 py-8 md:px-8 md:py-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, transparent 0 31px, rgba(17,17,17,0.06) 31px 32px)",
                  }}
                >
                  <div className="absolute inset-y-0 left-14 w-px bg-[linear-gradient(180deg,rgba(162,89,255,0)_0%,rgba(162,89,255,0.22)_15%,rgba(162,89,255,0.22)_85%,rgba(162,89,255,0)_100%)]" />

                  <div className="absolute right-0 top-0 h-24 w-24 overflow-hidden">
                    <div className="absolute right-[-38px] top-[-38px] h-24 w-24 rotate-45 border-2 border-black bg-[#F2E7CF]" />
                  </div>

                  <div className="relative pl-8 md:pl-10">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-gray-400">
                      Draft Opens Here
                    </p>

                    <div className="mt-5 max-w-2xl">
                      <div className="bg-[linear-gradient(90deg,#111_0%,#111_66%,rgba(17,17,17,0.25)_88%,rgba(17,17,17,0)_100%)] bg-clip-text text-4xl font-black leading-tight tracking-[-0.05em] text-transparent md:text-5xl">
                        I almost had something brilliant to say about this page
                      </div>
                    </div>

                    <div className="mt-8 space-y-5">
                      <DraftLine width="100%" />
                      <DraftLine width="94%" />
                      <DraftLine width="88%" />
                      <DraftLine width="78%" />
                      <DraftLine width="64%" faded />
                    </div>

                    <div className="mt-8 flex items-end gap-3">
                      <span className="text-5xl font-black tracking-[-0.07em] md:text-7xl">
                        404
                      </span>
                      <span className="mb-2 inline-block h-10 w-4 animate-pulse rounded-sm bg-black md:h-12" />
                    </div>

                    <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="rounded-[1.3rem] border border-dashed border-black/15 bg-[#F8F2E7] px-4 py-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
                          Best Next Move
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          Start again from home or steal a fresh idea from the
                          explore page.
                        </p>
                      </div>

                      <div className="rounded-[1.3rem] border-2 border-black bg-[#15F5BA] px-5 py-4 text-center shadow-[4px_4px_0px_#000]">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em]">
                          Status
                        </p>
                        <p className="mt-1 text-sm font-black uppercase tracking-[0.08em]">
                          Thought Missing
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-5 right-6 text-[10px] font-black uppercase tracking-[0.22em] text-gray-300">
                    page intentionally unfinished
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
