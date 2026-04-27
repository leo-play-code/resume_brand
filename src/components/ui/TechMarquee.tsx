import type { TechItem } from "@/lib/data/tech-stack";

interface Props {
  items: TechItem[];
  direction: "left" | "right";
}

export default function TechMarquee({ items, direction }: Props) {
  const track = [...items, ...items];

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
            {tech.icon ? (
              <img
                src={`https://cdn.simpleicons.org/${tech.icon}`}
                alt={tech.name}
                width={16}
                height={16}
                className="object-contain shrink-0"
              />
            ) : (
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tech.color }}
              />
            )}
            <span className="text-fg-55 text-sm font-mono whitespace-nowrap hover:text-fg transition-colors duration-200">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
