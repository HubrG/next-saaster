import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  AuthOptions, getServerSession
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "../prisma";
import { env } from "./env";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ? profile.role : "USER",
          customerId: profile.customerId ? profile.customerId : "",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Adresse email",
          type: "text",
          placeholder: "",
        },
        password: { label: "Password", type: "password" },
      },

      authorize: async (
        credentials: Record<"email" | "password", string> | undefined
      ) => {
        if (!credentials) {
          return null;
        }

        const user = (await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            hashedPassword: true,
            role: true,
            customerId: true,
          },
        })) as User;

        if (
          user &&
          user.hashedPassword &&
          (await bcrypt.compare(credentials.password, user.hashedPassword))
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && account.provider === "github") {
        // We check if this is the user's first connection via GitHub
        const isFirstUser = (await prisma.user.count()) === 1;
        const role = isFirstUser ? "SUPER_ADMIN" : "USER";
        // We update the role in the database
        if (isFirstUser) {
          await prisma.user.update({
            where: { email: token.email ?? "" },
            data: { role: role },
          });
          // We change the role of the user in the JWT to admin
          token.role = role;
        }
      }
      token = {
        ...token,
        role: token.role,
        id: token.sub ?? "",
        customerId: token.customerId ?? "",
      };

      return { ...token, ...user, ...profile };
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.sub;
      session.user.customerId = token.customerId;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
