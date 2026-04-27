"use client";

import { useState } from "react";
import type { TechItem } from "@/lib/data/tech-stack";
import { getTechIcon } from "@/lib/tech-icon-map";

function TechIcon({ name, icon, color }: { name: string; icon?: string | null; color: string }) {
  const [failed, setFailed] = useState(false);
  const slug = failed ? null : (icon ?? getTechIcon(name)?.slug ?? null);

  if (slug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt=""
        width={16}
        height={16}
        className="object-contain shrink-0"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className="w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

interface Props {
  items: TechItem[];
  direction: "left" | "right";
}

export default function TechMarquee({ items, direction }: Props) {
  // Repeat items until we have enough to fill ~2× the widest viewport.
  // Each item is ~130px wide on average; target ≥30 items in each half
  // so the track is at least 3900px before doubling.
  // copies must be even so that translateX(-50%) loops seamlessly.
  const copies = Math.max(4, Math.ceil(30 / Math.max(1, items.length)) * 2);
  const track = Array.from({ length: copies }, () => items).flat();

  return (
    <div className="overflow-hidden py-1.5 marquee-group">
      <div
        className={`flex gap-4 w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {track.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-theme bg-surface hover:border-purple-500/35 hover:bg-purple-500/6 transition-all duration-300 cursor-default select-none"
          >
            <TechIcon name={tech.name} icon={tech.icon} color={tech.color} />
            <span className="text-fg-55 text-sm font-mono whitespace-nowrap hover:text-fg transition-colors duration-200">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
