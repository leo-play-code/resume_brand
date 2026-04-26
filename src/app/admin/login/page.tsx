import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GitHubIcon } from "@/components/ui/Icons";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <p className="text-purple-400 text-xs font-mono tracking-[0.3em] uppercase mb-6">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-white/40 text-sm mb-10">
          Sign in with your GitHub account to manage content.
        </p>

        <a
          href="/api/auth/signin/github"
          className="flex items-center justify-center gap-3 w-full px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-purple-500/40 hover:bg-purple-500/[0.08] text-white transition-all duration-300 text-sm font-medium"
        >
          <GitHubIcon size={18} />
          Continue with GitHub
        </a>
      </div>
    </div>
  );
}
