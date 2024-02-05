-- CreateTable
CREATE TABLE "StripeCoupon" (
    "id" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "amountOff" INTEGER,
    "created" INTEGER NOT NULL,
    "currency" TEXT,
    "duration" TEXT NOT NULL,
    "durationInMonths" INTEGER,
    "livemode" BOOLEAN NOT NULL,
    "maxRedemptions" INTEGER,
    "metadata" JSONB NOT NULL,
    "name" TEXT,
    "percentOff" DOUBLE PRECISION NOT NULL,
    "redeemBy" INTEGER,
    "timesRedeemed" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL,

    CONSTRAINT "StripeCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponMRRSPlan" (
    "couponId" TEXT NOT NULL,
    "MRRSPlanId" TEXT NOT NULL,

    CONSTRAINT "CouponMRRSPlan_pkey" PRIMARY KEY ("couponId","MRRSPlanId")
);

-- AddForeignKey
ALTER TABLE "CouponMRRSPlan" ADD CONSTRAINT "CouponMRRSPlan_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "StripeCoupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponMRRSPlan" ADD CONSTRAINT "CouponMRRSPlan_MRRSPlanId_fkey" FOREIGN KEY ("MRRSPlanId") REFERENCES "MRRSPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
