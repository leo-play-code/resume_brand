"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { syncProjectTechToStack } from "@/lib/actions/tech-stack";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

export async function addProject(formData: FormData) {
  await requireAdmin();

  const techRaw = (formData.get("tech_stack") as string) ?? "";
  const techStack = techRaw.split(",").map((s) => s.trim()).filter(Boolean);

  await prisma.project.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      longDescription: formData.get("long_description") as string,
      nameEn: (formData.get("name_en") as string) || null,
      descriptionEn: (formData.get("description_en") as string) || null,
      longDescriptionEn: (formData.get("long_description_en") as string) || null,
      videoUrl: (formData.get("video_url") as string) || "",
      heroType: (formData.get("hero_type") as string) || "mp4",
      heroJsCode: (formData.get("hero_js_code") as string) || null,
      githubUrl: (formData.get("github_url") as string) || null,
      liveUrl: (formData.get("live_url") as string) || null,
      techStack,
      featured: formData.get("featured") === "on",
      displayOrder: parseInt((formData.get("display_order") as string) || "0"),
    },
  });

  await syncProjectTechToStack(techStack);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();

  const techRaw = (formData.get("tech_stack") as string) ?? "";
  const techStack = techRaw.split(",").map((s) => s.trim()).filter(Boolean);

  await prisma.project.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      longDescription: formData.get("long_description") as string,
      nameEn: (formData.get("name_en") as string) || null,
      descriptionEn: (formData.get("description_en") as string) || null,
      longDescriptionEn: (formData.get("long_description_en") as string) || null,
      videoUrl: (formData.get("video_url") as string) || "",
      heroType: (formData.get("hero_type") as string) || "mp4",
      heroJsCode: (formData.get("hero_js_code") as string) || null,
      githubUrl: (formData.get("github_url") as string) || null,
      liveUrl: (formData.get("live_url") as string) || null,
      techStack,
      featured: formData.get("featured") === "on",
      displayOrder: parseInt((formData.get("display_order") as string) || "0"),
    },
  });

  await syncProjectTechToStack(techStack);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
