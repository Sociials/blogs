"use client";

const STARTER_TEMPLATES = [
  {
    id: "storytime",
    label: "Storytime",
    vibe: "Personal + relatable",
    title: "What shipping [thing] taught us about [lesson]",
    summary:
      "A quick story about a real moment, what changed after it, and the takeaway other builders can use.",
    tags: "product, creators, lessons",
    content: `## The moment

Set the scene in 2-3 lines. What happened? Why did it matter?

## What felt confusing

Be honest. What were you expecting, and what actually happened?

## What changed after that

Explain the decision, shift, or experiment that came next.

## The takeaway

Give one clear lesson a new creator or writer can steal today.`,
  },
  {
    id: "hot-take",
    label: "Hot Take",
    vibe: "Sharp + scroll-stopping",
    title: "[Popular advice] is overrated for early creators",
    summary:
      "A strong opinion with examples, nuance, and a practical takeaway for people starting out.",
    tags: "opinion, growth, creators",
    content: `## The take

Say the opinion clearly in one sentence.

## Why people believe the opposite

Show you understand the usual advice first.

## What you are seeing instead

Use 2-3 examples, screenshots, or moments from real work.

## The better move

End with a clear recommendation for someone starting from zero.`,
  },
  {
    id: "starter-guide",
    label: "Starter Guide",
    vibe: "Helpful + beginner-safe",
    title: "Start here: a simple guide to [topic]",
    summary:
      "A beginner-friendly breakdown that explains the basics fast, without sounding robotic or overcomplicated.",
    tags: "guide, beginner, tutorial",
    content: `## What this is

Explain the topic like you are talking to a smart friend who is new to it.

## Why it matters

What changes when someone understands this?

## The easiest way to begin

List 3 simple steps:

1. First step
2. Second step
3. Third step

## Common mistake

Call out one thing beginners usually get wrong.

## Keep this in mind

Leave the reader with one short confidence boost.`,
  },
  {
    id: "build-in-public",
    label: "Build In Public",
    vibe: "Transparent + internet-native",
    title: "What happened when we tried [experiment] for 7 days",
    summary:
      "A mini build-in-public update with context, numbers, and what you would do differently next time.",
    tags: "buildinpublic, experiment, growth",
    content: `## What we tried

Describe the experiment in one short paragraph.

## The numbers

Share the result, even if it was mid.

- Before:
- After:
- What surprised us:

## What worked

Name the part worth repeating.

## What flopped

Say what did not land and why.

## Next move

Tell readers what you are testing next.`,
  },
];

const HOOK_IDEAS = [
  "Here is the part nobody says out loud:",
  "If you are starting from zero, do this first:",
  "I thought this would be easy. It was not.",
  "The internet loves to overcomplicate this.",
];

export default function WriterStarterPanel({ formData, setFormData }) {
  const applyTemplate = (template) => {
    const hasDraft = [formData.title, formData.summary, formData.tags, formData.content].some(
      (value) => value?.trim()
    );

    if (
      hasDraft &&
      !window.confirm("Replace your current draft with this starter?")
    ) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      title: template.title,
      summary: template.summary,
      tags: template.tags,
      content: template.content,
    }));
  };

  const insertHook = (hook) => {
    setFormData((prev) => ({
      ...prev,
      content: prev.content?.trim() ? `${hook}\n\n${prev.content}` : `${hook}\n\n`,
    }));
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] space-y-5">
      <div className="space-y-2">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A259FF]">
          First Post Help
        </p>
        <h2 className="text-xl md:text-2xl font-black leading-tight">
          Write like a real person, not a school essay
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          New writers do better when they keep it simple: one idea, one example,
          one clear takeaway. Pick a starter, tweak it, and make it sound like you.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {STARTER_TEMPLATES.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => applyTemplate(template)}
            className="text-left rounded-2xl border-2 border-black bg-[#F7F4EA] p-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-black text-sm">{template.label}</span>
              <span className="text-[10px] font-bold uppercase text-gray-500">
                {template.vibe}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {template.title}
            </p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <p className="text-xs font-black uppercase text-gray-600">
          Hook ideas
        </p>
        <div className="flex flex-wrap gap-2">
          {HOOK_IDEAS.map((hook) => (
            <button
              key={hook}
              type="button"
              onClick={() => insertHook(hook)}
              className="rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-black hover:text-black transition-colors"
            >
              {hook}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3 text-sm">
        <div className="rounded-xl bg-[#FFF3D6] border border-[#E6D29A] p-3">
          <p className="font-black mb-1">1. Start messy</p>
          <p className="text-gray-700">
            Do not wait for perfect. A rough draft beats a blank screen every time.
          </p>
        </div>
        <div className="rounded-xl bg-[#EAFBF4] border border-[#B8EBCF] p-3">
          <p className="font-black mb-1">2. Keep it readable</p>
          <p className="text-gray-700">
            Short paragraphs, honest language, and one strong takeaway land better.
          </p>
        </div>
        <div className="rounded-xl bg-[#EEF3FF] border border-[#C8D6FF] p-3">
          <p className="font-black mb-1">3. Give a point of view</p>
          <p className="text-gray-700">
            Readers remember a clear opinion or lesson more than generic advice.
          </p>
        </div>
      </div>
    </div>
  );
}
