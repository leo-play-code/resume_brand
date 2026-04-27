"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import TimelineItem from "@/components/ui/TimelineItem";
import type { Experience } from "@/lib/data/experience";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  experiences: Experience[];
}

export default function TimelineSection({ experiences }: Props) {
  const t = useTranslations("experience");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);

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

      const items = listRef.current?.querySelectorAll(".timeline-item");
      if (items?.length) {
        gsap.fromTo(
          Array.from(items),
          { x: -40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.75, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: listRef.current, start: "top 82%" },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="experience" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div ref={titleRef} className="relative mb-16">
          <span className="section-num" style={{ top: "-30px", left: 0 }}>04</span>

          <div className="relative z-10">
            <p className="text-(--accent) text-[10px] tracking-[0.4em] uppercase font-mono mb-4">
              ——— {t("eyebrow")}
            </p>
            <h2 className="font-sans font-bold text-[clamp(2rem,6vw,4rem)] text-fg leading-none tracking-tight">
              {t("title")}
            </h2>
          </div>
        </div>

        {/* Timeline */}
        <div ref={listRef} className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 bottom-0 w-px bg-border" />

          {experiences.map((exp, i) => (
            <TimelineItem key={i} exp={exp} isLast={i === experiences.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
