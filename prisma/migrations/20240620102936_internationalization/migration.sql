-- CreateTable
CREATE TABLE "InternationalizationEnabledList" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternationalizationEnabledList_pkey" PRIMARY KEY ("id")
);
