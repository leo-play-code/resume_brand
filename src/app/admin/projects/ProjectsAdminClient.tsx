"use client";

import { useState, useTransition } from "react";
import { upload } from "@vercel/blob/client";
import type { Project } from "@prisma/client";
import { Trash2, Plus, X, Pencil, Upload } from "lucide-react";
import SkillPicker from "@/components/ui/SkillPicker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type HeroType = "mp4" | "js-demo";

interface Props {
  projects: Project[];
  addProject: (formData: FormData) => Promise<void>;
  updateProject: (id: string, formData: FormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export default function ProjectsAdminClient({
  projects,
  addProject,
  updateProject,
  deleteProject,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [addHeroType, setAddHeroType] = useState<HeroType>("mp4");
  const [editHeroType, setEditHeroType] = useState<HeroType>("mp4");

  const [addVideoUrl, setAddVideoUrl] = useState("");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [uploadingFor, setUploadingFor] = useState<"add" | "edit" | null>(null);

  function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    startTransition(() => deleteProject(id));
  }

  function handleAdd(formData: FormData) {
    startTransition(async () => {
      await addProject(formData);
      setShowAddForm(false);
      setAddHeroType("mp4");
      setAddVideoUrl("");
    });
  }

  function handleStartEdit(project: Project) {
    setEditingId(project.id);
    setEditHeroType((project.heroType as HeroType) || "mp4");
    setEditVideoUrl(project.videoUrl || "");
    setShowAddForm(false);
  }

  function handleUpdate(formData: FormData) {
    if (!editingId) return;
    startTransition(async () => {
      await updateProject(editingId, formData);
      setEditingId(null);
      setEditVideoUrl("");
    });
  }

  async function handleVideoUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "add" | "edit"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setUploadingFor(target);
    try {
      const filename = `videos/${Date.now()}-${file.name}`;
      const blob = await upload(filename, file, {
        access: "public",
        handleUploadUrl: "/api/upload/video",
      });
      if (target === "add") setAddVideoUrl(blob.url);
      else setEditVideoUrl(blob.url);
    } catch (err) {
      alert("上傳失敗：" + String(err));
    } finally {
      setUploadingFor(null);
    }
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
          <div key={p.id}>
            <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-theme bg-surface">
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
                onClick={() =>
                  editingId === p.id ? setEditingId(null) : handleStartEdit(p)
                }
                disabled={isPending}
                className={`p-1.5 transition-colors shrink-0 ${
                  editingId === p.id
                    ? "text-purple-400"
                    : "text-fg-25 hover:text-purple-400"
                }`}
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                disabled={isPending}
                className="p-1.5 text-fg-25 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {editingId === p.id && (
              <form
                action={handleUpdate}
                className="border border-purple-500/30 bg-surface rounded-2xl p-6 space-y-4 mt-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-fg font-medium">Edit: {p.name}</h3>
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setEditVideoUrl(""); }}
                    className="text-fg-35 hover:text-fg"
                  >
                    <X size={18} />
                  </button>
                </div>

                <Field label="Name *" name="name" required defaultValue={p.name} />
                <Field
                  label="Short description (tagline) *"
                  name="description"
                  required
                  defaultValue={p.description}
                />
                <Field
                  label="Long description (2-3 sentences)"
                  name="long_description"
                  type="textarea"
                  defaultValue={p.longDescription}
                />
                <Field label="Name (EN, optional)" name="name_en" defaultValue={p.nameEn ?? ""} />
                <Field label="Short description (EN, optional)" name="description_en" defaultValue={p.descriptionEn ?? ""} />
                <Field label="Long description (EN, optional)" name="long_description_en" type="textarea" defaultValue={p.longDescriptionEn ?? ""} />

