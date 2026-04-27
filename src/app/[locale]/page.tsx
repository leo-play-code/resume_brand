import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ContactSection from "@/components/sections/ContactSection";
import CustomCursor from "@/components/ui/CustomCursor";

import { projects as staticProjects } from "@/lib/data/projects";
import { experiences as staticExperiences } from "@/lib/data/experience";
import { techStackRow1, techStackRow2 } from "@/lib/data/tech-stack";
import { prisma } from "@/lib/prisma";

async function getData(locale: string) {
  try {
    const [dbProjects, dbTech, dbExperiences] = await Promise.all([
      prisma.project.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.techStack.findMany({ orderBy: { displayOrder: "asc" } }),
      prisma.experience.findMany({ orderBy: { displayOrder: "asc" } }),
    ]);

    const projects =
      dbProjects.length > 0
        ? dbProjects.map((p) => ({
            id: p.id,
            name: locale === "en" ? (p.nameEn || p.name) : p.name,
            description: locale === "en" ? (p.descriptionEn || p.description) : p.description,
            longDescription: locale === "en" ? (p.longDescriptionEn || p.longDescription) : p.longDescription,
            videoUrl: p.videoUrl,
            githubUrl: p.githubUrl ?? undefined,
            liveUrl: p.liveUrl ?? undefined,
            techStack: p.techStack,
            featured: p.featured,
            heroType: p.heroType,
            heroJsCode: p.heroJsCode ?? null,
          }))
        : staticProjects;

    const techRow1 =
      dbTech.length > 0
        ? dbTech.filter((t) => t.rowNumber === 1).map((t) => ({ name: t.name, color: t.color, icon: t.icon ?? undefined }))
        : techStackRow1;

    const techRow2 =
      dbTech.length > 0
        ? dbTech.filter((t) => t.rowNumber === 2).map((t) => ({ name: t.name, color: t.color, icon: t.icon ?? undefined }))
        : techStackRow2;

    const experiences =
      dbExperiences.length > 0
        ? dbExperiences.map((e) => ({
            company: locale === "en" && e.companyEn ? e.companyEn : e.company,
            role: locale === "en" ? (e.roleEn || e.role) : e.role,
            period: e.period,
            description: locale === "en" && e.descriptionEn.length > 0 ? e.descriptionEn : e.description,
            type: e.type as "work" | "education",
          }))
        : staticExperiences;

    return { projects, techRow1, techRow2, experiences };
  } catch {
    return {
      projects: staticProjects,
      techRow1: techStackRow1,
      techRow2: techStackRow2,
      experiences: staticExperiences,
    };
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { projects, techRow1, techRow2, experiences } = await getData(locale);

  return (
    <main>
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <TechStackSection row1={techRow1} row2={techRow2} />
      <ProjectsSection projects={projects} />
      <TimelineSection experiences={experiences} />
      <ContactSection />
    </main>
  );
}
