"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { StripeCoupon } from "@prisma/client";

export const getStripeCoupons = async (): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const stripeCoupons = await prisma.stripeCoupon.findMany();
    if (!stripeCoupons) throw new Error("No app settings found");
    return { success: true, data: stripeCoupons as StripeCoupon[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
