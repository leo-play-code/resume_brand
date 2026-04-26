import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

const DEFAULT_SETTINGS = {
  id: "singleton",
  backgroundDark: "#050510",
  backgroundLight: "#f4f1ff",
};

// Public function — called by server components, no "use server" needed
export async function getSiteSettings() {
  const record = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!record) {
    return { ...DEFAULT_SETTINGS };
  }

  return record;
}

// Admin-only server action
export async function updateSiteSettings(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const backgroundDark = (formData.get("backgroundDark") as string)?.trim() ?? "";
  const backgroundLight = (formData.get("backgroundLight") as string)?.trim() ?? "";

  if (!HEX_COLOR_RE.test(backgroundDark) || !HEX_COLOR_RE.test(backgroundLight)) {
    return { error: "Invalid hex color format" };
  }

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { backgroundDark, backgroundLight },
    create: { id: "singleton", backgroundDark, backgroundLight },
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return { success: true };
}
