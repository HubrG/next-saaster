"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { StripePrice } from "@prisma/client";

export const getStripePrices = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const stripePrices = await prisma.stripePrice.findMany();
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

export const deletePrice = async (
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
