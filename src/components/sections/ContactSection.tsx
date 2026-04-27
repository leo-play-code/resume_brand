"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { Mail, Copy, Check } from "lucide-react";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { icon: GitHubIcon,  href: siteConfig.social.github,   label: "GitHub" },
  { icon: LinkedInIcon,href: siteConfig.social.linkedin,  label: "LinkedIn" },
  { icon: XIcon,       href: siteConfig.social.twitter,   label: "Twitter" },
];

export default function ContactSection() {
  const t = useTranslations("contact");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: contentRef.current, start: "top 95%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(siteConfig.email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-36 px-6 overflow-hidden">
      {/* Top border accent */}
      <div className="absolute top-0 left-6 right-6 h-px bg-border" />

      <div ref={contentRef} className="relative max-w-6xl mx-auto">
        {/* Section number watermark */}
        <span className="section-num" style={{ top: "-20px", right: 0 }}>05</span>

        <div className="relative z-10">
          <p className="text-(--accent) text-[10px] tracking-[0.4em] uppercase font-mono mb-6">
            ——— {t("eyebrow")}
          </p>

          <h2 className="font-sans font-bold text-[clamp(3rem,10vw,8rem)] text-fg leading-[0.9] tracking-tight mb-12 max-w-4xl">
            {t("title_1")}{" "}
            <span className="text-(--accent)">{t("title_2")}</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-14">
            {/* Email copy button */}
            <button
              onClick={handleCopy}
              className="group inline-flex items-center gap-3 px-6 py-3.5 border border-theme hover:border-(--accent) bg-surface hover:bg-(--accent)/5 text-fg transition-all duration-200 text-sm"
            >
              <Mail size={15} className="text-(--accent) shrink-0" />
              <span className="font-mono text-xs">{siteConfig.email}</span>
              {copied ? (
                <Check size={13} className="text-(--accent) shrink-0" />
              ) : (
                <Copy size={13} className="text-fg-25 group-hover:text-fg-55 transition-colors shrink-0" />
              )}
            </button>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 border border-theme hover:border-(--accent) text-fg-40 hover:text-(--accent) transition-all duration-200"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <p className="text-fg-20 text-[10px] font-mono tracking-widest uppercase">
            © {new Date().getFullYear()} {siteConfig.ownerName} — {t("footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
