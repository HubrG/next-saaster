import { updatePlan } from "@/src/helpers/db/plans";
import { createOrUpdateCouponStripeToBdd } from "@/src/helpers/db/stripeCoupons";
import { createOrUpdatePriceStripeToBdd } from "@/src/helpers/db/stripePrices";
import { createOrUpdateProductStripeToBdd } from "@/src/helpers/db/stripeProducts";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { stripeEvents } from "@/src/lib/stripe-events";
import { SaasTypes } from "@prisma/client";
import Stripe from "stripe";

interface CreateProductProps {
  currency?: string;
  description?: string;
  name?: string;
  statement_descriptor?: string;
  unit_label?: string;
  type: "create" | "update";
  planId: string;
  id?: string;
  saasType: SaasTypes;
  default_price?: string;
  active?: boolean;
}

export interface createNewPriceForPlanProps {
  id?: string;
}

interface stripeCustomerProps {
  data: {
    email: string;
    name?: string;
    metadata?: {};
  };
  id?: string;
}

export class StripeManager {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
      typescript: true,
    });
    this.fetchAndCreateWebhookEndpoints();
  }

  // SECTION : PRODUCT
  async createOrUpdateProduct({
    type,
    description,
    currency,
    name,
    id,
    planId,
    saasType,
    statement_descriptor,
    unit_label,
    default_price,
    active,
  }: CreateProductProps): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // NOTE : Create
      if (type === "create") {
        const defaultPrice = await this.setDefaultPrice(
          saasType,
          currency ?? "usd"
        );
        if (defaultPrice.error) throw new Error(defaultPrice.error);
        const createProduct = await this.stripe.products.create({
          active: false,
          default_price_data: defaultPrice.data,
          description:
            description ?? "New product created from the admin panel",
          images: [],
          metadata: {
            planId: planId,
          },
          name: name ?? "New product",
          statement_descriptor: statement_descriptor ?? undefined,
          unit_label: unit_label ?? "unit",
        });
        if (!createProduct)
          throw new Error("An error has occured while creating the product");
        const createProductOnBDD = await createOrUpdateProductStripeToBdd({
          type: "create",
          stripeProduct: createProduct,
          id: planId,
        });
        if (createProductOnBDD.error)
          throw new Error(
            "An error has occured while creating the product on the database"
          );
        const price = await this.stripe.prices.retrieve(
          createProduct.default_price as string
        );
        if (!price)
          throw new Error("An error has occured while creating the product");
        const priceOnBDD = await createOrUpdatePriceStripeToBdd("create", {
          ...price,
          product: createProduct.id,
        });
        if (priceOnBDD.error)
          throw new Error(
            "An error has occured while creating the price on the database"
          );
        const upPlan = await updatePlan({
          stripeId: createProduct.id,
          id: planId,
          name: name,
          description: description,
        });

        if (upPlan.error)
          throw new Error("An error has occured while updating the plan");
        if (createProductOnBDD && priceOnBDD)
          return { success: true, data: createProductOnBDD.data };
        else return { error: "An error has occured" };
        // NOTE : Update
      } else if (type === "update" && id) {
        const product = await this.stripe.products.retrieve(id);

        const updateProduct = await this.stripe.products.update(id, {
          description: description,
          name: name,
          active: active ?? false,
          statement_descriptor: statement_descriptor,
          unit_label: unit_label,
          default_price: default_price ?? (product.default_price as string),
        });
        if (!updateProduct)
          throw new Error("An error has occured while updating the product");
        const updateProductOnBDD = await createOrUpdateProductStripeToBdd({
          type: "update",
          stripeProduct: updateProduct,
          id: updateProduct.id,
        });
        if (updateProductOnBDD.error)
          throw new Error(
            "An error has occured while updating the product on the database"
          );
        if (updateProductOnBDD)
          return { success: true, data: updateProductOnBDD.data };
        else return { error: "An error has occured" };
      }
      return { error: "An unknown error has occured" };
    } catch (error) {
      console.error(error);
      return { error: getErrorMessage(error) };
    }
  }

  // SECTION : PRICE

  async createOrUpdatePrice(
    type: "create" | "update",
    data: createNewPriceForPlanProps &
      Stripe.PriceCreateParams &
      Stripe.PriceUpdateParams
  ): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      if (type === "create") {
        const createPrice = await this.stripe.prices.create(data);
        if (!createPrice)
          throw new Error("An error has occured while creating the price");
        const createPriceOnBDD = await createOrUpdatePriceStripeToBdd(
          "create",
          createPrice
        );
        if (createPriceOnBDD.error)
          throw new Error(
            "An error has occured while creating the price on the database"
          );
        if (createPriceOnBDD)
          return { success: true, data: createPriceOnBDD.data };
        else return { error: "An error has occured" };
      } else if (type === "update" && data.id) {
        const updatePrice = await this.stripe.prices.update(data.id, {
          active: data.active,
          metadata: data.metadata,
        });
        if (!updatePrice)
          throw new Error("An error has occured while updating the price");
        const updatePriceOnBDD = await createOrUpdatePriceStripeToBdd(
          "update",
          updatePrice
        );
        if (updatePriceOnBDD.error)
          throw new Error(
            "An error has occured while updating the price on the database"
          );
        if (updatePriceOnBDD)
          return { success: true, data: updatePriceOnBDD.data };
        else return { error: "An error has occured" };
      }
      return { error: "An unknown error has occured" };
    } catch (error) {
      console.error(error);
      return { error: getErrorMessage(error) };
    }
  }

  async searchPrices(query: string): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const prices = await this.stripe.prices.search({
        query: query,
      });
      if (!prices)
        throw new Error("An error has occured while fetching the prices");
      return { success: true, data: prices.data };
    } catch (error) {
      console.error(error);
      return { error: getErrorMessage(error) };
    }
  }
  // SECTION : COUPON

  async createOrUpdateCoupon(
    type: "create" | "update",
    data: any
  ): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const datas = {
        id: data.id,
        amountOff: data.amountOff,
        currency: data.currency,
        duration: data.duration,
        durationInMonths: data.durationInMonths,
        maxRedemptions: data.maxRedemptions,
        name: data.name,
        percentOff: data.percentOff,
      };
      if (datas.duration === "repeating") {
        datas.durationInMonths = data.durationInMonths;
      }
      if (type === "create") {
        const createCoupon = await this.stripe.coupons.create({
          duration: datas.duration,
          duration_in_months:
            datas.duration === "repeating" ? datas.durationInMonths : undefined,
          max_redemptions: datas.maxRedemptions
            ? parseInt(datas.maxRedemptions ?? 0, 10)
            : undefined,
          name: datas.name,
          percent_off: datas.percentOff,
        });
        if (!createCoupon)
          throw new Error("An error has occured while creating the coupon");
        const createCouponOnBDD = await createOrUpdateCouponStripeToBdd(
          "create",
          createCoupon
        );
        if (createCouponOnBDD.error)
          throw new Error(
            "An error has occured while creating the coupon on the database"
          );
        if (createCouponOnBDD)
          return { success: true, data: createCouponOnBDD.data };
        else return { error: "An error has occured" };
      } else if (type === "update") {
        const updateCoupon = await this.stripe.coupons.update(data.id, {
          name: data.name,
        });
        if (!updateCoupon)
          throw new Error("An error has occured while updating the coupon");
        const updateCouponOnBDD = await createOrUpdateCouponStripeToBdd(
          "update",
          updateCoupon
        );
        if (updateCouponOnBDD.error)
          throw new Error(
            "An error has occured while updating the coupon on the database"
          );
        if (updateCouponOnBDD)
          return { success: true, data: updateCouponOnBDD.data };
        else return { error: "An error has occured" };
      }
      return { error: "An unknown error has occured" };
    } catch (error) {
      console.log(error);
      return { error: getErrorMessage(error) };
    }
  }
  // SECTION : CUSTOMER
  async createCustomer({ data, id }: stripeCustomerProps): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    if (id !== undefined) {
      try {
        const isCustomer = await this.stripe.customers.retrieve(id);
        if (!isCustomer) {
          throw new Error("Customer already exists, or not found");
        } else {
          return { success: true, data: isCustomer };
        }
      } catch (error) {
        console.error("Error retrieving customer:", error);
      }
    }
    // if not, create it
    const customer = await this.stripe.customers.create(data);
    if (!customer) {
      return { error: "An error has occured while creating the customer" };
    }
    return { success: true, data: customer };
  }
  // SECTION : Utils
  async getWebhookUrl(): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      let url;
      if (process.env.ENV !== "dev" && process.env.ENV !== "development") {
        url = process.env.NEXT_URI + "/api/webhooks/stripe";
      }
      return { success: true, data: url };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }
  async fetchAndCreateWebhookEndpoints(): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const url = (await this.getWebhookUrl()).data;
      if (url.error) throw new Error(url.error);
      const webhookEndpoints = await this.stripe.webhookEndpoints.list();
      if (!webhookEndpoints)
        throw new Error("An error has occured while fetching the webhook");
      const webhook = webhookEndpoints.data.find(
        (webhook) => webhook.url === url
      );
      if (!webhook) {
        const createWebhook = await this.stripe.webhookEndpoints.create({
          url: url,
          enabled_events: stripeEvents as Stripe.Event["type"][],
        });
        if (!createWebhook.secret) {
          throw new Error("An error has occured while creating the webhook");
        }
      }
      return { success: true };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }
  async setDefaultPrice(
    saasType: SaasTypes,
    currency: string
  ): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    let firstPrice;
    if (saasType === "PAY_ONCE") {
      firstPrice = {
        currency: currency ?? "usd",
        unit_amount: 0,
      };
    } else {
      firstPrice = {
        currency: currency ?? "usd",
        recurring: {
          interval: "month",
        },
        unit_amount: 0,
      };
    }
    return { success: true, data: firstPrice };
  }
}
