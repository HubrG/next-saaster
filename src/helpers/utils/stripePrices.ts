"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
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
    if (!stripePrices) throw new Error("No app settings found");
    return { success: true, data: stripePrices as StripePrice[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createStripePrice = async (
  data: Partial<StripePrice>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const stripePrice = await prisma.stripePrice.create({
      data: {
        id: data.id ?? "",
        active: data.active ?? false,
        billing_scheme: data.billing_scheme,
        custom_unit_amount: data.custom_unit_amount ?? null,
        currency: data.currency ?? "",
        metadata: data.metadata ?? {},
        nickname: data.nickname ?? "",
        product: data.product as string,
        recurring: data.recurring ?? {},
        recurring_interval: data.recurring_interval,
        recurring_interval_count: data.recurring_interval_count ?? null,
        recurring_aggregate_usage: data.recurring_aggregate_usage ?? null,
        recurring_trial_period_days: data.recurring_trial_period_days ?? null,
        recurring_usage_type: data.recurring_usage_type,
        tiers_mode: data.tiers_mode ?? null,
        type: data.type ?? "recurring",
        unit_amount: data.unit_amount ?? 0,
        unit_amount_decimal: data.unit_amount_decimal ?? "0",
        transform_quantity: data.transform_quantity ?? {},
        transform_quantity_divide_by: data.transform_quantity_divide_by ?? null,
        transform_quantity_round: data.transform_quantity_round ?? null,
      },
    });
    return { success: true, data: stripePrice as StripePrice };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateStripePrice = async (
  data: Partial<StripePrice>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const stripePrice = await prisma.stripePrice.update({
      where: { id: data.id },
      data: {
        active: data.active,
        billing_scheme: data.billing_scheme,
        custom_unit_amount: data.custom_unit_amount,
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

export const createOrUpdatePriceStripeToBdd = async (
  type: "create" | "update",
  stripePrice: Stripe.Price
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const priceData = {
      ...stripePrice,
      id: stripePrice.id,
      active: stripePrice.active,
      billing_scheme: stripePrice.billing_scheme,
      custom_unit_amount: stripePrice.custom_unit_amount ?? null,
      currency: stripePrice.currency,
      lookup_key: stripePrice.lookup_key ?? null,
      metadata: stripePrice.metadata ?? {},
      nickname: stripePrice.nickname ?? null,
      product: stripePrice.product as Stripe.Product["id"],
      recurring: stripePrice.recurring,
      recurring_interval: stripePrice.recurring?.interval ?? null,
      recurring_interval_count: stripePrice.recurring?.interval_count ?? null,
      recurring_aggregrate_usage:
        stripePrice.recurring?.aggregate_usage ?? null,
      recurring_trial_period_days:
        stripePrice.recurring?.trial_period_days ?? null,
      recurring_usage_type: stripePrice.recurring?.usage_type ?? null,
      tier_mode: stripePrice.tiers_mode ?? null,
      transform_quantity: stripePrice.transform_quantity ?? null,
      transform_quantity_divide_by:
        stripePrice.transform_quantity?.divide_by ?? null,
      transform_quantity_round: stripePrice.transform_quantity?.round ?? null,
      type: stripePrice.type,
      unit_amount: stripePrice.unit_amount,
      unit_amount_decimal: stripePrice.unit_amount_decimal,
    };
    if (type === "create") {
      const price = await createStripePrice(priceData as any);
      return { success: true, data: price };
    } else if (type === "update") {
      const price = await updateStripePrice(priceData as any);
      return { success: true, data: price };
    } else {
      console.error("An unknown error occurred");
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
