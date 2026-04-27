"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Check, Plus } from "lucide-react";
import { addSkill } from "@/lib/actions/skills";
import { getTechIcon } from "@/lib/tech-icon-map";

interface Skill {
  id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  isCustom: boolean;
}

interface SkillPickerProps {
  name: string;
  defaultValue?: string[];
  singleSelect?: boolean;
  onSelectChange?: (name: string) => void;
}

function SkillIcon({ nameZh, nameEn, size = 14 }: { nameZh: string; nameEn?: string; size?: number }) {
  const entry = getTechIcon(nameEn || nameZh) ?? getTechIcon(nameZh);
  const [failed, setFailed] = useState(false);

  if (!entry || failed) {
    return (
      <span
        className="rounded-sm shrink-0 flex items-center justify-center text-[9px] font-bold text-white/60"
        style={{ width: size, height: size }}
      >
        {(nameEn || nameZh).charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${entry.slug}`}
      alt=""
      width={size}
      height={size}
      className="object-contain shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

export default function SkillPicker({
  name,
  defaultValue = [],
  singleSelect = false,
  onSelectChange,
}: SkillPickerProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skillMapRef = useRef<Map<string, Skill>>(new Map());

  // Group skills by category
  const grouped = results.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const fetchSkills = useCallback((q: string) => {
    const params = new URLSearchParams({ q, limit: "50" });
    fetch(`/api/skills?${params}`)
      .then((r) => r.json())
      .then((json) => {
        const data: Skill[] = json.data ?? [];
        setResults(data);
        data.forEach((s) => skillMapRef.current.set(s.nameZh, s));
      })
      .catch(() => setResults([]));
  }, []);

  // Load all skills on mount
  useEffect(() => {
    fetchSkills("");
  }, [fetchSkills]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSkills(query);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSkills]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleSkill(skillName: string) {
    if (singleSelect) {
      setSelected([skillName]);
      setOpen(false);
      onSelectChange?.(skillName);
    } else {
      setSelected((prev) => {
        const next = prev.includes(skillName)
          ? prev.filter((s) => s !== skillName)
          : [...prev, skillName];
        if (next.length === 1) onSelectChange?.(next[0]);
        return next;
      });
    }
  }

  function removeSkill(skillName: string) {
    setSelected((prev) => prev.filter((s) => s !== skillName));
  }

  async function handleAddCustom() {
    if (!query.trim()) return;
    setIsAdding(true);
    setAddError(null);

    const fd = new FormData();
    fd.append("nameZh", query.trim());
    fd.append("category", "其他工具");

    const result = await addSkill(fd);

    if ("error" in result) {
      setAddError(result.error ?? "Unknown error");
    } else {
      toggleSkill(result.skill.nameZh);
      fetchSkills("");
      setQuery("");
    }
    setIsAdding(false);
  }

  const hasResults = results.length > 0;
  const noResults = !hasResults && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((skillName) => {
            const skill = skillMapRef.current.get(skillName);
            return (
              <span
                key={skillName}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs"
              >
                <SkillIcon nameZh={skillName} nameEn={skill?.nameEn} size={12} />
                {skillName}
                <button
                  type="button"
                  onClick={() => removeSkill(skillName)}
                  aria-label={`移除 ${skillName}`}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search input */}
      <input
        type="text"
        value={query}
        placeholder={singleSelect ? "搜尋技能..." : "搜尋並新增技能..."}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        className="w-full px-3 py-2 rounded-lg border border-white/8 bg-white/3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        role="combobox"
      />

      {/* Hidden input for form */}
      <input type="hidden" name={name} value={selected.join(",")} />

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-lg border border-white/8 bg-[#0a0a1a] shadow-xl max-h-64 overflow-y-auto">
          {addError && (
            <div className="px-3 py-2 text-red-400 text-xs border-b border-white/6">
              {addError}
            </div>
          )}

          {hasResults && (
            <ul role="listbox" className="py-1">
              {Object.entries(grouped).map(([category, skills]) => (
                <li key={category}>
                  <div className="px-3 pt-2 pb-1 text-white/30 text-xs uppercase tracking-wider font-mono">
                    {category}
                  </div>
                  {skills.map((skill) => {
                    const isSelected = selected.includes(skill.nameZh);
                    return (
                      <div
                        key={skill.id}
                        role="option"
                        aria-selected={isSelected}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          toggleSkill(skill.nameZh);
                        }}
                        className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-white/6 transition-colors ${
                          isSelected ? "bg-purple-500/10" : ""
                        }`}
                      >
                        <SkillIcon nameZh={skill.nameZh} nameEn={skill.nameEn} size={15} />
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm truncate">{skill.nameZh}</div>
                          {skill.nameEn && skill.nameEn !== skill.nameZh && (
                            <div className="text-white/40 text-xs truncate">{skill.nameEn}</div>
                          )}
                        </div>
                        {isSelected && (
                          <Check size={13} className="text-purple-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          )}

          {noResults && (
            <div className="py-1">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleAddCustom();
                }}
                disabled={isAdding}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/6 transition-colors text-purple-400 text-sm disabled:opacity-50"
              >
                <Plus size={14} />
                {isAdding ? "新增中..." : `新增自訂技能：「${query}」`}
              </button>
            </div>
          )}

          {!hasResults && !noResults && (
            <div className="px-3 py-3 text-white/30 text-sm text-center">
              載入技能庫中...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
