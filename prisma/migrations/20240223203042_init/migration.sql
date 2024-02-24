-- AlterTable
ALTER TABLE "Feature" ADD COLUMN     "displayOnCard" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "appSettings" ALTER COLUMN "name" SET DEFAULT 'Saasfairy';
