"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Sun, Moon } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useTheme } from "@/components/providers/ThemeProvider";
import UserMenu from "@/components/ui/UserMenu";

const NAV_LINKS = [
  { href: "#about",      label: "About" },
  { href: "#projects",   label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact",    label: "Contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      start: "top -80",
      onEnter:     () => navRef.current?.classList.add("nav-scrolled"),
      onLeaveBack: () => navRef.current?.classList.remove("nav-scrolled"),
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-transparent"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-mono font-bold text-lg tracking-wider">
          <span className="gradient-text">{siteConfig.ownerInitials}</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-fg-50 text-sm hover:text-fg transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-theme bg-surface text-fg-50 hover:text-fg hover:border-purple-500/40 hover:bg-purple-500/6 transition-all duration-300"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* User avatar / sign-in */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
