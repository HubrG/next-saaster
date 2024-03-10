"use server";
import { StripeManager } from "@/app/[locale]/admin/classes/stripeManager";
import { StripeManager as StripeManagerClass } from "@/app/[locale]/admin/classes/stripeManagerClass";
import { getStripeCoupons } from "@/src/helpers/db/stripeCoupons.action";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
import { iStripePlanCoupon } from "@/src/types/db/iStripePlanCoupons";
import { StripeCoupon } from "@prisma/client";

const stripe = new StripeManager();
const stripeManager = new StripeManagerClass();
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


export const createNewCoupon = async (data: Partial<iStripePlanCoupon>) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  let validatedDurationInMonths: number | undefined =
    typeof data.coupon?.durationInMonths === "number"
      ? data.coupon.durationInMonths
      : undefined;

  const validatedName: string | undefined = data.coupon?.name ?? undefined;
  const validatedPercentOff: number | undefined =
    typeof data.coupon?.percentOff === "number"
      ? data.coupon?.percentOff
      : undefined;

  const coupon = await stripeManager.createCoupon({
    duration: data.coupon?.duration as "forever" | "once" | "repeating",
    duration_in_months: validatedDurationInMonths,
    name: validatedName,
    max_redemptions: data.coupon?.maxRedemptions as number | undefined,
    percent_off: validatedPercentOff,
  });

  return coupon as iStripeCoupon;
};

export const deleteCoupon = async (couponId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;
  const coupon = await stripeManager.deleteCoupon(couponId);
  if (coupon) {
    const allCoupons = (await getStripeCoupons()).data;
    return allCoupons as iStripeCoupon[];
  } else {
    return false;
  }
};

export const applyCoupon = async (
  couponId: string,
  planId: string,
  planRecurrence: "monthly" | "yearly" | "once"
) => {
  const session = await isSuperAdmin();
  if (!session) return false;

  // Si un coupon existe déjà avec la même recurrence sur le même plan, on le supprime et on le remplace:
  const searchForReplace = await prisma.stripePlanCoupon.findMany({
    where: {
      PlanId: planId,
      recurrence: planRecurrence,
    },
  });
  // On supprime les coupons existants
  let deleteCoupon = false;
  if (searchForReplace.length > 0) {
    await prisma.stripePlanCoupon.deleteMany({
      where: {
        PlanId: planId,
        recurrence: planRecurrence,
      },
    });
    deleteCoupon = true;
  }
  // On crée le nouveau coupon
  if (
    (searchForReplace.length > 0 && deleteCoupon) ||
    searchForReplace.length === 0
  ) {
    const coupon = await prisma.stripePlanCoupon.create({
      data: {
        couponId: couponId,
        PlanId: planId,
        recurrence: planRecurrence,
      },
      include: {
        coupon: true,
        Plan: {
          include: {
            coupons: {
              include: {
                coupon: true,
              },
            },
          },
        },
      },
    });
    return coupon.Plan.coupons;
  }
};

export const revokeCoupon = async (couponId: string) => {
  const session = await isSuperAdmin();
  if (!session) return false;
  const coupon = await prisma.stripePlanCoupon.delete({
    where: {
      id: couponId,
    },
    include: {
      coupon: true,
      Plan: {
        include: {
          coupons: {
            include: {
              coupon: true,
            },
          },
        },
      },
    },
  });

  return coupon.Plan.coupons;
};
