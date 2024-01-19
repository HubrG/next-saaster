import GithubProvider from "next-auth/providers/github";
import { env } from "./env";
import { AuthOptions, getServerSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
type ExtendedUser = {
  id: string;
  email: string;
  name: string;
  role: string; // Ajoutez les champs supplémentaires ici
};
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
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
    async jwt({ token, user, account }) {
      const extendedUser = user as ExtendedUser;
      if (account && extendedUser && account.provider === "github") {
        // We check if this is the user's first connection via GitHub
        const isFirstUser = (await prisma.user.count()) === 1;
        const isSettingsEmpty = (await prisma.appSettings.count()) === 0;
        const role = isFirstUser ? "ADMIN" : "USER";
        // We update the role in the database
        if (isFirstUser) {
          await prisma.user.update({
            where: { email: extendedUser.email },
            data: { role: role },
          });
          // We change the role of the user in the JWT to admin
          extendedUser.role = role;
          token.user = { ...extendedUser, role: extendedUser.role };
        }
        if (isSettingsEmpty) {
          await prisma.appSettings.createMany({
            data: {},
            skipDuplicates: true,
          });
        }
      } else if (token.user) {
        // For subsequent logins, the role is already in the token
        token.user = { ...(token.user as ExtendedUser) };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
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
