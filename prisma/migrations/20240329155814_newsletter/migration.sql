-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isNewsletterSub" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "appSettings" ALTER COLUMN "description" SET DEFAULT 'NextJS SaaS starter kit for rapid development: only focus on main features, rest assured with a modern frontend, scalable and secure backend. Save effort & money. ';
