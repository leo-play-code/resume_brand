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
        width={14}
        height={14}
        className="object-contain shrink-0 opacity-70"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      className="w-1.5 h-1.5 shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

interface Props {
  items: TechItem[];
  direction: "left" | "right";
}

export default function TechMarquee({ items, direction }: Props) {
  const copies = Math.max(4, Math.ceil(30 / Math.max(1, items.length)) * 2);
  const track = Array.from({ length: copies }, () => items).flat();

  return (
    <div className="overflow-hidden py-1 marquee-group">
      <div
        className={`flex gap-2 w-max ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        {track.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 py-2 border border-theme bg-surface hover:border-(--accent) hover:bg-(--accent)/5 transition-all duration-200 cursor-default select-none"
          >
            <TechIcon name={tech.name} icon={tech.icon} color={tech.color} />
            <span className="text-fg-45 text-xs font-mono whitespace-nowrap hover:text-fg transition-colors duration-200">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