                <input type="hidden" name="hero_type" value={editHeroType} />
                <div>
                  <label className="block text-fg-50 text-xs mb-1.5">Hero Type</label>
                  <div className="flex gap-2">
                    {(["mp4", "js-demo"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setEditHeroType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                          editHeroType === t
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "border-theme bg-surface text-fg-50 hover:text-fg"
                        }`}
                      >
                        {t === "mp4" ? "🎥 MP4 Video" : "⚡ JS Component"}
                      </button>
                    ))}
                  </div>
                </div>

                {editHeroType === "mp4" ? (
                  <VideoUploadField
                    name="video_url"
                    value={editVideoUrl}
                    onChange={setEditVideoUrl}
                    uploading={uploadingFor === "edit"}
                    onFileChange={(e) => handleVideoUpload(e, "edit")}
                  />
                ) : (
                  <div>
                    <label className="block text-fg-50 text-xs mb-1.5">
                      JS Component Code
                      <span className="text-fg-25 ml-1 font-mono">
                        (ESM, must have export default)
                      </span>
                    </label>
                    <textarea
                      name="hero_js_code"
                      rows={10}
                      defaultValue={p.heroJsCode ?? ""}
                      className="w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-xs placeholder:text-fg-25 focus:outline-none focus:border-purple-500/50 resize-y font-mono"
                    />
                    <p className="text-fg-25 text-xs mt-1 font-mono">
                      Imports: react, framer-motion, lucide-react 均透過 CDN 自動載入
                    </p>
                  </div>
                )}

                <Field
                  label="GitHub URL"
                  name="github_url"
                  type="url"
                  defaultValue={p.githubUrl ?? ""}
                />
                <Field
                  label="Live URL"
                  name="live_url"
                  type="url"
                  defaultValue={p.liveUrl ?? ""}
                />
                <div>
                  <label className="block text-fg-50 text-xs mb-1.5">Tech Stack</label>
                  <SkillPicker name="tech_stack" defaultValue={p.techStack} />
                </div>
                <Field
                  label="Display order (0 = first)"
                  name="display_order"
                  type="number"
                  defaultValue={String(p.displayOrder)}
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`featured-edit-${p.id}`}
                    name="featured"
                    defaultChecked={p.featured}
                    className="accent-purple-500"
                  />
                  <label htmlFor={`featured-edit-${p.id}`} className="text-fg-60 text-sm">
                    Featured project
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isPending || uploadingFor !== null}
                    className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      "Update Project"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setEditVideoUrl(""); }}
                    className="px-5 py-2 rounded-lg border border-theme text-fg-50 hover:text-fg text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

      {!showAddForm ? (
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/6 transition-all duration-200"
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
              onClick={() => {
                setShowAddForm(false);
                setAddHeroType("mp4");
                setAddVideoUrl("");
              }}
              className="text-fg-35 hover:text-fg"
            >
              <X size={18} />
            </button>
          </div>

          <Field label="Name *" name="name" required />
          <Field label="Short description (tagline) *" name="description" required />
          <Field label="Long description (2-3 sentences)" name="long_description" type="textarea" />
          <Field label="Name (EN, optional)" name="name_en" />
          <Field label="Short description (EN, optional)" name="description_en" />
          <Field label="Long description (EN, optional)" name="long_description_en" type="textarea" />

          <input type="hidden" name="hero_type" value={addHeroType} />
          <div>
            <label className="block text-fg-50 text-xs mb-1.5">Hero Type</label>
            <div className="flex gap-2">
              {(["mp4", "js-demo"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAddHeroType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    addHeroType === t
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "border-theme bg-surface text-fg-50 hover:text-fg"
                  }`}
                >
                  {t === "mp4" ? "🎥 MP4 Video" : "⚡ JS Component"}
                </button>
              ))}
            </div>
          </div>

          {addHeroType === "mp4" ? (
            <VideoUploadField
              name="video_url"
              value={addVideoUrl}
              onChange={setAddVideoUrl}
              uploading={uploadingFor === "add"}
              onFileChange={(e) => handleVideoUpload(e, "add")}
            />
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
            <input
              type="checkbox"
              id="featured"
              name="featured"
              className="accent-purple-500"
            />
            <label htmlFor="featured" className="text-fg-60 text-sm">
              Featured project
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending || uploadingFor !== null}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Saving…</span>
                </>
              ) : (
                "Save Project"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setAddHeroType("mp4");
                setAddVideoUrl("");
              }}
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

/* ── Sub-components ──────────────────────────────────────────── */

function VideoUploadField({
  name,
  value,
  onChange,
  uploading,
  onFileChange,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-fg-50 text-xs mb-1.5">Video</label>
      <label
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 mb-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
          uploading
            ? "opacity-50 cursor-not-allowed border-theme text-fg-25"
            : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
        }`}
      >
        {uploading ? <LoadingSpinner size="sm" /> : <Upload size={13} />}
        {uploading ? "上傳中…" : "上傳 MP4"}
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          disabled={uploading}
          onChange={onFileChange}
        />
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="上傳後自動填入，或手動輸入 URL"
        className="w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-sm placeholder:text-fg-20 focus:outline-none focus:border-purple-500/50"
      />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  const base =
    "w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-sm placeholder:text-fg-20 focus:outline-none focus:border-purple-500/50";

  return (
    <div>
      <label className="block text-fg-50 text-xs mb-1.5">{label}</label>
      {type === "textarea" ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={defaultValue}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          defaultValue={defaultValue}
          className={base}
        />
      )}
    </div>
  );
}
