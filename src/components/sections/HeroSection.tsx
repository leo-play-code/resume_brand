"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const t = useTranslations("hero");
  const ROLES = t.raw("roles") as string[];

  const sectionRef   = useRef<HTMLElement>(null);
  const contentRef   = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLDivElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef       = useRef<HTMLDivElement>(null);
  const avatarRef    = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const primaryBtnRef   = useRef<HTMLAnchorElement>(null);
  const secondaryBtnRef = useRef<HTMLAnchorElement>(null);

  const makeMagnetic = (ref: React.RefObject<HTMLAnchorElement | null>) => ({
    onMouseMove: (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.35;
      const y = (e.clientY - r.top  - r.height / 2) * 0.35;
      gsap.to(el, { x, y, duration: 0.25, ease: "power2.out" });
    },
    onMouseLeave: () => {
      gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.6)" });
    },
  });

  const [roleIndex, setRoleIndex]   = useState(0);
  const [displayed, setDisplayed]   = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  /* Typewriter */
  useEffect(() => {
    const current = ROLES[roleIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed === current) {
      timer = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setRoleIndex((i) => (i + 1) % ROLES.length);
    } else {
      timer = setTimeout(
        () =>
          setDisplayed(
            isDeleting
              ? displayed.slice(0, -1)
              : current.slice(0, displayed.length + 1)
          ),
        isDeleting ? 40 : 70
      );
    }
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, roleIndex, ROLES]);

  /* GSAP entrance + parallax */
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(lineRef.current,    { scaleX: 0 },            { scaleX: 1, duration: 0.6, transformOrigin: "left" })
        .fromTo(headingRef.current, { y: 60, opacity: 0 },    { y: 0, opacity: 1, duration: 0.9 }, "-=0.3")
        .fromTo(avatarRef.current,  { x: 40, opacity: 0 },    { x: 0, opacity: 1, duration: 0.8 }, "-=0.7")
        .fromTo(subtitleRef.current,{ y: 30, opacity: 0 },    { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo(ctaRef.current,     { y: 20, opacity: 0 },    { y: 0, opacity: 1, duration: 0.5 }, "-=0.4");

      gsap.to(contentRef.current, {
        y: -80, opacity: 0, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", end: "bottom top", scrub: 1.2,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Huge section number watermark */}
      <span className="section-num" style={{ top: "-2%", right: "2%", opacity: 0.03 }}>
        01
      </span>

      {/* Subtle lime accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-(--accent) opacity-30" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent" />

      <div ref={contentRef} className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20">

          {/* ── Left: text ── */}
          <div className="flex-1">
            {/* Eyebrow with animated line */}
            <div ref={lineRef} className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-(--accent)" />
              <p className="text-(--accent) text-[10px] tracking-[0.4em] uppercase font-mono">
                {t("greeting")}
              </p>
            </div>

            <div ref={headingRef}>
              <h1 className="font-sans font-bold leading-[0.9] tracking-tight mb-6">
                <span className="block text-fg-40 text-xl md:text-2xl font-normal mb-2 font-mono tracking-widest uppercase">
                  {t("name")}
                </span>
                <span
                  className="block text-[clamp(3.5rem,10vw,7.5rem)] text-fg"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  FULL STACK
                </span>
                <span
                  className="block text-[clamp(3.5rem,10vw,7.5rem)] text-(--accent)"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  ENGINEER
                </span>
              </h1>

              {/* Typewriter role */}
              <div className="flex items-center gap-2 mb-8 h-7">
                <span className="text-xs tracking-[0.3em] uppercase text-fg-35 font-mono">
                  ›
                </span>
                <span className="text-sm text-fg-50 font-mono">{displayed}</span>
                <span className="w-0.5 h-4 bg-(--accent) animate-cursor-blink inline-block" />
              </div>
            </div>

            <p
              ref={subtitleRef}
              className="text-fg-35 text-sm md:text-base max-w-md mb-10 leading-relaxed font-mono"
            >
              {t("tagline")}
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              <a
                ref={primaryBtnRef}
                href="#projects"
                {...makeMagnetic(primaryBtnRef)}
                className="px-7 py-3 bg-(--accent) text-[#080808] font-sans font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity duration-200 inline-block"
              >
                {t("cta_projects")}
              </a>
              <a
                ref={secondaryBtnRef}
                href="#contact"
                {...makeMagnetic(secondaryBtnRef)}
                className="px-7 py-3 border border-theme text-fg-50 hover:border-(--accent) hover:text-fg font-mono text-xs tracking-widest uppercase transition-all duration-200 inline-block"
              >
                {t("cta_contact")}
              </a>
            </div>
          </div>

          {/* ── Right: avatar ── */}
          <div ref={avatarRef} className="shrink-0 relative">
            {/* Sharp lime frame offset */}
            <div className="relative">
              <div
                className="absolute inset-0 border border-(--accent) opacity-40"
                style={{ transform: "translate(10px, 10px)" }}
              />
              <div className="relative w-56 h-56 md:w-72 md:h-72 overflow-hidden border border-theme bg-surface-2">
                <Image
                  src="/avatar.png"
                  alt={t("name")}
                  width={288}
                  height={288}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              </div>
            </div>

            {/* Status indicator */}
            <div className="absolute -bottom-6 left-0 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-(--accent) animate-pulse" />
              <span className="text-[10px] text-fg-25 tracking-widest uppercase font-mono">Available</span>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-20">
        <span className="text-[9px] font-mono tracking-[0.4em] uppercase">{t("scroll")}</span>
        <div className="w-px h-8 bg-linear-to-b from-(--fg-20) to-transparent" />
      </div>
    </section>
  );
}
