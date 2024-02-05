-- CreateTable
CREATE TABLE "StripeProduct" (
    "id" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "attributes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created" INTEGER NOT NULL,
    "default_price" TEXT,
    "description" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "livemode" BOOLEAN NOT NULL,
    "metadata" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "package_dimensions" JSONB,
    "shippable" BOOLEAN,
    "statement_descriptor" TEXT,
    "tax_code" TEXT,
    "type" TEXT NOT NULL,
    "unit_label" TEXT,
    "updated" INTEGER NOT NULL,
    "url" TEXT,

    CONSTRAINT "StripeProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripePrice" (
    "id" TEXT NOT NULL,
    "object" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "billing_scheme" TEXT NOT NULL,
    "created" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "custom_unit_amount" INTEGER,
    "livemode" BOOLEAN NOT NULL,
    "lookup_key" TEXT,
    "metadata" JSONB NOT NULL,
    "nickname" TEXT,
    "product" TEXT NOT NULL,
    "recurring" JSONB NOT NULL,
    "tax_behavior" TEXT NOT NULL,
    "tiers_mode" TEXT,
    "transform_quantity" JSONB,
    "type" TEXT NOT NULL,
    "unit_amount" INTEGER NOT NULL,
    "unit_amount_decimal" TEXT NOT NULL,

    CONSTRAINT "StripePrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StripePrice" ADD CONSTRAINT "StripePrice_product_fkey" FOREIGN KEY ("product") REFERENCES "StripeProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
