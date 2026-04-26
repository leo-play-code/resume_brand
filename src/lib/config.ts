/**
 * Central site configuration — reads from NEXT_PUBLIC_* env vars.
 * NEXT_PUBLIC_ prefix required for values used in client components.
 * All values fall back to safe defaults so the site works even without .env.local.
 */
export const siteConfig = {
  ownerName: process.env.NEXT_PUBLIC_OWNER_NAME ?? "Your Name",
  ownerInitials: process.env.NEXT_PUBLIC_OWNER_INITIALS ?? "YN",
  email: process.env.NEXT_PUBLIC_OWNER_EMAIL ?? "your@email.com",
  tagline:
    process.env.NEXT_PUBLIC_OWNER_TAGLINE ??
    "I build tools for the web and AI. Passionate about creating impactful products and beautiful, performant experiences.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yoursite.com",
  metaDescription:
    process.env.NEXT_PUBLIC_META_DESCRIPTION ??
    "Personal portfolio of a Full Stack Engineer specializing in AI tools, web applications, and open source projects.",
  social: {
    github:
      process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/yourusername",
    linkedin:
      process.env.NEXT_PUBLIC_LINKEDIN_URL ??
      "https://linkedin.com/in/yourusername",
    twitter:
      process.env.NEXT_PUBLIC_TWITTER_URL ??
      "https://twitter.com/yourusername",
  },
} as const;
