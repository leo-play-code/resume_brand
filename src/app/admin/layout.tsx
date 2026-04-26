import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/tech", label: "Tech Stack" },
  { href: "/admin/experience", label: "Experience" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#07070f] text-white">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-56 border-r border-white/[0.06] bg-[#050510] flex flex-col">
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <Link href="/" className="text-sm font-mono gradient-text font-bold">
            ← Portfolio
          </Link>
          <p className="text-white/30 text-xs mt-1 truncate">
            {session.user?.name}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-150"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.06]">
          <a
            href="/api/auth/signout"
            className="block px-3 py-2 rounded-lg text-xs text-white/30 hover:text-red-400 transition-colors duration-150"
          >
            Sign out
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 min-h-screen">{children}</main>
    </div>
  );
}
