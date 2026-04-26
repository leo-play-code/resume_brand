import { prisma } from "@/lib/prisma";
import { addExperience, deleteExperience } from "@/lib/actions/experience";
import ExperienceAdminClient from "./ExperienceAdminClient";

export default async function ExperienceAdminPage() {
  const items = await prisma.experience.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-fg">Experience</h1>
          <p className="text-fg-35 text-sm mt-1">
            {items.length} entr{items.length !== 1 ? "ies" : "y"}
          </p>
        </div>
      </div>

      <ExperienceAdminClient
        items={items}
        addExperience={addExperience}
        deleteExperience={deleteExperience}
      />
    </div>
  );
}
