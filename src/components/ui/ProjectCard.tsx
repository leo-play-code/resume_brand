"use client";

import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import gsap from "gsap";
import { GitHubIcon } from "@/components/ui/Icons";
import type { Project } from "@/lib/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 18,
      rotateX: -y * 18,
      transformPerspective: 600,
      duration: 0.08,
      ease: "none",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.1,
      ease: "none",
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-background overflow-hidden transition-all duration-300 hover:glow-card"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* ── Media ──────────────────────────────────── */}
      <div className="relative aspect-video bg-surface-2 overflow-hidden">
        {project.heroType === "js-demo" ? (
          <iframe
            src={`/api/demo/${project.id}`}
            className="w-full h-full border-0"
            title={`${project.name} demo`}
            allow="scripts"
            loading="lazy"
          />
        ) : project.videoUrl ? (
          <video
            src={project.videoUrl}
            autoPlay muted loop playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl font-sans font-bold text-(--accent) opacity-10 select-none">
              {project.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />

        {/* Hover links — theme-aware */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank" rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-background border border-theme hover:border-(--accent) text-fg-50 hover:text-(--accent) transition-all duration-150"
            >
              <GitHubIcon size={14} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank" rel="noopener noreferrer"
              aria-label="Live site"
              onClick={(e) => e.stopPropagation()}
              className="p-2 bg-background border border-theme hover:border-(--accent) text-fg-50 hover:text-(--accent) transition-all duration-150"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>

      {/* ── Body ───────────────────────────────────── */}
      <div className="p-6 border-t border-theme">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-base font-sans font-bold text-fg group-hover:text-(--accent) transition-colors duration-200">
            {project.name}
          </h3>
          <span className="text-[10px] text-fg-25 font-mono tracking-widest uppercase shrink-0 mt-1">
            {project.techStack[0]}
          </span>
        </div>

        <p className="text-fg-35 text-xs font-mono mb-3 tracking-wide">
          {project.description}
        </p>
        <p className="text-fg-50 text-xs leading-relaxed mb-5">
          {project.longDescription}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-2 py-0.5 border border-theme text-fg-35 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
