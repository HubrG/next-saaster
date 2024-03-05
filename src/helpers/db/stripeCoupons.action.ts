"use server";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { StripeCoupon } from "@prisma/client";
import Stripe from "stripe";

export const getStripeCoupons = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const stripeCoupons = await prisma.stripeCoupon.findMany({
      include: {
        Plan: {
          include: {
            Plan: true,
            coupon: true,
          },
        },
      },
    });
    if (!stripeCoupons) throw new Error("No Stripe coupon found");
    return { success: true, data: stripeCoupons as StripeCoupon[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createStripeCoupon = async (
  data: StripeCoupon
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const newCoupon = await prisma.stripeCoupon.create({
      data: {
        id: data.id ?? "",
        amountOff: data.amountOff ?? 0,
        currency: data.currency ?? "",
        metadata: data.metadata ?? {},
        duration: data.duration ?? "once",
        durationInMonths: data.durationInMonths ?? null,
        maxRedemptions: data.maxRedemptions ?? null,
        timesRedeemed: data.timesRedeemed ?? 0,
        valid: data.valid ?? true,
        name: data.name,
        percentOff: data.percentOff ?? 0,
        redeemBy: data.redeemBy ?? null,
      },
    });
    return { success: true, data: newCoupon };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateStripeCoupon = async (
  id: string,
  data: Partial<StripeCoupon>
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const updatedCoupon = await prisma.stripeCoupon.update({
      where: { id: id },
      data: {
        amountOff: data.amountOff ?? 0,
        currency: data.currency ?? "",
        metadata: data.metadata ?? {},
        duration: data.duration ?? "once",
        durationInMonths: data.durationInMonths ?? null,
        maxRedemptions: data.maxRedemptions ?? null,
        timesRedeemed: data.timesRedeemed ?? 0,
        valid: data.valid ?? true,
        name: data.name,
        percentOff: data.percentOff ?? 0,
        redeemBy: data.redeemBy ?? null,
      },
    });
    return { success: true, data: updatedCoupon };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const deleteStripeCoupon = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const deletedCoupon = await prisma.stripeCoupon.delete({
      where: { id: id },
    });
    return { success: true, data: deletedCoupon };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createOrUpdateCouponStripeToBdd = async (
  type: "create" | "update",
  stripeCoupon: Stripe.Coupon
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const couponData = {
      ...stripeCoupon,
      id: stripeCoupon.id,
      amountOff: stripeCoupon.amount_off ?? null,
      currency: stripeCoupon.currency ?? null,
      duration: stripeCoupon.duration,
      durationInMonths: stripeCoupon.duration_in_months ?? null,
      maxRedemptions: stripeCoupon.max_redemptions ?? null,
      metadata: stripeCoupon.metadata ?? {},
      name: stripeCoupon.name,
      percentOff: stripeCoupon.percent_off ?? null,
      redeemBy: stripeCoupon.redeem_by ?? null,
      timesRedeemed: stripeCoupon.times_redeemed ?? 0,
      valid: stripeCoupon.valid ?? true,
    };
    if (type === "create") {
      const coupon = await createStripeCoupon(couponData as any);
      return { success: true, data: coupon };
    } else if (type === "update") {
      const coupon = await updateStripeCoupon(couponData.id, couponData);
      return { success: true, data: coupon };
    } else {
      console.error("An unknown error occurred");
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
