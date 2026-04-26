"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ProjectCard from "@/components/ui/ProjectCard";
import type { Project } from "@/lib/data/projects";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  projects: Project[];
}

export default function ProjectsSection({ projects }: Props) {
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
            y: 0, opacity: 1, duration: 0.85, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 82%" },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-purple-400 text-xs font-mono tracking-[0.3em] uppercase mb-4">
            Work
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-fg mb-4">
            Featured Projects
          </h2>
          <p className="text-fg-35 max-w-lg mx-auto text-sm md:text-base">
            A selection of things I&apos;ve built — tools, products, and experiments.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id ?? project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
