import { prisma } from "@/lib/prisma";
import { addTechItem, deleteTechItem, reorderTechItems } from "@/lib/actions/tech-stack";
import { deleteSkill } from "@/lib/actions/skills";
import TechAdminClient from "./TechAdminClient";

export default async function TechAdminPage() {
  const [items, customSkills] = await Promise.all([
    prisma.techStack.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.skill.findMany({
      where: { isCustom: true, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-fg">Tech Stack</h1>
          <p className="text-fg-35 text-sm mt-1">{items.length} items</p>
        </div>
      </div>

      <TechAdminClient
        items={items}
        addTechItem={addTechItem}
        deleteTechItem={deleteTechItem}
        reorderTechItems={reorderTechItems}
        customSkills={customSkills}
        deleteSkill={deleteSkill}
      />
    </div>
  );
}
