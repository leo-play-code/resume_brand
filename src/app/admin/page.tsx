import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  const [projects, tech, experience] = await Promise.all([
    prisma.project.count(),
    prisma.techStack.count(),
    prisma.experience.count(),
  ]);
  return { projects, tech, experience };
}

const CARDS = [
  { label: "Projects", stat: "projects" as const, href: "/admin/projects" },
  { label: "Tech Items", stat: "tech" as const, href: "/admin/tech" },
  { label: "Experience", stat: "experience" as const, href: "/admin/experience" },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-white/35 text-sm mb-8">Manage your portfolio content.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {CARDS.map(({ label, stat, href }) => (
          <Link
            key={stat}
            href={href}
            className="block px-5 py-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-purple-500/30 hover:bg-purple-500/[0.04] transition-all duration-300 group"
          >
            <p className="text-3xl font-bold text-white mb-1 group-hover:gradient-text transition-all">
              {stats[stat]}
            </p>
            <p className="text-white/40 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <p className="text-white/20 text-xs font-mono">
        Changes are reflected on the live site immediately after saving.
      </p>
    </div>
  );
}
