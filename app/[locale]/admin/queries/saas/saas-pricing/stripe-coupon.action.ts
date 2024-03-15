"use server";
import { StripeManager } from "@/app/[locale]/admin/classes/stripeManager";
import { getStripeCoupons } from "@/src/helpers/db/stripeCoupons.action";
import { isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError } from "@/src/lib/safe-actions";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
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
): Promise<HandleResponseProps<iStripeCoupon>> => {
  try {
    const coupon = await stripe.createOrUpdateCoupon("create", {
      duration: data.duration ?? "once",
      duration_in_months: data.duration_in_months ?? null,
      max_redemptions: data.max_redemptions ?? null,
      name: data.name ?? "",
      percent_off: data.percent_off ?? 0,
      metadata: data.metadata ?? {},
      times_redeemed: data.times_redeemed ?? 0,
      valid: data.valid ?? true,
    });
    if (!coupon.success) throw new ActionError("Coupon could not be created");
    return handleRes<iStripeCoupon>({
      success: coupon.success,
      statusCode: 200,
    });
  } catch (ActionError) {
    return handleRes<iStripeCoupon>({
      error: ActionError,
      statusCode: 500,
    });
  }
};

export const deleteCoupon = async (couponId: string) => {
  const coupon = await stripe.removeCoupon(couponId);
  if (coupon) {
    const allCoupons = await getStripeCoupons({
      secret: process.env.NEXTAUTH_SECRET ?? "",
    });
    return allCoupons.data?.success as iStripeCoupon[];
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
