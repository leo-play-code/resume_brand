"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Sun, Moon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { useTheme } from "@/components/providers/ThemeProvider";
import UserMenu from "@/components/ui/UserMenu";

const NAV_LINKS = [
  { href: "#about",      labelKey: "about" },
  { href: "#projects",   labelKey: "projects" },
  { href: "#experience", labelKey: "experience" },
  { href: "#contact",    labelKey: "contact" },
] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
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
        <a
          href="#"
          className="font-sans font-bold text-base tracking-widest uppercase text-fg hover:text-(--accent) transition-colors duration-200"
        >
          {siteConfig.ownerInitials}
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-fg-40 text-xs hover:text-fg transition-colors duration-200 tracking-widest uppercase"
              >
                <span className="text-(--accent) mr-1 text-[10px]">0{i + 1}.</span>
                {t(link.labelKey)}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-(--accent) group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={() => {
              const newLocale = locale === "zh" ? "en" : "zh";
              const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
              router.push(newPath || `/${newLocale}`);
            }}
            className="text-fg-40 hover:text-(--accent) text-xs tracking-widest uppercase transition-colors duration-200"
          >
            {locale === "zh" ? "EN" : "中文"}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="text-fg-40 hover:text-(--accent) transition-colors duration-200 p-1"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User avatar / sign-in */}
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
