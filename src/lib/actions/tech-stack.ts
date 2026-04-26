"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
}

export async function addTechItem(formData: FormData) {
  await requireAdmin();

  await prisma.techStack.create({
    data: {
      name: formData.get("name") as string,
      color: (formData.get("color") as string) || "#ffffff",
      rowNumber: parseInt((formData.get("row_number") as string) || "1"),
      displayOrder: parseInt((formData.get("display_order") as string) || "0"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/tech");
}

export async function deleteTechItem(id: string) {
  await requireAdmin();
  await prisma.techStack.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/tech");
}
