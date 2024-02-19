import { stripeCustomerIdManager } from "@/src/functions/stripeCustomerIdManager";
import { createAudience } from "@/src/helpers/emails/audience";
import { createContact } from "@/src/helpers/emails/contact";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole } from "@prisma/client";
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
      let role: UserRole = "USER";
      // First connexion for the first user (ADMIN)
      if (account && account.provider === "github") {
        // We check if this is the user's first connection via GitHub
        const isFirstUser = (await prisma.user.count()) === 1;
        role = isFirstUser ? "SUPER_ADMIN" : token.role;
        // We update the role in the database
        if (isFirstUser) {
          await prisma.user.update({
            where: { email: token.email ?? "" },
            data: { role: role },
          });
        }
      } else {
        role = token.role;
      }
      token = {
        ...token,
        id: token.id,
        role: role,
        customerId: token.customerId ?? "",
      };
      return { ...token, ...user, ...profile, role };
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
  events: {
    createUser: async (message) => {
      // Create Resend contact (and audience Registered Users if not already created)
      if (env.RESEND_API_KEY) {
        const newAudience = await createAudience({
          name: "Registered Users",
        });
        if (newAudience.success && newAudience.data && message.user.email) {
          await createContact({
            email: message.user.email,
            audienceId: newAudience.data.id,
            first_name: message.user.name ?? message.user.email.split("@")[0],
          });
        }
      }
      // Create Customer ID for Stripe
      if (
        (env.STRIPE_SECRET_KEY && env.STRIPE_SIGNIN_SECRET && message.user.id,
        message.user.email)
      ) {
        try {
          const customerId = await stripeCustomerIdManager({
            id: message.user.id,
            email: message.user.email,
            name: message.user.name ?? message.user.email.split("@")[0],
          });
          if (!customerId) {
            throw new Error("Customer ID not found");
          }
        } catch (error) {
          console.error("Error creating customer ID:", error);
        }
      }
    },
  },
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
