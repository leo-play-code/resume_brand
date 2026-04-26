"use client";

import { useState, useTransition } from "react";
import type { Experience } from "@prisma/client";
import { Trash2, Plus, X } from "lucide-react";
import UniversityPicker from "@/components/ui/UniversityPicker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  items: Experience[];
  addExperience: (formData: FormData) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
}

export default function ExperienceAdminClient({
  items,
  addExperience,
  deleteExperience,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("work");
  const [isPending, startTransition] = useTransition();

  // Education field state for composing company / role hidden inputs
  const [eduDegree, setEduDegree] = useState("學士");
  const [eduSchoolZh, setEduSchoolZh] = useState("");
  const [eduSchoolEn, setEduSchoolEn] = useState("");
  const [eduDept, setEduDept] = useState("");

  function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    startTransition(() => deleteExperience(id));
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (type === "education") {
      // Compose company from school name
      const schoolZh = formData.get("school_name_zh") as string ?? "";
      const schoolEn = formData.get("school_name_en") as string ?? "";
      const degree = formData.get("degree_level") as string ?? "";
      const dept = formData.get("department") as string ?? "";

      const company = schoolEn
        ? `${schoolZh} (${schoolEn})`
        : schoolZh;
      const role = dept ? `${degree} ${dept}` : degree;

      formData.set("company", company);
      formData.set("role", role);
    }

    startTransition(async () => {
      await addExperience(formData);
      setShowForm(false);
      setType("work");
    });
  }

  return (
    <div>
      <div className="space-y-3 mb-6">
        {items.length === 0 && (
          <p className="text-fg-35 text-sm py-6 text-center border border-dashed border-theme rounded-xl">
            No entries yet. Add your first one below.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-theme bg-surface"
          >
            <div className="flex-1 min-w-0">
              <p className="text-fg text-sm font-medium truncate">{item.role}</p>
              <p className="text-fg-35 text-xs">
                {item.company} · {item.period}
              </p>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono shrink-0 ${
                item.type === "work"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {item.type}
            </span>
            <button
              onClick={() => handleDelete(item.id)}
              disabled={isPending}
              aria-label="Delete entry"
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
          Add Entry
        </button>
      ) : (
        <form
          onSubmit={handleAdd}
          className="border border-theme bg-surface rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-fg font-medium">New Entry</h3>
            <button
              type="button"
              onClick={() => { setShowForm(false); setType("work"); }}
              aria-label="Close form"
              className="text-fg-35 hover:text-fg"
            >
              <X size={18} />
            </button>
          </div>

          {/* Type selector */}
          <div>
            <label className="block text-fg-50 text-xs mb-1.5">Type</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-theme bg-base text-fg text-sm focus:outline-none focus:border-purple-500/50"
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
            </select>
          </div>

          {/* Conditional: work vs education */}
          {type === "work" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Company / School *" name="company" required />
              <Field label="Role / Degree *" name="role" required />
            </div>
          ) : (
            <div className="space-y-3">
              <UniversityPicker
                defaultDegree={eduDegree}
                defaultSchoolZh={eduSchoolZh}
                defaultSchoolEn={eduSchoolEn}
                defaultDepartment={eduDept}
              />
              {/* These are populated server-side from UniversityPicker fields via handleAdd */}
            </div>
          )}

          <Field label="Period (e.g. 2023.06 — Present) *" name="period" required />
          <div>
            <label className="block text-fg-50 text-xs mb-1.5">
              Description (one bullet point per line)
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder={"Built X using Y\nImproved Z by 30%"}
              className="w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-sm placeholder:text-fg-20 focus:outline-none focus:border-purple-500/50 resize-none font-mono"
            />
          </div>
          <Field label="Display order (0 = first)" name="display_order" type="number" />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? <><LoadingSpinner size="sm" /><span>Saving…</span></> : "Save Entry"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setType("work"); }}
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
  return (
    <div>
      <label className="block text-fg-50 text-xs mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-sm placeholder:text-fg-20 focus:outline-none focus:border-purple-500/50"
      />
    </div>
  );
}
