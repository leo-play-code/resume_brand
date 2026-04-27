"use client";

import { useState, useTransition } from "react";
import type { Experience } from "@prisma/client";
import { Trash2, Plus, X, Pencil } from "lucide-react";
import UniversityPicker from "@/components/ui/UniversityPicker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  items: Experience[];
  addExperience: (formData: FormData) => Promise<void>;
  updateExperience: (id: string, formData: FormData) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
}

export default function ExperienceAdminClient({
  items,
  addExperience,
  updateExperience,
  deleteExperience,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addType, setAddType] = useState("work");
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    startTransition(() => deleteExperience(id));
  }

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (addType === "education") composeEducationFields(formData);
    startTransition(async () => {
      await addExperience(formData);
      setShowAddForm(false);
      setAddType("work");
    });
  }

  function handleUpdate(id: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await updateExperience(id, formData);
      setEditingId(null);
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
        {items.map((item) =>
          editingId === item.id ? (
            <EditForm
              key={item.id}
              item={item}
              onSubmit={(e) => handleUpdate(item.id, e)}
              onCancel={() => setEditingId(null)}
              isPending={isPending}
            />
          ) : (
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
                onClick={() => setEditingId(item.id)}
                disabled={isPending}
                aria-label="Edit entry"
                className="p-1.5 text-fg-25 hover:text-purple-400 transition-colors shrink-0"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={isPending}
                aria-label="Delete entry"
                className="p-1.5 text-fg-25 hover:text-red-400 transition-colors shrink-0"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )
        )}
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/6 transition-all duration-200"
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
              onClick={() => { setShowAddForm(false); setAddType("work"); }}
              aria-label="Close form"
              className="text-fg-35 hover:text-fg"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="block text-fg-50 text-xs mb-1.5">Type</label>
            <select
              name="type"
              value={addType}
              onChange={(e) => setAddType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-theme bg-base text-fg text-sm focus:outline-none focus:border-purple-500/50"
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
            </select>
          </div>

          {addType === "work" ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company *" name="company" required />
                <Field label="Company (EN, optional)" name="company_en" />
              </div>
              <Field label="Role / Degree *" name="role" required />
            </div>
          ) : (
            <div className="space-y-3">
              <UniversityPicker />
            </div>
          )}

          <Field label="Role (EN, optional)" name="role_en" />
          <Textarea label="Description bullets (EN, optional)" name="description_en" rows={3} hint="每行一個 bullet" />
          <Field label="Period (e.g. 2023.06 — Present) *" name="period" required />
          <Textarea label="Description (one bullet point per line)" name="description" rows={4} placeholder={"Built X using Y\nImproved Z by 30%"} mono />
          <Field label="Display order (0 = first)" name="display_order" type="number" />

          <FormActions
            isPending={isPending}
            onCancel={() => { setShowAddForm(false); setAddType("work"); }}
            submitLabel="Save Entry"
          />
        </form>
      )}
    </div>
  );
}

/* ── Edit form (inline) ── */
function EditForm({
  item,
  onSubmit,
  onCancel,
  isPending,
}: {
  item: Experience;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border border-purple-500/30 bg-surface rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-fg font-medium">Edit Entry</h3>
        <button type="button" onClick={onCancel} className="text-fg-35 hover:text-fg">
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="block text-fg-50 text-xs mb-1.5">Type</label>
        <select
          name="type"
          defaultValue={item.type}
          className="w-full px-3 py-2 rounded-lg border border-theme bg-base text-fg text-sm focus:outline-none focus:border-purple-500/50"
        >
          <option value="work">Work</option>
          <option value="education">Education</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company *" name="company" required defaultValue={item.company} />
          <Field label="Company (EN, optional)" name="company_en" defaultValue={item.companyEn ?? ""} />
        </div>
        <Field label="Role / Degree *" name="role" required defaultValue={item.role} />
      </div>

      <Field label="Role (EN, optional)" name="role_en" defaultValue={item.roleEn ?? ""} />
      <Textarea
        label="Description bullets (EN, optional)"
        name="description_en"
        rows={3}
        hint="每行一個 bullet"
        defaultValue={item.descriptionEn.join("\n")}
      />
      <Field label="Period *" name="period" required defaultValue={item.period} />
      <Textarea
        label="Description (one bullet point per line)"
        name="description"
        rows={4}
        mono
        defaultValue={item.description.join("\n")}
      />
      <Field label="Display order (0 = first)" name="display_order" type="number" defaultValue={String(item.displayOrder)} />

      <FormActions isPending={isPending} onCancel={onCancel} submitLabel="Update Entry" />
    </form>
  );
}

/* ── Shared sub-components ── */
function Field({
  label, name, type = "text", required, defaultValue,
}: {
  label: string; name: string; type?: string; required?: boolean; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-fg-50 text-xs mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-sm placeholder:text-fg-20 focus:outline-none focus:border-purple-500/50"
      />
    </div>
  );
}

function Textarea({
  label, name, rows, hint, placeholder, mono, defaultValue,
}: {
  label: string; name: string; rows: number; hint?: string;
  placeholder?: string; mono?: boolean; defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-fg-50 text-xs mb-1.5">
        {label}
        {hint && <span className="text-fg-25 ml-1 font-mono">（{hint}）</span>}
      </label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`w-full px-3 py-2 rounded-lg border border-theme bg-surface text-fg text-sm placeholder:text-fg-20 focus:outline-none focus:border-purple-500/50 resize-none ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}

function FormActions({
  isPending, onCancel, submitLabel,
}: {
  isPending: boolean; onCancel: () => void; submitLabel: string;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
      >
        {isPending ? <><LoadingSpinner size="sm" /><span>Saving…</span></> : submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2 rounded-lg border border-theme text-fg-50 hover:text-fg text-sm transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

function composeEducationFields(formData: FormData) {
  const schoolZh = (formData.get("school_name_zh") as string) ?? "";
  const schoolEn = (formData.get("school_name_en") as string) ?? "";
  const degree   = (formData.get("degree_level") as string) ?? "";
  const dept     = (formData.get("department") as string) ?? "";
  formData.set("company", schoolEn ? `${schoolZh} (${schoolEn})` : schoolZh);
  formData.set("role", dept ? `${degree} ${dept}` : degree);
}
