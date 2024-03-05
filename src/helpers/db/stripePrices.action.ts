"use server";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import { handleResponse } from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iSearchPrices, iStripePrice } from "@/src/types/iStripePrices";
import { StripePrice } from "@prisma/client";
import Stripe from "stripe";

export const getStripePrices = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const stripePrices = await prisma.stripePrice.findMany({
      include: {
        productRelation: true,
      },
    });
    if (!stripePrices) throw new Error("No stripe prices found");
    return { success: true, data: stripePrices as StripePrice[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
export const getStripePrice = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const stripePrice = await prisma.stripePrice.findFirst({
      where: { id: id },
      include: {
        productRelation: true,
      },
    });
    if (!stripePrice) throw new Error("No stripe price found");
    return { success: true, data: stripePrice as StripePrice };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
export const createStripePrice = async (
  data: Partial<iStripePrice>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const stripePrice = await prisma.stripePrice.create({
      data: {
        id: data.id,
        active: data.active ?? false,
        billing_scheme: data.billing_scheme,
        custom_unit_amount: data.custom_unit_amount ?? {},
        currency: data.currency ?? "usd",
        metadata: data.metadata ?? {},
        nickname: data.nickname,
        product: data.product as string,
        recurring: data.recurring ?? {},
        recurring_interval: data.recurring_interval,
        recurring_interval_count: data.recurring_interval_count,
        recurring_aggregate_usage: data.recurring_aggregate_usage,
        recurring_trial_period_days: data.recurring_trial_period_days,
        recurring_usage_type: data.recurring_usage_type,
        tiers_mode: data.tiers_mode,
        type: data.type ?? "recurring",
        unit_amount: data.unit_amount ?? 0,
        unit_amount_decimal: data.unit_amount_decimal,
        transform_quantity: data.transform_quantity ?? {},
        transform_quantity_divide_by: data.transform_quantity_divide_by ?? null,
        transform_quantity_round: data.transform_quantity_round ?? null,
        custom_unit_amount_maximum: data.custom_unit_amount_maximum ?? null,
        custom_unit_amount_minimum: data.custom_unit_amount_minimum ?? null,
        custom_unit_amount_preset: data.custom_unit_amount_preset ?? null,
      },
    });
    return { success: true, data: stripePrice as iStripePrice };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const updateStripePrice = async (
  data: Partial<iStripePrice>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const stripePrice = await prisma.stripePrice.update({
      where: { id: data.id },
      data: {
        active: data.active,
        billing_scheme: data.billing_scheme,
        custom_unit_amount: data.custom_unit_amount ?? {},
        currency: data.currency,
        metadata: data.metadata ?? {},
        nickname: data.nickname,
        product: data.product,
        recurring: data.recurring ?? {},
        recurring_interval: data.recurring_interval,
        recurring_interval_count: data.recurring_interval_count,
        recurring_aggregate_usage: data.recurring_aggregate_usage,
        recurring_trial_period_days: data.recurring_trial_period_days,
        recurring_usage_type: data.recurring_usage_type,
        tiers_mode: data.tiers_mode,
        type: data.type,
        unit_amount: data.unit_amount,
        unit_amount_decimal: data.unit_amount_decimal,
        transform_quantity: data.transform_quantity ?? {},
        transform_quantity_divide_by: data.transform_quantity_divide_by ?? null,
        transform_quantity_round: data.transform_quantity_round ?? null,
        custom_unit_amount_maximum: data.custom_unit_amount_maximum ?? null,
        custom_unit_amount_minimum: data.custom_unit_amount_minimum ?? null,
        custom_unit_amount_preset: data.custom_unit_amount_preset ?? null,
      },
    });
    return { success: true, data: stripePrice as StripePrice };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const deleteStripePrice = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const price = await prisma.stripePrice.delete({
      where: { id: id },
    });
    return { success: true, data: price as StripePrice };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const searchPricesRaw = async (
  query: iSearchPrices
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const prices = await prisma.$queryRaw`SELECT * FROM "StripePrice" 
      WHERE "product" = ${query.product}
      AND "active" = ${query.active}
      AND "recurring_interval" = ${query.recurringInterval}
      AND "id" != ${query.defaultPrice}
      AND "id" != ${query.newPriceId}
      `;
    return { success: true, data: prices as StripePrice[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
// SECTION UTILS
export const createOrUpdatePriceStripeToBdd = async (
  type: "create" | "update" | "create_from_admin",
  stripePrice: Stripe.Price
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  const priceData = {
    id: stripePrice.id,
    active: stripePrice.active,
    billing_scheme: stripePrice.billing_scheme,
    custom_unit_amount: stripePrice.custom_unit_amount ?? {},
    currency: stripePrice.currency,
    lookup_key: stripePrice.lookup_key ?? null,
    metadata: stripePrice.metadata ?? {},
    nickname: stripePrice.nickname ?? null,
    product: stripePrice.product as string,
    recurring: stripePrice.recurring ?? {},
    recurring_interval: stripePrice.recurring?.interval ?? null,
    recurring_interval_count: stripePrice.recurring?.interval_count ?? null,
    recurring_aggregrate_usage: stripePrice.recurring?.aggregate_usage ?? null,
    recurring_trial_period_days:
      stripePrice.recurring?.trial_period_days ?? null,
    recurring_usage_type: stripePrice.recurring?.usage_type ?? null,
    tiers_mode: stripePrice.tiers_mode ?? null,
    transform_quantity: stripePrice.transform_quantity ?? null,
    transform_quantity_divide_by:
      stripePrice.transform_quantity?.divide_by ?? null,
    transform_quantity_round: stripePrice.transform_quantity?.round ?? null,
    custom_unit_amount_maximum: stripePrice.custom_unit_amount?.maximum ?? null,
    custom_unit_amount_minimum: stripePrice.custom_unit_amount?.minimum ?? null,
    custom_unit_amount_preset: stripePrice.custom_unit_amount?.preset ?? null,
    type: stripePrice.type,
    unit_amount: stripePrice.unit_amount,
    unit_amount_decimal: stripePrice.unit_amount_decimal,
    tiers: stripePrice.tiers ?? null,
  };
  try {
    if (type === "create") {
      const price = await createStripePrice(priceData as Partial<iStripePrice>);
      return handleResponse(price);
    } else if (type === "update") {
      const price = await updateStripePrice(priceData as Partial<iStripePrice>);
      return handleResponse(price);
    } else {
      console.error("An unknown error occurred");
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    console.error("Error creating price", error);
    return handleResponse(null, error);
  }
};
