"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TechMarquee from "@/components/ui/TechMarquee";
import type { TechItem } from "@/lib/data/tech-stack";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  row1: TechItem[];
  row2: TechItem[];
}

export default function TechStackSection({ row1, row2 }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);

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
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden">
      <div ref={titleRef} className="text-center mb-14 px-6">
        <p className="text-purple-400 text-xs font-mono tracking-[0.3em] uppercase mb-4">
          Stack
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-fg mb-3">
          Technologies I work with
        </h2>
        <p className="text-fg-35 text-sm md:text-base">
          Tools and languages I use to bring ideas to life
        </p>
      </div>

      <div className="space-y-3">
        <TechMarquee items={row1} direction="left" />
        <TechMarquee items={row2} direction="right" />
      </div>
    </section>
  );
}
