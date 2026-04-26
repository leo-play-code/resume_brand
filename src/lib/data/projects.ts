export interface Project {
  id: string;
  name: string;
  /** One-line tagline shown below the name */
  description: string;
  /** 2–3 sentences shown in the card body */
  longDescription: string;
  /** Path relative to /public, e.g. /videos/demo.mp4 — leave empty for placeholder */
  videoUrl: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  featured: boolean;
  heroType?: string;
  heroJsCode?: string | null;
}

export const projects: Project[] = [
  {
    id: "job-pilot",
    name: "Job Pilot",
    description: "AI-powered job application assistant",
    longDescription:
      "Automates job searching and application tracking with AI-generated cover letters, resume tailoring, and real-time application status management.",
    videoUrl: "/videos/job-pilot.mp4",
    githubUrl: "https://github.com/yourusername/job-pilot",
    liveUrl: "https://job-pilot.vercel.app",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI", "Prisma"],
    featured: true,
  },
  {
    id: "resume-brand",
    name: "Resume Brand",
    description: "Personal brand & portfolio site",
    longDescription:
      "This very website — built with Next.js and GSAP for Apple-like scroll animations, a custom dark neon design system, and smooth Lenis scrolling.",
    videoUrl: "",
    githubUrl: "https://github.com/yourusername/resume-brand",
    techStack: ["Next.js", "GSAP", "Tailwind CSS", "TypeScript", "Lenis"],
    featured: true,
  },
  {
    id: "project-3",
    name: "Project Three",
    description: "Short one-line tagline here",
    longDescription:
      "Describe what this project does, the problem it solves, and the impact it had. Replace this placeholder with your real project details.",
    videoUrl: "/videos/project-3.mp4",
    githubUrl: "https://github.com/yourusername/project-3",
    techStack: ["React", "Python", "FastAPI", "Docker"],
    featured: true,
  },
  {
    id: "project-4",
    name: "Project Four",
    description: "Another cool project tagline",
    longDescription:
      "Describe what this project does, the problem it solves, and the impact it had. Replace this placeholder with your real project details.",
    videoUrl: "",
    githubUrl: "https://github.com/yourusername/project-4",
    techStack: ["Python", "LangChain", "OpenAI", "Redis"],
    featured: false,
  },
];
