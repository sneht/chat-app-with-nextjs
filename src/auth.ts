import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import authConfig from "./auth.config";
import prisma from "../prisma/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  // providers: [GitHub, Google],
  ...authConfig,
  callbacks: {
    async signIn({ account, credentials }) {
      return true;
    },
    session({ session, token }) {
      const { userDetails } = token;
      if (userDetails) {
        session.user = { ...session.user, ...userDetails };
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.email) {
        return null;
      }
      const userDetails = await prisma.user.findFirst({
        where: {
          email: token?.email,
          emailVerified: { not: null },
          isActive: true,
        },
      });
      return { ...token, userDetails };
    },
  },
});
