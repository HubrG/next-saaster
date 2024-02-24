-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "active" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "UserSettings" ALTER COLUMN "theme" SET DEFAULT 'indigo';

-- AlterTable
ALTER TABLE "appSettings" ALTER COLUMN "name" SET DEFAULT 'SaaSeed',
ALTER COLUMN "baseline" SET DEFAULT 'Just develop your best feature, the rest is already done and well done.',
ALTER COLUMN "description" SET DEFAULT 'SaaSeed is a SaaS starter kit based on NextJS that allows you to develop your best feature, the rest is already done and well done. It is a full-stack solution that includes a modern frontend, a scalable backend, and a secure infrastructure. It is designed to help you save time and money, and to focus on what really matters: your business. SaaSeed is built with the latest technologies and best practices, and it is fully customizable and extensible.';
