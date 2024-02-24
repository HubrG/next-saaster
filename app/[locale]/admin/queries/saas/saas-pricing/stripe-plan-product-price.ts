"use server";

import { StripeManager } from "@/app/[locale]/admin/classes/stripeManager";
import {
  createPlan,
  deletePlan,
  getPlan,
  updatePlan as upPlan,
} from "@/src/helpers/db/plans";
import { getSaasSettings } from "@/src/helpers/db/saasSettings";
import { searchPricesRaw } from "@/src/helpers/db/stripePrices";
import { getStripeProduct } from "@/src/helpers/db/stripeProducts";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { iPlan } from "@/src/types/iPlans";
import { iStripeProduct } from "@/src/types/iStripeProducts";
import { PlanToFeature, SaasTypes } from "@prisma/client";
import { toLower } from "lodash";
import Stripe from "stripe";
const stripeManager = new StripeManager();

// SECTION -> Create New Plan
export const createNewPlan = async (
  saasType: SaasTypes
): Promise<{
  success?: boolean;
  plan?: iPlan;
  features?: PlanToFeature[];
  error?: string;
}> => {
  const session = await isSuperAdmin();
  if (!session) return { error: "You are not authorized" };
  try {
    const saasSettings = await getSaasSettings();
    if (!saasSettings.data) throw new Error(saasSettings.error);
    const newPlan = (await createPlan({
      name: "New plan",
      description: "New plan description",
      saasType: saasType,
    })) as { data: iPlan };
    if (!newPlan) throw new Error("Error creating plan");
    const newProduct = await stripeManager.createOrUpdateProduct({
      saasType: saasType,
      type: "create",
      name: "New plan",
      description: "New plan description",
      currency: saasSettings.data.currency ?? "usd",
      planId: newPlan.data.id,
    });
    if (newProduct.error) {
      deleteNewPlan(newPlan.data.id);
      throw new Error(newProduct.error);
    }
    const retrievePlan = await getPlan(newPlan.data.id);
    if (retrievePlan.error) throw new Error(retrievePlan.error);
    return {
      success: true,
      plan: retrievePlan.data,
      features: retrievePlan.data.Features,
    };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

// SECTION -> Update Plan
export const updatePlan = async (
  data: Partial<iPlan>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  const session = await isSuperAdmin();
  if (!session) return { error: "You are not authorized" };
  try {
    if (!data.stripeId || !data.id) throw new Error("No stripeId found");
    const initialPlan = (await getPlan(data.id)) as {
      data: iPlan;
      error: string;
      success: boolean;
    };
    if (!initialPlan) throw new Error("Error getting initial plan");
    // if deleted = true, deactive the plan
    if (data.deleted) {
      data = { ...data, active: false };
    }
    if (!data.stripeId) throw new Error("No stripeId found");
    const product = (await getStripeProduct(data.stripeId)) as {
      data: iStripeProduct;
      error: string;
      success: boolean;
    };
    if (product.error) throw new Error(product.error);
    const prices = product.data.prices;
    const saasSettings = (await getSaasSettings()) as {
      data: { currency: string };
    };
    // NOTE : Pay once
    if (data.saasType === "PAY_ONCE") {
      // We verify if the plan prices has changed
      if (initialPlan.data.oncePrice === data.oncePrice) {
        const validUpdate = await upPlan(data);
        if (validUpdate.error) throw new Error(validUpdate.error);
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "PAY_ONCE"
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        return { success: true, data: validUpdate.data };
      } else {
        //  We create a new price for the plan and update de default price of the product
        const newPrice = (await createNewPriceForPlan({
          data: data,
          dataToSet: {
            product: product.data.id,
            currency: saasSettings.data.currency ?? "usd",
            unit_amount: (data.oncePrice && data.oncePrice * 100) ?? 0,
          },
        })) as { data: { data: { id: string } }; error: string };
        if (newPrice.error) throw new Error(newPrice.error);
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "PAY_ONCE",
          newPrice.data.data.id
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        // We deactive others prices for the product, not the new one
        const deactivatedOldPrices = await deactivateOldPrices({
          prices,
          newPriceId: newPrice.data.data.id,
          interval: undefined,
        });
        if (deactivatedOldPrices.error)
          throw new Error(deactivatedOldPrices.error);
        const validUpdate = await upPlan(data);
        if (validUpdate.error) throw new Error(validUpdate.error);
        return { success: true, data: validUpdate.data };
      }
    }
    // NOTE : MRR_SIMPLE | METERED_USAGE | PER_SEAT
    else if (
      data.saasType === "MRR_SIMPLE" ||
      data.saasType === "METERED_USAGE" ||
      data.saasType === "PER_SEAT"
    ) {
      // We verify if the plan prices has changed
      if (
        initialPlan.data.monthlyPrice === data.monthlyPrice &&
        initialPlan.data.yearlyPrice === data.yearlyPrice &&
        initialPlan.data.meteredUnit === data.meteredUnit &&
        initialPlan.data.meteredMode === data.meteredMode &&
        initialPlan.data.meteredBillingPeriod === data.meteredBillingPeriod
      ) {
        const validUpdate = await upPlan(data);
        if (validUpdate.error) throw new Error(validUpdate.error);
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "MRR_SIMPLE"
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        return { success: true, data: initialPlan.data };
      } else {
        //  We create a new price for the plan and update de default price of the product
        if (
          initialPlan.data.monthlyPrice !== data.monthlyPrice ||
          initialPlan.data.meteredUnit !== data.meteredUnit ||
          initialPlan.data.meteredMode !== data.meteredMode ||
          initialPlan.data.meteredBillingPeriod !== data.meteredBillingPeriod
        ) {
          const newPrice = (await createNewPriceForPlan({
            data: data,
            dataToSet: {
              product: product.data.id,
              currency: saasSettings.data.currency ?? "usd",
              recurring: {
                interval:
                  data.saasType === "METERED_USAGE"
                    ? (toLower(data.meteredBillingPeriod) as
                        | "week"
                        | "month"
                        | "day")
                    : "month",
                interval_count: 1,
                usage_type:
                  data.saasType === "METERED_USAGE" ? "metered" : "licensed",
                aggregate_usage:
                  data.saasType === "METERED_USAGE" ? "sum" : undefined,
              },
              transform_quantity:
                data.saasType === "METERED_USAGE" &&
                data.meteredMode === "PACKAGE"
                  ? {
                      divide_by: data.meteredUnit ?? 0,
                      round: "up",
                    }
                  : undefined,
              unit_amount:
                data.saasType === "METERED_USAGE"
                  ? undefined
                  : (data.monthlyPrice && data.monthlyPrice * 100) ?? 0,
              unit_amount_decimal:
                data.saasType === "METERED_USAGE"
                  ? `${data.monthlyPrice && data.monthlyPrice * 100}`
                  : undefined ?? undefined,
            },
          })) as { data: { data: { id: string } }; error: string };
          if (newPrice.error) throw new Error(newPrice.error);
          const { stripeYearlyPriceId, ...restOfData } = data;
          const validUpdate = await upPlan({
            ...restOfData,
            monthlyPrice: data.monthlyPrice,
            stripeMonthlyPriceId: newPrice.data.data.id,
          });
          if (validUpdate.error) throw new Error(validUpdate.error);
          const deactivate = await deactivateOldPrices({
            prices: prices,
            newPriceId: newPrice.data.data.id,
            interval:
              data.saasType === "METERED_USAGE"
                ? (toLower(initialPlan.data.meteredBillingPeriod) as
                    | "month"
                    | "week"
                    | "day"
                    | "year")
                : "month",
            oldPrice: initialPlan.data.monthlyPrice ?? 0,
            defaultPrice: product.data.default_price,
          });
          if (deactivate.error) throw new Error(deactivate.error);
        }
        if (initialPlan.data.yearlyPrice !== data.yearlyPrice) {
          const newPrice = (await createNewPriceForPlan({
            data: data,
            dataToSet: {
              product: product.data.id,
              currency: saasSettings.data.currency ?? "usd",
              recurring: {
                interval: "year",
                interval_count: 1,
              },
              unit_amount: (data.yearlyPrice && data.yearlyPrice * 100) ?? 0,
            },
          })) as { data: { data: { id: string } }; error: string };
          if (newPrice.error) throw new Error(newPrice.error);
          const { stripeMonthlyPriceId, ...restOfData } = data;
          const validUpdate = await upPlan({
            ...restOfData,
            stripeYearlyPriceId: newPrice.data.data.id,
          });
          if (validUpdate.error) throw new Error(validUpdate.error);
          const deactivate = await deactivateOldPrices({
            prices: prices,
            newPriceId: newPrice.data.data.id,
            interval: "year",
            oldPrice: initialPlan.data.yearlyPrice ?? 0,
            defaultPrice: product.data.default_price,
          });
          if (deactivate.error) throw new Error(deactivate.error);
        }
        const updatedProduct = await updateStripeProduct(
          data,
          product.data,
          data.saasType ?? "MRR_SIMPLE"
        );
        if (updatedProduct.error) throw new Error(updatedProduct.error);
        return { success: true, data: updatedProduct.data };
      }
    }
    return { success: true, data: initialPlan.data };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

// SECTION -> UTILS
export const deleteNewPlan = async (
  plan: iPlan["id"]
): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const delPlan = await deletePlan({ id: plan });
    if (!delPlan) throw new Error("Error deleting plan");
    return { success: true, data: delPlan };
  } catch (error) {
    console.error(error);
    return { error: "Error deleting plan" };
  }
};

const updateStripeProduct = async (
  data: Partial<iPlan>,
  product: Partial<iStripeProduct>,
  saasType: SaasTypes,
  defaultPriceId?: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  if (!data.stripeId || !data.id) throw new Error("No stripeId found");
  try {
    const dataToSend = {
      type: "update" as const,
      id: data.stripeId,
      saasType: saasType,
      name: data.name ?? product.name,
      description: data.description ?? "",
      active: data.active ?? false,
      planId: data.id,
      ...(defaultPriceId && { default_price: defaultPriceId }),
    };

    const updatedProduct = await stripeManager.createOrUpdateProduct(
      dataToSend
    );
    return { success: true, data: updatedProduct.data };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

type deactivateOldPricesProps = {
  prices: iStripeProduct["prices"];
  newPriceId: string;
  interval?: "month" | "year" | "week" | "day";
  oldPrice?: number;
  defaultPrice?: string;
};

const deactivateOldPrices = async ({
  prices,
  newPriceId,
  interval,
  oldPrice,
  defaultPrice,
}: deactivateOldPricesProps): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  // We retrieve the prices of the product and deactivate the old ones
  let searchPrices;
  const dataToSendForInterval = {
    product: prices[0].product,
    active: true,
    newPriceId: newPriceId,
    type: "recurring",
    recurringInterval: interval ?? "",
    oldPrice: oldPrice ?? 0,
    defaultPrice: defaultPrice ?? "",
  };
  if (!interval) {
    searchPrices = await stripeManager.searchPrices(`
    product: "${prices[0].product}" AND active: "true"
  `);
  } else {
    searchPrices = await searchPricesRaw(dataToSendForInterval);
  }

  if (searchPrices.error) return { error: searchPrices.error };
  const deactivatingOldPrices = searchPrices.data.map((price: any) => {
    if (price.id === newPriceId) return;
    return stripeManager.createOrUpdatePrice("update", {
      id: price.id,
      currency: price.currency,
      metadata: { active: "false" },
      active: false,
    });
  });
  const deactivatedOldPrices = await Promise.all(deactivatingOldPrices);
  if (deactivatedOldPrices.some((price) => price?.error))
    throw new Error("Error deactivating old prices");
  return { success: true, data: deactivatedOldPrices };
};

interface createNewPriceForPlan {
  data: Partial<iPlan>;
  dataToSet: {} & Stripe.PriceCreateParams;
}
const createNewPriceForPlan = async ({
  data,
  dataToSet,
}: createNewPriceForPlan): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  if (!data.stripeId || !data.id) throw new Error("No stripeId found");
  try {
    const newPrice = await stripeManager.createOrUpdatePrice(
      "create",
      dataToSet
    );
    if (newPrice.error) throw new Error(newPrice.error);
    return { success: true, data: newPrice.data };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};
