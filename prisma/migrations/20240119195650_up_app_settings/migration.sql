-- AlterTable
ALTER TABLE "appSettings" ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'pink2',
ALTER COLUMN "name" SET DEFAULT 'NextSaater',
ALTER COLUMN "baseline" SET DEFAULT 'Begin a SaaS project with Next.js, Prisma, and Stripe',
ALTER COLUMN "description" SET DEFAULT 'Begin a SaaS project with Next.js, Prisma, and Stripe';
