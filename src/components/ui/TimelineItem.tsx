import type { Experience } from "@/lib/data/experience";

interface Props {
  exp: Experience;
  isLast: boolean;
}

export default function TimelineItem({ exp, isLast }: Props) {
  return (
    <div className="timeline-item relative pl-12 md:pl-16">
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[22px] md:left-[27px] top-7 bottom-0 w-px bg-linear-to-b from-purple-500/50 to-transparent" />
      )}

      {/* Dot */}
      <div className="absolute left-0 md:left-1 top-1 w-8 h-8 rounded-full border-2 border-purple-500/60 bg-base flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
      </div>

      <div className="pb-12">
        <p className="text-purple-400 text-[11px] font-mono tracking-widest uppercase mb-2">
          {exp.period}
        </p>
        <h3 className="text-fg text-xl font-bold mb-0.5">{exp.role}</h3>
        <p className="text-fg-40 text-sm font-medium mb-4">{exp.company}</p>
        <ul className="space-y-2">
          {exp.description.map((point, i) => (
            <li key={i} className="flex gap-2.5 text-fg-50 text-sm">
              <span className="text-purple-400 mt-0.5 shrink-0">›</span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
