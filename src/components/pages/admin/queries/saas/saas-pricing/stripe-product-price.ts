"use server";
import { StripeManager } from "@/src/components/pages/admin/classes/stripeManager";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { getSaasSettings } from "@/src/helpers/utils/saasSettings";
import { getErrorMessage } from "@/src/lib/getErrorMessage";

const stripe = new StripeManager();
/**
 * This function creates a product in the Stripe API.
 * @param name
 * @returns { success: datas, data: datas } | { error: string }
 * @example
 * const product = await addStripeProduct("New product");
 */
export const addStripeProduct = async (
  name: string
): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    if (!isSuperAdmin()) throw new Error("Unauthorized");
    const saasSettings = await getSaasSettings();
    if (saasSettings.error) throw new Error(saasSettings.error);
    const product = await stripe.createProduct({
      name: name,
      currency: saasSettings.data.currency,
    });
    if (product.error) throw new Error(product.error);
    return { success: true, data: product.data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
