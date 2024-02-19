-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "SaasTypes" AS ENUM ('PAY_ONCE', 'MRR_SIMPLE', 'METERED_USAGE', 'PER_SEAT', 'CUSTOM_PRICE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "MeteredMode" AS ENUM ('PACKAGE', 'UNIT');

-- CreateEnum
CREATE TYPE "MeteredBillingPeriod" AS ENUM ('DAY', 'WEEK', 'MONTH', 'YEAR');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "customerId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT DEFAULT 'nanny',
    "language" TEXT DEFAULT 'en',
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appSettings" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT 'NextSaaster',
    "baseline" TEXT DEFAULT 'Begin a SaaS project with Next.js, Prisma, and Stripe',
    "description" TEXT DEFAULT 'Begin a SaaS project with Next.js, Prisma, and Stripe',
    "theme" TEXT DEFAULT 'nanny',
    "roundedCorner" DOUBLE PRECISION DEFAULT 5,
    "defaultDarkMode" BOOLEAN DEFAULT true,
    "activeTopLoader" BOOLEAN DEFAULT true,
    "activeDarkMode" BOOLEAN DEFAULT true,
    "activeCtaOnNavbar" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "appSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "amount" INTEGER,
    "currency" TEXT,
    "invoice" TEXT,
    "description" TEXT,
    "status" TEXT,
    "StripePaymentId" TEXT,
    "stripeCustomerId" TEXT,
    "subscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "amount" INTEGER,
    "currency" TEXT DEFAULT 'usd',
    "planId" TEXT,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "stripeCustomerId" TEXT,
    "isMonthly" BOOLEAN DEFAULT false,
    "isYearly" BOOLEAN DEFAULT false,
    "isFree" BOOLEAN DEFAULT false,
    "nextPayment" TIMESTAMP(3),
    "canceled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaasSettings" (
    "id" TEXT NOT NULL,
    "saasType" "SaasTypes" NOT NULL DEFAULT 'MRR_SIMPLE',
    "activeYearlyPlans" BOOLEAN DEFAULT true,
    "activeMonthlyPlans" BOOLEAN DEFAULT true,
    "activeCreditSystem" BOOLEAN DEFAULT true,
    "activeRefillCredit" BOOLEAN DEFAULT true,
    "displayFeaturesByCategory" BOOLEAN DEFAULT false,
    "activeFeatureComparison" BOOLEAN DEFAULT false,
    "activeFeatureAdvancedComparison" BOOLEAN DEFAULT false,
    "currency" TEXT DEFAULT 'usd',
    "tax" DOUBLE PRECISION DEFAULT 0,
    "creditName" TEXT DEFAULT 'Credit name',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SaasSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT 'New plan',
    "description" TEXT DEFAULT 'New plan description',
    "isCustom" BOOLEAN DEFAULT false,
    "isPopular" BOOLEAN DEFAULT false,
    "isRecommended" BOOLEAN DEFAULT false,
    "isTrial" BOOLEAN DEFAULT false,
    "isFree" BOOLEAN DEFAULT false,
    "trialDays" INTEGER DEFAULT 0,
    "monthlyPrice" DOUBLE PRECISION DEFAULT 0,
    "yearlyPrice" DOUBLE PRECISION DEFAULT 0,
    "oncePrice" DOUBLE PRECISION DEFAULT 0,
    "creditAllouedByMonth" INTEGER DEFAULT 0,
    "stripeId" TEXT,
    "stripeYearlyPriceId" TEXT,
    "stripeMonthlyPriceId" TEXT,
    "unitLabel" TEXT DEFAULT '',
    "meteredUnit" INTEGER DEFAULT 0,
    "meteredMode" "MeteredMode" NOT NULL DEFAULT 'PACKAGE',
    "meteredBillingPeriod" "MeteredBillingPeriod" NOT NULL DEFAULT 'WEEK',
    "saasType" "SaasTypes" NOT NULL DEFAULT 'MRR_SIMPLE',
    "active" BOOLEAN DEFAULT false,
    "position" INTEGER DEFAULT 9999,
    "deleted" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT '',
    "alias" TEXT,
    "description" TEXT DEFAULT '',
    "onlyOnSelectedPlans" BOOLEAN DEFAULT false,
    "categoryId" TEXT,
    "position" INTEGER DEFAULT 9999,
    "positionCategory" INTEGER DEFAULT 9999,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanToFeature" (
    "id" TEXT NOT NULL,
    "creditCost" INTEGER DEFAULT 0,
    "creditAllouedByMonth" INTEGER DEFAULT 0,
    "active" BOOLEAN DEFAULT false,
    "planId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,

    CONSTRAINT "PlanToFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT DEFAULT 'Features category description',
    "position" INTEGER DEFAULT 9999,
    "deleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "FeatureCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeature" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT false,
    "creditRemaining" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "description" TEXT,
    "default_price" TEXT,
    "metadata" JSONB NOT NULL,
    "unit_label" TEXT,
    "statement_descriptor" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "PlanId" TEXT,

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripePrice" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "billing_scheme" TEXT,
    "currency" TEXT NOT NULL,
    "custom_unit_amount" JSONB,
    "custom_unit_amount_maximum" DOUBLE PRECISION,
    "custom_unit_amount_minimum" DOUBLE PRECISION,
    "custom_unit_amount_preset" DOUBLE PRECISION,
    "lookup_key" TEXT,
    "metadata" JSONB NOT NULL,
    "nickname" TEXT,
    "product" TEXT NOT NULL,
    "recurring" JSONB,
    "recurring_interval" TEXT,
    "recurring_interval_count" INTEGER,
    "recurring_aggregate_usage" INTEGER,
    "recurring_trial_period_days" INTEGER,
    "recurring_usage_type" TEXT,
    "transform_quantity" JSONB,
    "transform_quantity_divide_by" INTEGER,
    "transform_quantity_round" TEXT,
    "tiers_mode" TEXT,
    "tiers" JSONB,
    "aggregate_usage" TEXT,
    "type" TEXT NOT NULL,
    "unit_amount" INTEGER NOT NULL,
    "unit_amount_decimal" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "StripePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeCoupon" (
    "id" TEXT NOT NULL,
    "amountOff" DOUBLE PRECISION,
    "currency" TEXT,
    "duration" TEXT NOT NULL,
    "durationInMonths" INTEGER,
    "maxRedemptions" INTEGER,
    "metadata" JSONB NOT NULL,
    "name" TEXT,
    "percentOff" DOUBLE PRECISION,
    "redeemBy" INTEGER,
    "timesRedeemed" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "StripeCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripePlanCoupon" (
    "id" TEXT NOT NULL,
    "PlanId" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "recurrence" TEXT,

    CONSTRAINT "StripePlanCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResendAudience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ResendAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResendContact" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "unsubscribed" BOOLEAN DEFAULT false,
    "audienceId" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "ResendContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_stripeId_key" ON "Plan"("stripeId");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_alias_key" ON "Feature"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "PlanToFeature_planId_featureId_key" ON "PlanToFeature"("planId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureCategory_name_key" ON "FeatureCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeature_userId_featureId_planId_key" ON "UserFeature"("userId", "featureId", "planId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeProduct_PlanId_key" ON "StripeProduct"("PlanId");

-- CreateIndex
CREATE UNIQUE INDEX "StripePlanCoupon_PlanId_couponId_recurrence_key" ON "StripePlanCoupon"("PlanId", "couponId", "recurrence");

-- CreateIndex
CREATE UNIQUE INDEX "ResendAudience_name_key" ON "ResendAudience"("name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feature" ADD CONSTRAINT "Feature_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FeatureCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanToFeature" ADD CONSTRAINT "PlanToFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanToFeature" ADD CONSTRAINT "PlanToFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeature" ADD CONSTRAINT "UserFeature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeature" ADD CONSTRAINT "UserFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeature" ADD CONSTRAINT "UserFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeProduct" ADD CONSTRAINT "StripeProduct_PlanId_fkey" FOREIGN KEY ("PlanId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePrice" ADD CONSTRAINT "StripePrice_product_fkey" FOREIGN KEY ("product") REFERENCES "StripeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePlanCoupon" ADD CONSTRAINT "StripePlanCoupon_PlanId_fkey" FOREIGN KEY ("PlanId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripePlanCoupon" ADD CONSTRAINT "StripePlanCoupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "StripeCoupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResendContact" ADD CONSTRAINT "ResendContact_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "ResendAudience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResendContact" ADD CONSTRAINT "ResendContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
