"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("cursor-active");

    const onMove = (e: MouseEvent) => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0 });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.28, ease: "power2.out" });
    };

    const onEnter = () => {
      gsap.to(dot,  { scale: 3.5, opacity: 0.25, duration: 0.2 });
      gsap.to(ring, { scale: 1.6, opacity: 0,    duration: 0.2 });
    };

    const onLeave = () => {
      gsap.to(dot,  { scale: 1, opacity: 1,   duration: 0.2 });
      gsap.to(ring, { scale: 1, opacity: 0.45, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMove);

    const attach = () => {
      document.querySelectorAll<Element>("a, button, [role=button], input, textarea, select").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.classList.remove("cursor-active");
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 6, height: 6, backgroundColor: "var(--accent)" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45"
        style={{ width: 30, height: 30, border: "1px solid var(--accent)" }}
      />
    </div>
  );
}
