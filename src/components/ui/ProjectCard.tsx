"use client";

import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/Icons";
import type { Project } from "@/lib/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => videoRef.current?.play().catch(() => {});
  const handleMouseLeave = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <article
      className="group relative rounded-2xl border border-theme bg-surface overflow-hidden hover:border-purple-500/30 hover:-translate-y-1.5 transition-all duration-500 hover:glow-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Media ──────────────────────────────────── */}
      <div className="relative aspect-video bg-surface-2 overflow-hidden">
        {project.videoUrl ? (
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted loop playsInline preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl font-bold gradient-text opacity-15 select-none">
              {project.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Bottom gradient fade — dark overlay works on video in both themes */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

        {/* Hover links */}
        <div className="absolute top-3.5 right-3.5 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank" rel="noopener noreferrer"
              aria-label="GitHub"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-200"
            >
              <GitHubIcon size={15} />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank" rel="noopener noreferrer"
              aria-label="Live site"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-all duration-200"
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {/* ── Body ───────────────────────────────────── */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-fg mb-1 group-hover:gradient-text transition-all duration-300">
          {project.name}
        </h3>
        <p className="text-fg-35 text-xs font-mono mb-3 tracking-wide">
          {project.description}
        </p>
        <p className="text-fg-55 text-sm leading-relaxed mb-5">
          {project.longDescription}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-[11px] px-2.5 py-0.5 rounded-full border border-theme bg-surface text-fg-45 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
