import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/skills?q=&category=&limit=50
// Auth: public (read-only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() ?? "";
    const category = searchParams.get("category")?.trim() ?? "";
    const limitParam = parseInt(searchParams.get("limit") ?? "50", 10);
    const limit = isNaN(limitParam) ? 50 : Math.min(Math.max(1, limitParam), 100);

    const skills = await prisma.skill.findMany({
      where: {
        isActive: true,
        ...(q
          ? {
              OR: [
                { nameZh: { contains: q, mode: "insensitive" } },
                { nameEn: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(category ? { category } : {}),
      },
      orderBy: [{ isCustom: "asc" }, { nameZh: "asc" }],
      take: limit,
      select: {
        id: true,
        nameZh: true,
        nameEn: true,
        category: true,
        isCustom: true,
      },
    });

    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
