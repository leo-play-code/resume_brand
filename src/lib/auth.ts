import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /** Only allow login from the configured admin GitHub account.
     *  account.providerAccountId is the GitHub numeric user ID (string). */
    async signIn({ account }) {
      const adminId = process.env.ADMIN_GITHUB_ID;
      if (!adminId) return false;
      return account?.providerAccountId === adminId;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
};
