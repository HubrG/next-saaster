import { updatePlan } from "@/src/helpers/db/plans.action";
import {
  createOrUpdateCouponStripeToBdd,
  deleteStripeCoupon,
} from "@/src/helpers/db/stripeCoupons.action";
import { createOrUpdatePriceStripeToBdd } from "@/src/helpers/db/stripePrices.action";
import { createOrUpdateProductStripeToBdd } from "@/src/helpers/db/stripeProducts.action";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";

import { getSaasSettings } from "@/src/helpers/db/saasSettings.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { ActionError } from "@/src/lib/safe-actions";
import { stripeEvents } from "@/src/lib/stripe-events";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
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
  private secret: string;
  constructor() {
    this.secret = chosenSecret();
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
        const createProductOnBdd = await createOrUpdateProductStripeToBdd({
          type: "create",
          data: {
            ...createProduct,
            statement_descriptor: createProduct.statement_descriptor ?? null,
            unit_label: createProduct.unit_label ?? null,
            default_price: (createProduct.default_price as string) ?? "",
          },
          planId: planId,
          secret: this.secret,
        });

        if (handleError(createProductOnBdd).error)
          throw new ActionError(handleError(createProductOnBdd).message);
        const price = await this.stripe.prices.retrieve(
          createProduct.default_price as string
        );
        if (!price)
          throw new Error("An error has occured while creating the product");
        const priceOnBDD = await createOrUpdatePriceStripeToBdd({
          type: "create",
          data: {
            ...price,
            product: createProduct.id,
            recurring: price.recurring as any,
          },
          secret: this.secret,
        });
        if (handleError(priceOnBDD).error)
          throw new ActionError(handleError(priceOnBDD).message);
        const upPlan = await updatePlan({
          data: {
            id: planId,
            name,
            description,
            stripeId: createProduct.id,
          },
        });
        if (!upPlan.data?.success)
          throw new Error("An error has occured while updating the plan");
        if (createProductOnBdd && priceOnBDD)
          return { success: true, data: createProductOnBdd.data?.success };
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
          data: {
            ...updateProduct,
            statement_descriptor: updateProduct.statement_descriptor ?? null,
            unit_label: updateProduct.unit_label ?? null,
            default_price: (updateProduct.default_price as string) ?? "",
          },
          planId: planId,
          secret: this.secret,
        });
        if (handleError(updateProductOnBDD).error)
          throw new ActionError(handleError(updateProductOnBDD).message);
        return { success: true, data: updateProductOnBDD.data?.success };
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
        const price = await this.stripe.prices.create(data);
        if (!price)
          throw new Error("An error has occured while creating the price");
        const priceOnBDD = await createOrUpdatePriceStripeToBdd({
          type: "create",
          data: {
            ...price,
            product: price.product as string,
          },
          secret: this.secret,
        });
        if (handleError(priceOnBDD).error)
          throw new ActionError(handleError(priceOnBDD).message);
        if (priceOnBDD) return { success: true, data: priceOnBDD.data };
        else return { error: "An error has occured" };
      } else if (type === "update" && data.id) {
        const price = await this.stripe.prices.update(data.id, {
          active: data.active,
          metadata: data.metadata,
        });
        if (!price)
          throw new Error("An error has occured while updating the price");
        const priceOnBDD = await createOrUpdatePriceStripeToBdd({
          type: "update",
          data: {
            ...price,
            product: price.product as string,
          },
          secret: this.secret,
        });
        if (handleError(priceOnBDD).error)
          throw new ActionError(handleError(priceOnBDD).message);
        if (price) return { success: true, data: priceOnBDD.data };
        else return { error: "An error has occured" };
      }
      return { error: "An unknown error has occured" };
    } catch (error) {
      console.error(error);
      return { error: getErrorMessage(error) };
    }
  }

  async searchPrices(
    query: string
  ): Promise<HandleResponseProps<Stripe.Price[]>> {
    try {
      const prices = await this.stripe.prices.search({
        query: query,
      });
      if (!prices.data)
        throw new ActionError("An error has occured while fetching the prices");
      return handleRes<Stripe.Price[]>({
        success: prices.data,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<Stripe.Price[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
  // SECTION : COUPON

  async createOrUpdateCoupon(
    type: "create" | "update",
    data: any
  ): Promise<HandleResponseProps<iStripeCoupon>> {
    try {
      const datas = {
        id: data.id,
        amount_off: data.amount_off,
        currency: data.currency,
        duration: data.duration,
        duration_in_months: data.duration_in_months,
        max_redemptions: data.max_redemptions,
        name: data.name,
        percent_off: data.percent_off,
      };
      console.log(datas);
      if (datas.duration === "repeating") {
        datas.duration_in_months = data.duration_in_months;
      }
      if (type === "create") {
        const createCoupon = await this.stripe.coupons.create({
          duration: datas.duration,
          duration_in_months:
            datas.duration === "repeating"
              ? datas.duration_in_months
              : undefined,
          max_redemptions: datas.max_redemptions
            ? parseInt(datas.max_redemptions ?? 0, 10)
            : undefined,
          name: datas.name,
          percent_off: datas.percent_off,
          amount_off: datas.amount_off,
          currency: datas.currency,
        });
        if (!createCoupon)
          throw new ActionError(
            "An error has occured while creating the coupon"
          );
        const createCouponOnBDD = await createOrUpdateCouponStripeToBdd({
          type: "create",
          data: createCoupon as any,
          secret: this.secret,
        });
        if (handleError(createCouponOnBDD).error)
          throw new ActionError(handleError(createCouponOnBDD).message);
        if (createCouponOnBDD)
          return handleRes<iStripeCoupon>({
            success: createCouponOnBDD.data?.success,
            statusCode: 200,
          });
        //
      } else if (type === "update") {
        const updateCoupon = await this.stripe.coupons.update(data.id, {
          name: data.name,
        });
        if (!updateCoupon)
          throw new ActionError(
            "An error has occured while updating the coupon"
          );
        const updateCouponOnBDD = await createOrUpdateCouponStripeToBdd({
          type: "update",
          data: updateCoupon as any,
          secret: this.secret,
        });
        if (handleError(updateCouponOnBDD).error)
          throw new ActionError(handleError(updateCouponOnBDD).message);
        if (updateCouponOnBDD)
          return handleRes<iStripeCoupon>({
            success: updateCouponOnBDD.data?.success,
            statusCode: 200,
          });
      }
      return handleRes<iStripeCoupon>({
        error: "An unknown error has occured",
        statusCode: 500,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeCoupon>({
        error: "An unknown error has occured",
        statusCode: 500,
      });
    }
  }
  async removeCoupon(couponId: string) {
    try {
      const deletedBdd = await deleteStripeCoupon({
        id: couponId,
        secret: this.secret,
      });
      if (handleError(deletedBdd).error)
        throw new Error(handleError(deletedBdd).message);
      const deleted = await this.stripe.coupons.del(couponId);
      if (!deleted) return false;
      return true;
    } catch (error) {
      console.error(error);
    }
  }
  // SECTION : CUSTOMER
  // Define a custom error type for Stripe API errors

  async createCustomer({ data, id }: stripeCustomerProps): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      // If an ID is provided, attempt to retrieve the existing customer
      if (id) {
        const existingCustomer = await this.stripe.customers.retrieve(id);
        if (existingCustomer.deleted !== true) {
          return { success: true, data: existingCustomer };
        }
      }
    } catch (error) {
      // If the customer does not exist, create a new one
      if (
        error instanceof Error &&
        error.message.includes("No such customer")
      ) {
        try {
          const customer = await this.stripe.customers.create(data);
          return { success: true, data: customer };
        } catch (creationError) {
          console.error("Error creating customer:", creationError);
          return {
            error: "An error has occurred while creating the customer.",
          };
        }
      } else {
        // If there's another error, log it and return it
        console.error("Error retrieving customer:", error);
        return {
          error: "An error has occurred while retrieving the customer.",
        };
      }
    }

    // If no ID is provided, create a new customer
    try {
      const customer = await this.stripe.customers.create(data);
      return { success: true, data: customer };
    } catch (error) {
      console.error("Error creating customer:", error);
      return { error: "An error has occurred while creating the customer." };
    }
  }
  async fetchSubscription(subscriptionId: string): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(
        subscriptionId
      );
      if (!subscription)
        throw new Error("An error has occured while fetching the subscription");
      return { success: true, data: subscription };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }
  async updateSubscription({
    subscriptionId,
    data,
  }: {
    subscriptionId: string;
    data: {
      quantity?: number;
    };
  }): Promise<{
    success?: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const saasSettings = await getSaasSettings();
      if (saasSettings.error) throw new Error(saasSettings.error);
      if (saasSettings.data?.saasType === "METERED_USAGE") {
       return { success: true, data: subscriptionId };
      }
      const sub = await this.stripe.subscriptions.update(subscriptionId, data as any);
      if (!sub)
        throw new Error("An error has occured while updating the subscription");
      return { success: true, data: sub.id };
    } catch (error) {
      console.error(getErrorMessage(error));
      return { error: getErrorMessage(error) };
    }
  }
  // SECTION : Checkout
  async getCheckoutSession(sessionId: string): Promise<{
    success?: boolean;
    data?:
      | "payment"
      | "subscription"
      | "setup"
      | "setup_intent"
      | "subscription_schedule"
      | "subscription_update"
      | "subscription_cancel"
      | "subscription_cancellation"
      | "subscription_renewal"
      | "subscription_trial_end"
      | "subscription_trial_start";
    error?: string;
  }> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    if (!session) {
      return { error: "An error has occured while fetching the session" };
    }
    return { success: true, data: session.mode };
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
