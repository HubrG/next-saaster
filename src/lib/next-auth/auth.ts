import { StripeManager } from "@/app/[locale]/admin/classes/stripeManager";
import { createAudience } from "@/src/helpers/emails/audience";
import { createContact } from "@/src/helpers/emails/contact";
import { stripeCustomerIdManager } from "@/src/helpers/functions/stripeCustomerIdManager";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { isCuid } from "@paralleldrive/cuid2";
import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../prisma";
import { env } from "../zodEnv";
const stripeManager = new StripeManager();
 export const fetchSession = async () => {
   const session = await getServerSession(authOptions);
   return session;
 };
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      profile: async (profile) => {
        return {
          id: profile.id,
        };
      },
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
        };
      },
      authorization: {
        params: {
          prompt: "select_account", 
        },
      },
    }),
    Email({
      server: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT as any,
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
      let role = "USER" as UserRole;
      // First connexion for the first user (ADMIN)
      if (account && account.provider === "github") {
        // We check if this is the user's first connection via GitHub
        const isFirstUser = (await prisma.user.count()) === 1;
        role = isFirstUser
          ? ("SUPER_ADMIN" as UserRole)
          : (token.role as UserRole) ?? ("USER" as UserRole);
        // We update the role in the database and on the token before loading
        if (isFirstUser) {
          await prisma.user.update({
            where: { email: token.email ?? "" },
            data: { role: role },
          });
        }
        token = {
          ...token,
          id: token.id,
          role: role,
          user: user,
          customerId: token.customerId ?? "",
          uid: token.sub,
        };
      } else {
        token = {
          ...token,
          id: token.id,
          user: user,
          role: token.role,
          customerId: token.customerId ?? "",
          uid: token.id,
        };
      }

      return { ...token, ...user, ...profile };
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.sub as string;
        session.user.customerId = token.customerId as string;
        session.user.userId = isCuid(token.uid as string)
          ? // if it's Google, Mail or Credential, we use the uid as userId, because token.uid appear as cuid()
            (token.uid as string)
          : // if it's GitHub, we use the sub as userId, because it's the only way to get the user's db id
            (token.sub as string);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login/error",
    error: "/login/error",
  },
  events: {
    createUser: async (message) => {
      // Create Resend contact (and audience Registered Users if not already created)
      if (env.RESEND_API_KEY) {
        const newNewsletterAudience = await createAudience({
          name: "Newsletter",
        });
        if (
          newNewsletterAudience.success &&
          newNewsletterAudience.data &&
          message.user.email
        ) {
          await createContact({
            email: message.user.email,
            audienceId: newNewsletterAudience.data.id,
            first_name: message.user.name ?? message.user.email.split("@")[0],
          });
        }
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
      // Create immediatly Customer ID for Stripe
      if (
        (env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET && message.user.id,
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
    signIn: async (message) => {
      // Verify if user has been invited to an organization and has accepted it
      if (message.user.id) {
        const invited = await prisma.organizationInvitation.findFirst({
          where: {
            email: message.user.email ?? "",
            isAccepted: true,
          },
        });
        // We update him
        if (invited) {
          await prisma.user.update({
            where: { id: message.user.id },
            data: {
              organizationId: invited.organizationId,
            },
          });
          // We delete him from organizationInvitations
          await prisma.organizationInvitation.delete({
            where: { id: invited.id },
          });
          // We add subscription if needed through owner
          const organization = await prisma.organization.findFirst({
            where: { id: invited.organizationId },
          });
          if (!organization) {
            return;
          }
          const owner = await prisma.user.findFirst({
            where: { id: organization.ownerId },
          });
          if (owner) {
            // We check the owner subscription through userSubscription
            const userSubscription = await prisma.userSubscription.findFirst({
              where: { userId: owner.id },
              orderBy: { createdAt: "desc" },
              include: {
                subscription: {
                  include: {
                    price: {
                      include: {
                        productRelation: {
                          include: {
                            PlanRelation: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });
            // We add subscription to the user
            if (userSubscription) {
              await prisma.userSubscription.create({
                data: {
                  userId: message.user.id,
                  isActive: userSubscription.isActive,
                  subscriptionId: userSubscription.subscriptionId,
                  creditRemaining:
                    userSubscription.subscription.price?.productRelation
                      ?.PlanRelation?.creditAllouedByMonth ?? null,
                },
              });
              // if subscription is active, we add quantity to Stripe subscription
              if (userSubscription.isActive) {
                // We count the number of users in the organization
                const users = await prisma.user.count({
                  where: { organizationId: invited.organizationId },
                });
                // We update the quantity
                const upSub = await stripeManager.updateSubscription({
                  subscriptionId: userSubscription.subscriptionId,
                  data: {
                    quantity: users,
                  },
                });
                if (!upSub.success) {
                  // We delete the userSubscription
                  await prisma.userSubscription.delete({
                    where: {
                      userId_subscriptionId: {
                        userId: message.user.id,
                        subscriptionId: userSubscription.subscriptionId,
                      },
                    },
                  });
                  // We delete the user from organization
                  await prisma.user.update({
                    where: { id: message.user.id },
                    data: {
                      organizationId: null,
                    },
                  });
                  console.error("Error updating subscription quantity:", upSub);
                }
              }
            }
          }
        }
      }
    },
  },
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
