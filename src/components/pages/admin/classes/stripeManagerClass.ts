import { prisma } from "@/src/lib/prisma";
import { MRRSPlan, StripePrice, StripeProduct } from "@prisma/client";
import Stripe from "stripe";

export class StripeManager {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });
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
  private async deactivatePrice(priceId: string) {
    return await this.stripe.prices.update(priceId, { active: false });
  }
  async createNewPrices(
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
    console.log(create);
    if (create) return create.id;
  }
  async createCustomer(data: { email: string }, id: string | null) {
    if (id !== null) {
      try {
        const isCustomer = await this.stripe.customers.retrieve(id);
        if (!isCustomer) {
          throw new Error("Customer already exists, or not found");
        } else {
          return isCustomer;
        }
      } catch (error) {
        console.error("Error retrieving customer:", error);
      }
    }
    // if not, create it
    const customer = await this.stripe.customers.create(data);
    return customer;
  }
  async deleteCoupon(couponId: string) {
    const deleted = await this.stripe.coupons.del(couponId);
    if (!deleted) return false;
    const deletedBdd = this.deleteCouponOnBDD(couponId);
    if (deletedBdd) return deletedBdd;
  }
  async createProduct(
    pId: string,
    description: string,
    metadatas: {},
    active: boolean,
    name?: string
  ) {
    const create = await this.stripe.products.create({
      name: name ?? pId,
      description,
      metadata: { planId: pId },
      active: active,
    });
    const createBdd = this.createProductOnBDD(create, pId);
    if (create) return create;
  }
  async getProduct(productId: string) {
    try {
      const product = await this.stripe.products.retrieve(productId);
      return product;
    } catch (error: any) {
      // Utilisez `any` pour accéder aux propriétés de l'erreur.
      // Vérifiez explicitement le type et/ou le code de l'erreur ici
      if (
        error.type === "StripeInvalidRequestError" &&
        error.code === "resource_missing"
      ) {
        return false; // Retourne false si le produit spécifié n'existe pas
      }
      // Loguez ou gérez d'autres types d'erreurs ici si nécessaire
      console.error("Error retrieving product:", error);
      return false; // Ou re-throw l'erreur selon votre cas d'usage
    }
  }

  async getPrice(priceId: string) {
    try {
      const price = await this.stripe.prices.retrieve(priceId);
      return price;
    } catch (error: any) {
      // Assurez-vous d'utiliser `any` pour accéder aux propriétés de l'erreur.
      // Vérifiez explicitement le type et/ou le code de l'erreur ici
      if (
        error.type === "StripeInvalidRequestError" &&
        error.code === "resource_missing"
      ) {
        return false; // Retourne false pour les erreurs spécifiques de prix non trouvé
      }
      // Vous pouvez loguer ou gérer d'autres types d'erreurs ici si nécessaire
      console.error("Error retrieving price:", error);
      return false; // Ou re-throw l'erreur selon votre cas d'usage
    }
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
        {},
        plan.active ?? false
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

  async createProductOnBDD(data: any, planId: string) {
    const product = await prisma.stripeProduct.create({
      data: {
        id: data.id,
        active: data.active ?? false,
        MRRSPlanId: planId,
        description: data.description,
        metadata: data.metadata ?? {},
        name: data.name ?? "",
        unit_label: data.unit_label,
      },
      include: { MRRSPlanRelation: true },
    });
    // We update the plan with the product id
    await prisma.mRRSPlan.update({
      where: { id: planId },
      data: {
        stripeId: product.id,
        StripeProduct: {
          connect: { id: product.id }, // Supposé que c'est l'ID interne de votre StripeProduct
        },
      },
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

  async deletePriceOnBDD(priceId: string) {
    await prisma.stripePrice.delete({ where: { id: priceId } });
  }

  async updatePriceOnBDD(data: Partial<StripePrice>) {
    await prisma.stripePrice.update({
      where: { id: data.id },
      data: {
        active: data.active,
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
  async updateProductOnBDD(data: any, productId: StripeProduct["id"]) {
    return await prisma.stripeProduct.update({
      where: { id: productId },
      data: {
        active: data.active,
        description: data.description,
        metadata: data.metadata ?? {},
        name: data.name,
        unit_label: data.unit_label,
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
