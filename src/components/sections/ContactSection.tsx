"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
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
          scrollTrigger: { trigger: contentRef.current, start: "top 85%" },
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
    <section ref={sectionRef} id="contact" className="relative py-32 px-6 overflow-hidden">
      {/* Bottom radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_100%,rgba(139,92,246,0.12),transparent)]" />

      <div ref={contentRef} className="relative max-w-2xl mx-auto text-center">
        <p className="text-purple-400 text-xs font-mono tracking-[0.3em] uppercase mb-6">
          Contact
        </p>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-fg mb-6 leading-tight">
          Let&apos;s work{" "}
          <span className="gradient-text">together.</span>
        </h2>

        <p className="text-fg-35 text-base md:text-lg mb-12 leading-relaxed max-w-md mx-auto">
          Open to new opportunities, collaborations, and interesting
          conversations. Don&apos;t be a stranger.
        </p>

        {/* Email copy button */}
        <button
          onClick={handleCopy}
          className="group inline-flex items-center gap-3 px-7 py-4 rounded-full border border-theme bg-surface hover:border-purple-500/45 hover:bg-purple-500/8 text-fg transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] mb-12 text-sm md:text-base w-full sm:w-auto justify-center"
        >
          <Mail size={18} className="text-purple-400 shrink-0" />
          <span className="font-mono">{siteConfig.email}</span>
          {copied ? (
            <Check size={15} className="text-green-400 shrink-0" />
          ) : (
            <Copy size={15} className="text-fg-25 group-hover:text-fg-55 transition-colors shrink-0" />
          )}
        </button>

        {/* Social links */}
        <div className="flex items-center justify-center gap-3 mb-16">
          {SOCIALS.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-3 rounded-full border border-theme bg-surface hover:border-purple-500/35 hover:bg-purple-500/8 text-fg-45 hover:text-fg transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
            >
              <Icon size={19} />
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-fg-20 text-xs font-mono">
          © {new Date().getFullYear()} {siteConfig.ownerName}. Built with Next.js &amp; GSAP.
        </p>
      </div>
    </section>
  );
}
