import Stripe from "stripe";

export class StripeManager {
  private stripe: Stripe;

  constructor() {
    this.stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  }

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
    return createdPrice.id;
  }

  async updateProduct(
    productId: string,
    name: string,
    description: string,
    active: boolean
  ) {
    return await this.stripe.products.update(productId, {
      name,
      description,
      active,
    });
  }
  async createProduct(name: string, description: string, metadatas:{}) {
    return await this.stripe.products.create({
      name,
      description,
      metadata: { "planId": name },
      active:false
    });
  }

  async createPrice(
    product: string,
    unit_amount: number,
    currency: string,
    interval: "month" | "year"
  ) {
    return await this.stripe.prices.create({
      product,
      unit_amount,
      currency,
      recurring: { interval },
    });
  }
}
