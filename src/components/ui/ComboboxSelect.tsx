"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Option {
  value: string;
  labelZh: string;
  labelEn?: string;
}

interface ComboboxSelectProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  allowFreeInput?: boolean;
  defaultValue?: string;
  required?: boolean;
  onValueChange?: (value: string) => void;
}

export default function ComboboxSelect({
  label,
  name,
  options,
  placeholder = "請選擇或輸入...",
  allowFreeInput = false,
  defaultValue = "",
  required,
  onValueChange,
}: ComboboxSelectProps) {
  const [value, setValue] = useState(defaultValue);
  const [inputText, setInputText] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((opt) => {
    const q = inputText.toLowerCase();
    return (
      opt.labelZh.toLowerCase().includes(q) ||
      (opt.labelEn?.toLowerCase().includes(q) ?? false)
    );
  });

  const displayedOptions = filtered.slice(0, 8);
  const hasMore = filtered.length > 8;

  function selectOption(opt: Option) {
    setValue(opt.value);
    setInputText(opt.labelZh);
    setOpen(false);
    onValueChange?.(opt.value);
  }

  function handleFreeInput() {
    setValue(inputText);
    setOpen(false);
    onValueChange?.(inputText);
  }

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false);
      // Revert inputText to current value if not matching
      if (inputText !== value) {
        const match = options.find((o) => o.labelZh === inputText || o.value === inputText);
        if (!match && !allowFreeInput) {
          setInputText(value);
        } else if (allowFreeInput && inputText) {
          setValue(inputText);
          onValueChange?.(inputText);
        }
      }
    }
  }, [inputText, value, options, allowFreeInput, onValueChange]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      setInputText(value);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-white/50 text-xs mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={inputText}
        placeholder={placeholder}
        required={required}
        onChange={(e) => {
          setInputText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple-500/50"
        aria-autocomplete="list"
        aria-expanded={open}
        role="combobox"
        autoComplete="off"
      />
      <input type="hidden" name={name} value={value} />

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-lg border border-white/[0.08] bg-[#0a0a1a] shadow-xl overflow-hidden">
          <ul
            role="listbox"
            className="max-h-48 overflow-y-auto py-1"
          >
            {displayedOptions.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(opt);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-white/[0.06] transition-colors ${
                  opt.value === value ? "bg-purple-500/10" : ""
                }`}
              >
                <div className="text-white text-sm">{opt.labelZh}</div>
                {opt.labelEn && (
                  <div className="text-white/40 text-xs">{opt.labelEn}</div>
                )}
              </li>
            ))}
            {hasMore && (
              <li className="px-3 py-1.5 text-white/30 text-xs pointer-events-none">
                還有 {filtered.length - 8} 項，請繼續輸入篩選…
              </li>
            )}
            {filtered.length === 0 && allowFreeInput && inputText && (
              <li
                role="option"
                aria-selected={false}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleFreeInput();
                }}
                className="px-3 py-2 cursor-pointer hover:bg-white/[0.06] transition-colors text-purple-400 text-sm"
              >
                使用 &ldquo;{inputText}&rdquo;
              </li>
            )}
            {filtered.length === 0 && !allowFreeInput && (
              <li className="px-3 py-2 text-white/30 text-sm pointer-events-none">
                無符合結果
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
