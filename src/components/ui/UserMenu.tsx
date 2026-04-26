"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LayoutDashboard, LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("github")}
        className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-theme text-fg-60 hover:text-fg hover:border-purple-500/50 transition-all duration-300"
      >
        <LogIn size={15} />
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-purple-500/60 transition-all duration-300"
      >
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
            {session.user?.name?.charAt(0) ?? "U"}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-theme bg-base shadow-xl shadow-black/20 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-theme">
            <p className="text-fg text-sm font-medium truncate">{session.user?.name}</p>
            <p className="text-fg-40 text-xs truncate">{session.user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-fg-60 hover:text-fg hover:bg-purple-500/8 transition-colors"
            >
              <LayoutDashboard size={15} />
              Admin Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-fg-60 hover:text-fg hover:bg-purple-500/8 transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
