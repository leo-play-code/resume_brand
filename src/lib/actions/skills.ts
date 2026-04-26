"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

export async function addSkill(formData: FormData) {
  await requireAdmin();

  const nameZh = (formData.get("nameZh") as string)?.trim() ?? "";
  const nameEnRaw = (formData.get("nameEn") as string)?.trim() ?? "";
  const nameEn = nameEnRaw || nameZh;
  const category = (formData.get("category") as string)?.trim() ?? "";

  if (!nameZh) {
    return { error: "nameZh 為必填" };
  }

  const existing = await prisma.skill.findFirst({
    where: {
      OR: [
        { nameZh: { equals: nameZh, mode: "insensitive" } },
        { nameEn: { equals: nameEn, mode: "insensitive" } },
      ],
    },
  });

  if (existing) {
    return { error: "技能已存在" };
  }

  const skill = await prisma.skill.create({
    data: {
      nameZh,
      nameEn,
      category,
      isCustom: true,
    },
  });

  revalidatePath("/admin/tech");
  return { success: true, skill };
}

export async function deleteSkill(id: string) {
  await requireAdmin();

  const skill = await prisma.skill.findFirst({ where: { id } });

  if (!skill) {
    throw new Error("Skill not found");
  }

  if (!skill.isCustom) {
    throw new Error("Cannot delete preset skills");
  }

  await prisma.skill.delete({ where: { id } });
  revalidatePath("/admin/tech");
}
