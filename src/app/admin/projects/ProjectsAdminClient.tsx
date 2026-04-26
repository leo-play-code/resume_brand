"use client";

import { useState, useTransition } from "react";
import type { Project } from "@prisma/client";
import { Trash2, Plus, X } from "lucide-react";
import SkillPicker from "@/components/ui/SkillPicker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type HeroType = "mp4" | "js-demo";

interface Props {
  projects: Project[];
  addProject: (formData: FormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export default function ProjectsAdminClient({
  projects,
  addProject,
  deleteProject,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [heroType, setHeroType] = useState<HeroType>("mp4");

  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    startTransition(() => deleteProject(id));
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await addProject(formData);
      setShowForm(false);
      setHeroType("mp4");
    });
  }

  return (
    <div>
      <div className="space-y-3 mb-6">
        {projects.length === 0 && (
          <p className="text-fg-35 text-sm py-6 text-center border border-dashed border-theme rounded-xl">
            No projects yet. Add your first one below.
          </p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-theme bg-surface"
          >
            <div className="flex-1 min-w-0">
              <p className="text-fg text-sm font-medium truncate">{p.name}</p>
              <p className="text-fg-35 text-xs truncate">{p.description}</p>
            </div>
            {p.featured && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-mono shrink-0">
                featured
              </span>
            )}
            <button
              onClick={() => handleDelete(p.id)}
              disabled={isPending}
              className="p-1.5 text-fg-25 hover:text-red-400 transition-colors shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/[0.06] transition-all duration-200"
        >
          <Plus size={16} />
          Add Project
        </button>
      ) : (
        <form
          action={handleAdd}
          className="border border-theme bg-surface rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-fg font-medium">New Project</h3>
            <button
              type="button"
              onClick={() => { setShowForm(false); setHeroType("mp4"); }}
              className="text-fg-35 hover:text-fg"
            >
              <X size={18} />
            </button>
          </div>

          <Field label="Name *" name="name" required />
          <Field label="Short description (tagline) *" name="description" required />
          <Field label="Long description (2-3 sentences)" name="long_description" type="textarea" />
          {/* Hero Type selector */}
          <input type="hidden" name="hero_type" value={heroType} />
          <div>
            <label className="block text-fg-50 text-xs mb-1.5">Hero Type</label>
            <div className="flex gap-2">
              {(["mp4", "js-demo"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setHeroType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    heroType === t
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-theme bg-surface text-fg-50 hover:text-fg"
                  }`}
                >
                  {t === "mp4" ? "🎥 MP4 Video" : "⚡ JS Component"}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional hero content field */}
          {heroType === "mp4" ? (
            <Field label="Video URL (e.g. /videos/demo.mp4)" name="video_url" />
          ) : (
            <div>
              <label className="block text-fg-50 text-xs mb-1.5">
                JS Component Code
                <span className="text-fg-25 ml-1 font-mono">(ESM, must have export default)</span>
              </label>
              <textarea
                name="hero_js_code"
                rows={10}
                placeholder={`import React from 'react';\n\nexport default function MyComponent() {\n  return <div>Hello</div>;\n}`}
                className="w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-xs placeholder:text-fg-25 focus:outline-none focus:border-purple-500/50 resize-y font-mono"
              />
              <p className="text-fg-25 text-xs mt-1 font-mono">
                Imports: react, framer-motion, lucide-react 均透過 CDN 自動載入
              </p>
            </div>
          )}
          <Field label="GitHub URL" name="github_url" type="url" />
          <Field label="Live URL" name="live_url" type="url" />
          <div>
            <label className="block text-fg-50 text-xs mb-1.5">Tech Stack</label>
            <SkillPicker name="tech_stack" />
          </div>
          <Field label="Display order (0 = first)" name="display_order" type="number" />

          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" name="featured" className="accent-purple-500" />
            <label htmlFor="featured" className="text-fg-60 text-sm">
              Featured project
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? <><LoadingSpinner size="sm" /><span>Saving…</span></> : "Save Project"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setHeroType("mp4"); }}
              className="px-5 py-2 rounded-lg border border-theme text-fg-50 hover:text-fg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  const base =
    "w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-sm placeholder:text-fg-20 focus:outline-none focus:border-purple-500/50";

  return (
    <div>
      <label className="block text-fg-50 text-xs mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea name={name} rows={3} className={`${base} resize-none`} />
      ) : (
        <input type={type} name={name} required={required} className={base} />
      )}
    </div>
  );
}
