import { prisma } from "@/src/lib/prisma";
import {
  MRRSPlan,
  StripeCoupon,
  StripePrice,
  StripeProduct,
} from "@prisma/client";
import Stripe from "stripe";

export class StripeManager {
  private stripe: Stripe;

  constructor() {
    this.stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  }

  /**
   * Create or update a plan
   *
   * @param planId
   * @param priceId
   * @param newPrice
   * @param currency
   * @param interval
   * @returns
   */
  async createOrUpdatePrice(
    planId: string,
    priceId: string,
    newPrice: number,
    currency: string,
    interval: "month" | "year"
  ) {
    // Deactivate the previous price
    const deactivatedPrice = await this.stripe.prices.update(priceId, {
      active: false,
    });
    if (!deactivatedPrice) return null;
    // Create a new price
    const createdPrice = await this.stripe.prices.create({
      product: planId,
      unit_amount: newPrice,
      currency: currency,
      recurring: { interval: interval },
    });
    if (!createdPrice) return null;
    // Update the plan in the database
    const deactivatedPriceBdd = await this.updatePriceOnBDD(
      deactivatedPrice as Partial<StripePrice>
    );
    const createdPriceBdd = await this.createPriceOnBDD(createdPrice, planId);

    return createdPrice.id;
  }

  async deleteCoupon(couponId: string) {
    const deleted = await this.stripe.coupons.del(couponId);
    if (!deleted) return false;
    const deletedBdd = this.deleteCouponOnBDD(couponId);
    if (deletedBdd) return deletedBdd;
  }
  async createProduct(name: string, description: string, metadatas: {}) {
    const create = await this.stripe.products.create({
      name,
      description,
      metadata: { planId: name },
      active: false,
    });
    const createBdd = this.createProductOnBDD(create, name);
    if (create) return create;
  }
  async updateProduct(
    productId: string,
    name: string,
    description: string,
    active: boolean,
    plan: MRRSPlan
  ) {
    let update = {} as Stripe.Product;
    try {
      update = await this.stripe.products.update(productId, {
        name,
        description,
        active,
      });
      // Product found, update it
      const updateBdd = await this.updateProductOnBDD(update, productId);
      if (updateBdd) return updateBdd.id;
    } catch (error) {
      // Product not found, create a new one and attribute to the plan
      const create = await this.createProduct(
        plan.name ?? plan.id,
        description,
        {}
      );
      if (create) return create;
    }
  }

  async createPrice(
    product: string,
    unit_amount: number,
    currency: string,
    interval: "month" | "year"
  ) {
    const create = await this.stripe.prices.create({
      product,
      unit_amount,
      currency,
      recurring: { interval },
    });

    const createBdd = await this.createPriceOnBDD(create, product);
    if (create) return create.id;
  }

  async createCoupon(options: {
    duration?: "once" | "repeating" | "forever";
    duration_in_months?: number;
    percent_off?: number;
    name?: string;
  }) {
    const couponData: {
      percent_off?: number;
      duration?: "once" | "repeating" | "forever";
      duration_in_months?: number;
      name?: string;
    } = {
      percent_off: options.percent_off,
      duration: options.duration,
      name: options.name,
    };

    if (options.duration === "repeating") {
      couponData.duration_in_months = options.duration_in_months;
    }

    const coupon = await this.stripe.coupons.create(couponData);
    const couponBdd = await this.createCouponOnBDD(coupon);
    return couponBdd;
  }

  async createProductOnBDD(data: Partial<StripeProduct>, planId: string) {
    const product = await prisma.stripeProduct.create({
      data: {
        id: data.id,
        active: data.active ?? false,
        MRRSPlanId: planId,
        created: data.created ?? 0,
        description: data.description,
        livemode: data.livemode ?? false,
        metadata: data.metadata ?? {},
        name: data.name ?? "",
        unit_label: data.unit_label,
        updated: data.updated ?? 0,
        url: data.url,
      },
      include: { MRRSPlanRelation: true },
    });
    // We update the plan with the product id
    await prisma.mRRSPlan.update({
      where: { id: planId },
      data: { stripeId: product.id },
    });
  }

  async deleteCouponOnBDD(couponId: string) {
    const del = await prisma.stripeCoupon.delete({ where: { id: couponId } });
    return del;
  }
  async createPriceOnBDD(data: Partial<Stripe.Price>, productId: string) {
    await prisma.stripePrice.create({
      data: {
        id: data.id,
        active: data.active ?? false,
        created: data.created ?? 0,
        currency: data.currency ?? "usd",
        metadata: data.metadata ?? {},
        product: productId,
        recurring: data.recurring?.interval ?? "",
        type: data.type ?? "",
        unit_amount: data.unit_amount ?? 0,
        unit_amount_decimal: data.unit_amount_decimal ?? "0",
      },
      include: { productRelation: true },
    });
  }

  async updatePriceOnBDD(data: Partial<StripePrice>) {
    await prisma.stripePrice.update({
      where: { id: data.id },
      data: {
        active: data.active,
        created: data.created,
        currency: data.currency,
        metadata: data.metadata ?? {},
        product: data.product,
        recurring: data.recurring ?? {},
        type: data.type,
        unit_amount: data.unit_amount,
        unit_amount_decimal: data.unit_amount_decimal,
      },
      include: { productRelation: true },
    });
  }
  async deleteProductOnBDD(productId: string) {
    await prisma.stripeProduct.delete({ where: { id: productId } });
  }
  async updateProductOnBDD(
    data: Partial<StripeProduct>,
    productId: StripeProduct["id"]
  ) {
    return await prisma.stripeProduct.update({
      where: { id: productId },
      data: {
        active: data.active,
        created: data.created,
        description: data.description,
        livemode: data.livemode,
        metadata: data.metadata ?? {},
        name: data.name,
        unit_label: data.unit_label,
        updated: data.updated,
        url: data.url,
      },
      include: { MRRSPlanRelation: true },
    });
  }

  async createCouponOnBDD(data: Partial<Stripe.Coupon>) {
    return await prisma.stripeCoupon.create({
      data: {
        id: data.id ?? "",
        object: data.object ?? "",
        amountOff: data.amount_off ?? 0,
        created: data.created ?? 0,
        currency: data.currency ?? "",
        duration: data.duration ?? "",
        durationInMonths: data.duration_in_months ?? 0,
        livemode: data.livemode ?? false,
        maxRedemptions: data.max_redemptions ?? 0,
        metadata: data.metadata ?? {},
        name: data.name,
        percentOff: data.percent_off ?? 0,
        redeemBy: data.redeem_by ?? 0,
        timesRedeemed: data.times_redeemed ?? 0,
        valid: data.valid ?? false,
      },
    });
  }
}
