import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { stripeEvents } from "@/src/lib/stripe-events";
import Stripe from "stripe";
interface CreateProductProps {
  currency?: string;
  description?: string;
  name?: string;
  statement_descriptor?: string;
  unit_label?: string;
}

export class StripeManager {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });
    this.fetchAndCreateWebhookEndpoints();
  }

  async createProduct({
    description,
    currency,
    name,
    statement_descriptor,
    unit_label,
  }: CreateProductProps): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const createProduct = await this.stripe.products.create({
        active: false,
        default_price_data: {
          currency: currency ?? "usd",
          recurring: {
            interval: "month",
          },
          unit_amount: 0,
        },
        description: description ?? "New product created from the admin panel",
        images: [],
        metadata: {
          planId: null,
        },
        name: name ?? "New product",
        statement_descriptor: statement_descriptor ?? undefined,
        unit_label: unit_label ?? "unit",
      });
      if (!createProduct)
        throw new Error("An error has occured while creating the product");
      const createProductOnBDD = await this.createProductOnBDD(createProduct);
      if (createProductOnBDD.error)
        throw new Error(
          "An error has occured while creating the product on the database"
        );
      if (createProductOnBDD)
        return { success: true, data: createProductOnBDD.data };
      else return { error: "An error has occured" };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }

  async createProductOnBDD(data: Stripe.Product): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    const product = await prisma.stripeProduct.create({
      data: {
        id: data.id,
        name: data.name,
        active: data.active,
        description: data.description,
        default_price: data.default_price?.toString(),
        metadata: data.metadata,
        unit_label: data.unit_label,
        statement_descriptor: data.statement_descriptor,
      },
    });
    if (!product)
      throw new Error(
        "An error has occured while creating the product on the database"
      );
    return { success: true, data: product };
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
}
