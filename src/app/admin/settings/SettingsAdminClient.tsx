"use client";

import { useState, useTransition } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

interface Props {
  settings: { backgroundDark: string; backgroundLight: string };
  updateSettings: (formData: FormData) => Promise<{ success?: boolean; error?: string }>;
}

export default function SettingsAdminClient({ settings, updateSettings }: Props) {
  const [darkColor, setDarkColor] = useState(settings.backgroundDark);
  const [lightColor, setLightColor] = useState(settings.backgroundLight);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    setErrorMsg("");
    const formData = new FormData();
    formData.set("backgroundDark", darkColor);
    formData.set("backgroundLight", lightColor);

    startTransition(async () => {
      const result = await updateSettings(formData);
      if ("error" in result) {
        setErrorMsg(result.error ?? "Unknown error");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="border border-white/[0.08] bg-white/[0.02] rounded-2xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Dark Mode */}
        <ColorField
          label="Dark Mode Background"
          value={darkColor}
          onChange={setDarkColor}
        />

        {/* Light Mode */}
        <ColorField
          label="Light Mode Background"
          value={lightColor}
          onChange={setLightColor}
        />
      </div>

      {errorMsg && (
        <p className="mt-4 text-red-400 text-sm">{errorMsg}</p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <>
              <LoadingSpinner size="sm" />
              <span>Saving…</span>
            </>
          ) : saved ? (
            "✓ Saved"
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  return (
    <div className="space-y-3">
      <p className="text-white/50 text-sm font-medium">{label}</p>
      <div className="flex items-center gap-3">
        {/* Color picker */}
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          aria-label={`${label} color picker`}
        />
        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (HEX_RE.test(v)) onChange(v);
            else {
              // Allow typing in progress — update display but don't push invalid color
              // We only sync to state on valid hex
            }
          }}
          maxLength={7}
          placeholder="#050510"
          className="w-full px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white text-sm font-mono focus:outline-none focus:border-purple-500/50"
          aria-label={`${label} hex value`}
        />
        {/* Preview swatch */}
        <div
          className="w-10 h-10 rounded-lg border border-white/10 shrink-0"
          style={{ backgroundColor: value }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
