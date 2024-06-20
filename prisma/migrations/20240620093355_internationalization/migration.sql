-- AlterTable
ALTER TABLE "appSettings" ADD COLUMN     "activeInternationalization" BOOLEAN DEFAULT true;

-- CreateTable
CREATE TABLE "InternationalizationDictionary" (
    "id" TEXT NOT NULL,
    "word" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternationalizationDictionary_pkey" PRIMARY KEY ("id")
);
