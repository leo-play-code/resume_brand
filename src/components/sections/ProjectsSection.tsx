"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project } from "@/lib/data/projects";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  projects: Project[];
}

export default function ProjectsSection({ projects }: Props) {
  const t = useTranslations("projects");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 88%" },
        }
      );

      if (gridRef.current) {
        gsap.fromTo(
          Array.from(gridRef.current.children),
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="relative mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <span className="section-num" style={{ top: "-30px", left: 0 }}>03</span>

          <div className="relative z-10">
            <p className="text-(--accent) text-[10px] tracking-[0.4em] uppercase font-mono mb-4">
              ——— {t("eyebrow")}
            </p>
            <h2 className="font-sans font-bold text-[clamp(2rem,6vw,4rem)] text-fg leading-none tracking-tight">
              {t("title")}
            </h2>
          </div>

          <p className="text-fg-35 text-xs font-mono max-w-xs md:text-right relative z-10">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {projects.map((project) => (
            <ProjectCard key={project.id ?? project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
