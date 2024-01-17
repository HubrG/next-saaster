-- CreateTable
CREATE TABLE "appSettings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appSettings_pkey" PRIMARY KEY ("id")
);
