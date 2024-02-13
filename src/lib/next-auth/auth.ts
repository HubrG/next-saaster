import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../prisma";
import { env } from "./env";

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
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role ? profile.role : "USER",
          customerId: profile.customerId ? profile.customerId : "",
        };
      },
    }),
    Email({
      server: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      },
      from: env.RESEND_FROM,
    }),
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        //
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) {
          return null;
        }

        const passwordCorrect = await bcrypt.compare(
          credentials?.password || "",
          user.password ?? ""
        );

        console.log({ passwordCorrect });

        if (passwordCorrect) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            customerId: user.customerId,
          };
        }

        return null;
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
        id: token.id,
        role: token.role,
        customerId: token.customerId ?? "",
      };

      return { ...token, ...user, ...profile };
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
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
