"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import TechMarquee from "@/components/ui/TechMarquee";
import type { TechItem } from "@/lib/data/tech-stack";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  row1: TechItem[];
  row2: TechItem[];
}

export default function TechStackSection({ row1, row2 }: Props) {
  const t = useTranslations("techStack");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: titleRef.current, start: "top 95%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-28 overflow-hidden">
      <div ref={titleRef} className="relative px-6 mb-16 max-w-6xl mx-auto">
        {/* Section number watermark */}
        <span className="section-num" style={{ top: "-30px", left: "16px" }}>02</span>

        <div className="relative z-10">
          <p className="text-(--accent) text-[10px] tracking-[0.4em] uppercase font-mono mb-4">
            ——— {t("eyebrow")}
          </p>
          <h2 className="font-sans font-bold text-[clamp(2rem,6vw,4rem)] text-fg leading-none tracking-tight">
            {t("title")}
          </h2>
          <p className="text-fg-35 text-xs mt-3 font-mono max-w-md">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <TechMarquee items={row1} direction="left" />
        <TechMarquee items={row2} direction="right" />
      </div>
    </section>
  );
}
