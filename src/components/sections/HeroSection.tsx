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

  const sectionRef  = useRef<HTMLElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const avatarRef   = useRef<HTMLDivElement>(null);

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
        isDeleting ? 45 : 80
      );
    }
    return () => clearTimeout(timer);
  }, [displayed, isDeleting, roleIndex, ROLES]);

  /* GSAP entrance + parallax */
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(avatarRef.current,   { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0 })
        .fromTo(headingRef.current,  { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.8")
        .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.65")
        .fromTo(ctaRef.current,      { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.55");

      gsap.to(contentRef.current, {
        y: -100, opacity: 0, ease: "none",
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
      {/* Radial purple glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.18),transparent)]" />

      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />

      <div ref={contentRef} className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-16">

          {/* ── Left: text ── */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-purple-400 text-xs font-mono tracking-[0.3em] uppercase mb-6">
              {t("greeting")}
            </p>

            <div ref={headingRef}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-5 leading-none">
                <span className="gradient-text">{t("name")}</span>
              </h1>

              <div className="text-lg md:text-xl text-fg-60 font-light mb-8 h-8 flex items-center md:justify-start justify-center gap-1">
                <span>{displayed}</span>
                <span className="w-0.5 h-5 bg-purple-400 animate-cursor-blink inline-block" />
              </div>
            </div>

            <p
              ref={subtitleRef}
              className="text-fg-40 text-base md:text-lg max-w-lg mx-auto md:mx-0 mb-10 leading-relaxed"
            >
              {t("tagline")}
            </p>

            <div
              ref={ctaRef}
              className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4"
            >
              <a
                href="#projects"
                className="px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all duration-300 hover:shadow-[0_0_35px_rgba(139,92,246,0.55)] w-full sm:w-auto text-center"
              >
                {t("cta_projects")}
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 rounded-full border border-theme text-fg-60 hover:text-fg hover:border-purple-500/40 transition-all duration-300 text-sm w-full sm:w-auto text-center"
              >
                {t("cta_contact")}
              </a>
            </div>
          </div>

          {/* ── Right: avatar ── */}
          <div ref={avatarRef} className="shrink-0">
            {/* Outer glow ring */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-linear-to-br from-purple-500 via-blue-500 to-cyan-400 opacity-60 blur-md" />
              {/* Gradient border frame */}
              <div className="relative p-0.75 rounded-full bg-linear-to-br from-purple-500 via-blue-500 to-cyan-400">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden bg-background">
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
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-fg-25">
        <span className="text-[10px] font-mono tracking-[0.25em]">{t("scroll")}</span>
        <div className="w-px h-10 bg-linear-to-b from-(--fg-25) to-transparent" />
      </div>
    </section>
  );
}
