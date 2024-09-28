import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "../prisma/prisma";

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Username",
          type: "text",
          placeholder: "your-placeholder",
        },
      },
      async authorize(credentials) {
        const { email } = credentials as {
          email: string;
        };

        const isUserExist = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        const {
          id,
          username,
          email: email_address,
          profileImage,
        } = isUserExist || {};
        return {
          id,
          name: username,
          email: email_address,
          image: profileImage,
        };
      },
    }),
  ],
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
} satisfies NextAuthConfig;
