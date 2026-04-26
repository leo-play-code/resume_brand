"use client";

import { useState, useTransition } from "react";
import type { TechStack, Skill } from "@prisma/client";
import { Trash2, Plus, X } from "lucide-react";
import SkillPicker from "@/components/ui/SkillPicker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface Props {
  items: TechStack[];
  addTechItem: (formData: FormData) => Promise<void>;
  deleteTechItem: (id: string) => Promise<void>;
  customSkills?: Skill[];
  deleteSkill?: (id: string) => Promise<void>;
}

export default function TechAdminClient({
  items,
  addTechItem,
  deleteTechItem,
  customSkills = [],
  deleteSkill,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const row1 = items.filter((i) => i.rowNumber === 1);
  const row2 = items.filter((i) => i.rowNumber === 2);

  function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    startTransition(() => deleteTechItem(id));
  }

  function handleAdd(formData: FormData) {
    // SkillPicker outputs comma-separated into "name"; take the first value for single-select
    const rawName = formData.get("name") as string ?? "";
    const firstName = rawName.split(",")[0].trim();
    formData.set("name", firstName);

    startTransition(async () => {
      await addTechItem(formData);
      setShowForm(false);
    });
  }

  function handleDeleteSkill(id: string) {
    if (!confirm("Delete this custom skill?")) return;
    if (deleteSkill) startTransition(() => deleteSkill(id));
  }

  return (
    <div>
      {[1, 2].map((row) => (
        <div key={row} className="mb-8">
          <h2 className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">
            Row {row} ({row === 1 ? "scrolls left" : "scrolls right"})
          </h2>
          <div className="space-y-2">
            {(row === 1 ? row1 : row2).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02]"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white text-sm flex-1">{item.name}</span>
                <span className="text-white/25 text-xs font-mono">{item.color}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={isPending}
                  aria-label="Delete tech item"
                  className="p-1.5 text-white/25 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {(row === 1 ? row1 : row2).length === 0 && (
              <p className="text-white/20 text-xs py-4 text-center border border-dashed border-white/10 rounded-xl">
                Empty row
              </p>
            )}
          </div>
        </div>
      ))}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/[0.06] transition-all duration-200"
        >
          <Plus size={16} />
          Add Tech Item
        </button>
      ) : (
        <form
          action={handleAdd}
          className="border border-white/[0.08] bg-white/[0.02] rounded-2xl p-6 space-y-4 mt-2"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium">New Tech Item</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
              className="text-white/30 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div>
            <label className="block text-white/50 text-xs mb-1.5">Name *</label>
            <SkillPicker name="name" singleSelect />
          </div>

          <div>
            <label className="block text-white/50 text-xs mb-1.5">Color (hex code)</label>
            <input
              type="text"
              name="color"
              defaultValue="#ffffff"
              placeholder="#61DAFB"
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"
            />
            <p className="text-white/20 text-xs mt-1">
              Tip: find brand colors at <span className="font-mono">simpleicons.org</span>
            </p>
          </div>

          <div>
            <label className="block text-white/50 text-xs mb-1.5">Row</label>
            <select
              name="row_number"
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-[#07070f] text-white text-sm focus:outline-none focus:border-purple-500/50"
            >
              <option value="1">Row 1 (scrolls left →)</option>
              <option value="2">Row 2 (scrolls right ←)</option>
            </select>
          </div>

          <div>
            <label className="block text-white/50 text-xs mb-1.5">Display order (0 = first)</label>
            <input
              type="number"
              name="display_order"
              defaultValue="0"
              className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? <><LoadingSpinner size="sm" /><span>Saving…</span></> : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-lg border border-white/10 text-white/50 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* 自訂技能管理 */}
      {customSkills.length > 0 && (
        <div className="mt-10">
          <h2 className="text-white/40 text-xs font-mono uppercase tracking-widest mb-3">
            自訂技能管理
          </h2>
          <div className="space-y-2">
            {customSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02]"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-white text-sm">{skill.nameZh}</span>
                  {skill.nameEn && skill.nameEn !== skill.nameZh && (
                    <span className="text-white/30 text-xs ml-2">{skill.nameEn}</span>
                  )}
                </div>
                <span className="text-white/25 text-xs font-mono">{skill.category}</span>
                {deleteSkill && (
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    disabled={isPending}
                    aria-label={`Delete custom skill ${skill.nameZh}`}
                    className="p-1.5 text-white/25 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
