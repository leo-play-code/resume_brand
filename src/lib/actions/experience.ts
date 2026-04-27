"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

export async function addExperience(formData: FormData) {
  await requireAdmin();

  const descRaw = (formData.get("description") as string) ?? "";
  const description = descRaw.split("\n").map((s) => s.trim()).filter(Boolean);

  const descEnRaw = (formData.get("description_en") as string) ?? "";
  const descriptionEn = descEnRaw.split("\n").map((s) => s.trim()).filter(Boolean);

  await prisma.experience.create({
    data: {
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      period: formData.get("period") as string,
      description,
      roleEn: (formData.get("role_en") as string) || "",
      descriptionEn,
      type: (formData.get("type") as string) || "work",
      displayOrder: parseInt((formData.get("display_order") as string) || "0"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/experience");
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
