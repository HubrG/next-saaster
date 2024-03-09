-- DropForeignKey
ALTER TABLE "OrganizationInvitation" DROP CONSTRAINT "OrganizationInvitation_organizationId_fkey";

-- AlterTable
ALTER TABLE "appSettings" ALTER COLUMN "description" SET DEFAULT 'Fairysaas is a SaaS starter kit based on NextJS that allows you to develop your best feature, the rest is already done and well done. It is a full-stack solution that includes a modern frontend, a scalable backend, and a secure infrastructure. It is designed to help you save time and money, and to focus on what really matters: your business. SaaSeed is built with the latest technologies and best practices, and it is fully customizable and extensible.';

-- AddForeignKey
ALTER TABLE "OrganizationInvitation" ADD CONSTRAINT "OrganizationInvitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
