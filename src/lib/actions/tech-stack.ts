"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getTechIcon } from "@/lib/tech-icon-map";

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

/**
 * Sync a list of tech names from a project's tech_stack into the TechStack table.
 * - Names that already exist (case-insensitive) are skipped.
 * - New names are inserted with icon/color from TECH_ICON_MAP (fallback color #8b5cf6).
 * - rowNumber is balanced: go to row1 if row1 count <= row2 count, else row2.
 * - displayOrder = max existing order in the same row + 1.
 */
export async function syncProjectTechToStack(names: string[]): Promise<void> {
  if (names.length === 0) return;

  const existing = await prisma.techStack.findMany({
    select: { name: true, rowNumber: true, displayOrder: true },
  });

  const existingNames = existing.map((t) => t.name.toLowerCase());

  const newNames = names.filter(
    (name) => !existingNames.includes(name.toLowerCase())
  );

  if (newNames.length === 0) return;

  let row1Count = existing.filter((t) => t.rowNumber === 1).length;
  let row2Count = existing.filter((t) => t.rowNumber === 2).length;

  let maxRow1Order = existing
    .filter((t) => t.rowNumber === 1)
    .reduce((max, t) => Math.max(max, t.displayOrder), 0);
  let maxRow2Order = existing
    .filter((t) => t.rowNumber === 2)
    .reduce((max, t) => Math.max(max, t.displayOrder), 0);

  for (const name of newNames) {
    const iconEntry = getTechIcon(name);

    const rowNumber = row1Count <= row2Count ? 1 : 2;
    const displayOrder = rowNumber === 1 ? maxRow1Order + 1 : maxRow2Order + 1;

    await prisma.techStack.create({
      data: {
        name,
        icon: iconEntry?.slug ?? null,
        color: iconEntry?.color ?? "#8b5cf6",
        rowNumber,
        displayOrder,
      },
    });

    if (rowNumber === 1) {
      row1Count++;
      maxRow1Order = displayOrder;
    } else {
      row2Count++;
      maxRow2Order = displayOrder;
    }
  }

  revalidatePath("/");
}
