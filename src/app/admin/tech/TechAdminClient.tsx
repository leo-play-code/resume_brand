"use client";

import { useState, useTransition } from "react";
import type { TechStack, Skill } from "@prisma/client";
import { Trash2, Plus, X, GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SkillPicker from "@/components/ui/SkillPicker";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getTechIcon } from "@/lib/tech-icon-map";

interface Props {
  items: TechStack[];
  addTechItem: (formData: FormData) => Promise<void>;
  deleteTechItem: (id: string) => Promise<void>;
  reorderTechItems: (updates: { id: string; displayOrder: number }[]) => Promise<void>;
  customSkills?: Skill[];
  deleteSkill?: (id: string) => Promise<void>;
}

/* ── Sortable row item ── */
function SortableItem({
  item,
  onDelete,
  disabled,
}: {
  item: TechStack;
  onDelete: (id: string) => void;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-theme bg-surface"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-fg-25 hover:text-fg-50 cursor-grab active:cursor-grabbing touch-none p-0.5 -ml-1"
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <GripVertical size={15} />
      </button>

      <span
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: item.color }}
      />
      <span className="text-fg text-sm flex-1">{item.name}</span>
      <span className="text-fg-25 text-xs font-mono">{item.color}</span>
      <button
        onClick={() => onDelete(item.id)}
        disabled={disabled}
        aria-label="Delete tech item"
        className="p-1.5 text-fg-25 hover:text-red-400 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

/* ── Main component ── */
export default function TechAdminClient({
  items,
  addTechItem,
  deleteTechItem,
  reorderTechItems,
  customSkills = [],
  deleteSkill,
}: Props) {
  const [localItems, setLocalItems] = useState<TechStack[]>(
    [...items].sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [detectedColor, setDetectedColor] = useState("#ffffff");

  const row1 = localItems.filter((i) => i.rowNumber === 1);
  const row2 = localItems.filter((i) => i.rowNumber === 2);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleSkillSelect(skillName: string) {
    const entry = getTechIcon(skillName);
    setDetectedColor(entry?.color ?? "#ffffff");
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    startTransition(async () => {
      await deleteTechItem(id);
      setLocalItems((prev) => prev.filter((i) => i.id !== id));
    });
  }

  function handleAdd(formData: FormData) {
    const rawName = (formData.get("name") as string) ?? "";
    formData.set("name", rawName.split(",")[0].trim());
    startTransition(async () => {
      await addTechItem(formData);
      setShowForm(false);
      // Page will revalidate and re-render with new item
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = localItems.find((i) => i.id === active.id);
    const overItem   = localItems.find((i) => i.id === over.id);
    if (!activeItem || !overItem) return;

    const targetRow = overItem.rowNumber;
    const updatedActive = { ...activeItem, rowNumber: targetRow };

    // Remove active, insert it at the over position
    const without = localItems.filter((i) => i.id !== active.id);
    const overIdx = without.findIndex((i) => i.id === over.id);
    const newItems = [...without.slice(0, overIdx), updatedActive, ...without.slice(overIdx)];
    setLocalItems(newItems);

    // Recalculate displayOrder for both rows
    const updates = ([1, 2] as const).flatMap((row) =>
      newItems
        .filter((i) => i.rowNumber === row)
        .map((item, idx) => ({ id: item.id, displayOrder: idx, rowNumber: row }))
    );
    startTransition(() => reorderTechItems(updates));
  }

  function handleDeleteSkill(id: string) {
    if (!confirm("Delete this custom skill?")) return;
    if (deleteSkill) startTransition(() => deleteSkill(id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div>
        <SortableContext
          items={localItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {([1, 2] as const).map((row) => {
            const rowItems = row === 1 ? row1 : row2;
            return (
              <div key={row} className="mb-8">
                <h2 className="text-fg-40 text-xs font-mono uppercase tracking-widest mb-3">
                  Row {row} ({row === 1 ? "scrolls left" : "scrolls right"})
                </h2>
                <div className="space-y-2">
                  {rowItems.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      onDelete={handleDelete}
                      disabled={isPending}
                    />
                  ))}
                  {rowItems.length === 0 && (
                    <p className="text-fg-20 text-xs py-4 text-center border border-dashed border-theme rounded-xl">
                      Empty row
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </SortableContext>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-purple-500/30 text-purple-400 text-sm hover:bg-purple-500/6 transition-all duration-200"
          >
            <Plus size={16} />
            Add Tech Item
          </button>
        ) : (
          <form
            action={handleAdd}
            className="border border-theme bg-surface rounded-2xl p-6 space-y-4 mt-2"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-fg font-medium">New Tech Item</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="text-fg-35 hover:text-fg"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-fg-50 text-xs mb-1.5">Name *</label>
              <SkillPicker name="name" singleSelect onSelectChange={handleSkillSelect} />
            </div>

            <div>
              <label className="block text-fg-50 text-xs mb-1.5">Brand color</label>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-theme bg-surface">
                <span
                  className="w-4 h-4 rounded-full shrink-0 ring-1 ring-white/10"
                  style={{ backgroundColor: detectedColor }}
                />
                <span className="text-fg text-sm font-mono flex-1">{detectedColor}</span>
                <span className="text-fg-25 text-xs">auto-detected</span>
              </div>
              <input type="hidden" name="color" value={detectedColor} />
            </div>

            <div>
              <label className="block text-fg-50 text-xs mb-1.5">Row</label>
              <select
                name="row_number"
                className="w-full px-3 py-2 rounded-lg border border-theme bg-base text-fg text-sm focus:outline-none focus:border-purple-500/50"
              >
                <option value="1">Row 1 (scrolls left →)</option>
                <option value="2">Row 2 (scrolls right ←)</option>
              </select>
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
                className="px-5 py-2 rounded-lg border border-theme text-fg-50 hover:text-fg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* 自訂技能管理 */}
        {customSkills.length > 0 && (
          <div className="mt-10">
            <h2 className="text-fg-40 text-xs font-mono uppercase tracking-widest mb-3">
              自訂技能管理
            </h2>
            <div className="space-y-2">
              {customSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-theme bg-surface"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-fg text-sm">{skill.nameZh}</span>
                    {skill.nameEn && skill.nameEn !== skill.nameZh && (
                      <span className="text-fg-35 text-xs ml-2">{skill.nameEn}</span>
                    )}
                  </div>
                  <span className="text-fg-25 text-xs font-mono">{skill.category}</span>
                  {deleteSkill && (
                    <button
                      onClick={() => handleDeleteSkill(skill.id)}
                      disabled={isPending}
                      aria-label={`Delete custom skill ${skill.nameZh}`}
                      className="p-1.5 text-fg-25 hover:text-red-400 transition-colors"
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
    </DndContext>
  );

}
