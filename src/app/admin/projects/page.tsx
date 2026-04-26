import { prisma } from "@/lib/prisma";
import { addProject, deleteProject } from "@/lib/actions/projects";
import ProjectsAdminClient from "./ProjectsAdminClient";

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({ orderBy: { displayOrder: "asc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-fg">Projects</h1>
          <p className="text-fg-35 text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <ProjectsAdminClient
        projects={projects}
        addProject={addProject}
        deleteProject={deleteProject}
      />
    </div>
  );
}
