import { prisma } from "@/src/lib/prisma";
import { MRRSPlan, StripePrice, StripeProduct } from "@prisma/client";
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
    const deactivatedPriceBdd = await this.updatePriceOnBDD(deactivatedPrice as Partial<StripePrice>);
    const createdPriceBdd = await this.createPriceOnBDD(createdPrice, planId);

    return createdPrice.id;
  }

  async createProduct(name: string, description: string, metadatas: {}) {
    const create = await this.stripe.products.create({
      name,
      description,
      metadata: { planId: name },
      active: false,
    });
    const createBdd = await this.createProductOnBDD(create, name);
    if (create && createBdd) return create;
  }

  async updateProduct(
    productId: string,
    name: string,
    description: string,
    active: boolean
  ) {
    const update = await this.stripe.products.update(productId, {
      name,
      description,
      active,
    });
    const updateBdd = await this.updateProductOnBDD(update, productId);
    if (update && updateBdd) return update;
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
    if (create && createBdd) return create;
  }

  async getPrices() {
    return await this.stripe.prices.list();
  }
  async getProducts() {
    return await this.stripe.products.list();
  }

  async createProductOnBDD(data: Partial<StripeProduct>, planId: string) {
    return await prisma.stripeProduct.create({
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
    });
  }
  async createPriceOnBDD(data: Partial<Stripe.Price>, productId: string) {
    return await prisma.stripePrice.create({
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
    });
  }

  async updatePriceOnBDD(data: Partial<StripePrice>) {
    return await prisma.stripePrice.update({
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
    });
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
    });
  }
}
