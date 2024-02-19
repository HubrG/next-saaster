"use server";
import { StripeManager } from "@/app/[locale]/admin/classes/stripeManager";
import { isSuperAdmin } from "@/src/functions/isUserRole";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { StripeCoupon } from "@prisma/client";

const stripe = new StripeManager();
/**
 * This function creates a coupon in the Stripe API.
 *
 * @param data - The data to create the coupon with.
 * @returns The result of the operation.
 */
export const addStripeCoupon = async (
  data: Partial<StripeCoupon>
): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    if (!isSuperAdmin()) throw new Error("Unauthorized");
    const coupon = await stripe.createOrUpdateCoupon("create", {
      duration: data.duration ?? "once",
      durationInMonths: data.durationInMonths ?? null,
      maxRedemptions: data.maxRedemptions ?? null,
      name: data.name ?? "",
      percentOff: data.percentOff ?? 0,
      metadata: data.metadata ?? {},
      timesRedeemed: data.timesRedeemed ?? 0,
      valid: data.valid ?? true,
    });

    if (coupon.error) throw new Error(coupon.error);

    return { success: true, data: coupon.data.data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
