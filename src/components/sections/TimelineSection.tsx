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
          { x: -50, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.75, stagger: 0.18, ease: "power3.out",
            scrollTrigger: { trigger: listRef.current, start: "top 82%" },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="experience" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-purple-400 text-xs font-mono tracking-[0.3em] uppercase mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-fg">
            {t("title")}
          </h2>
        </div>

        <div ref={listRef} className="relative">
          {experiences.map((exp, i) => (
            <TimelineItem key={i} exp={exp} isLast={i === experiences.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
