"use server";
import { handleError } from "@/src/lib/error-handling/handleError";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iStripeCoupon } from "@/src/types/db/iStripeCoupons";
import { stripeCouponSchema } from "@/src/types/schemas/dbSchema";
import { z } from "zod";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

/**
 * This action is used to get all the Stripe coupons from the database
 * @param secret - The secret key to authenticate the request
 * @returns - An array of Stripe coupons
 */
export const getStripeCoupons = action(
  z.object({
    secret: z.string(),
  }),
  async ({ secret }): Promise<HandleResponseProps<iStripeCoupon[]>> => {
    // 🔐 Security
    if (secret !== process.env.NEXTAUTH_SECRET) {
      throw new ActionError("Unauthorized");
    }
    // 🔓 Unlocked
    try {
      const stripeCoupons = await prisma.stripeCoupon.findMany({
        include,
      });
      if (!stripeCoupons) throw new Error("No Stripe coupon found");
      return handleRes<iStripeCoupon[]>({
        success: stripeCoupons,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeCoupon[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * This action is used to create a new Stripe coupon in the database with the *createOrUpdateCouponStripeToBdd* method
 * @param data - The data of the new Stripe coupon provided by Stripe API (Id provided from Stripe)
 * @param secret - optional - The secret key to authenticate the request
 * @returns The new Stripe coupon
 * @throws An error if the user is not authorized by the secret key
 * @throws An error if user is not an admin and no secret key is provided
 *
 */
export const createStripeCoupon = action(
  stripeCouponSchema,
  async (
    { data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeCoupon>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (secret && secret !== process.env.NEXTAUTH_SECRET)
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const newCoupon = await prisma.stripeCoupon.create({
        data,
        include,
      });
      return handleRes<iStripeCoupon>({
        success: newCoupon,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeCoupon>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * This action is used to update a Stripe coupon in the database with the *createOrUpdateCouponStripeToBdd* method
 * @param data - The data of the new Stripe coupon provided by Stripe API (Id provided from Stripe)
 * @param secret - optional - The secret key to authenticate the request
 * @returns The updated Stripe coupon
 */
export const updateStripeCoupon = action(
  stripeCouponSchema,
  async (
    { data, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeCoupon>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (secret && secret !== process.env.NEXTAUTH_SECRET)
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const updatedCoupon = await prisma.stripeCoupon.update({
        where: { id: data.id },
        data,
        include,
      });
      return handleRes<iStripeCoupon>({
        success: updatedCoupon,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeCoupon>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * This action is used to delete a Stripe coupon from the database, uniquely from Stripe
 * @param id - The id of the Stripe coupon to delete
 * @param stripeSignature - The signature provided by Stripe to authenticate the request
 * @returns The deleted Stripe coupon
 */
export const deleteStripeCoupon = action(
  z.object({
    id: z.string(),
    stripeSignature: z.string().optional(),
    secret: z.string().optional(),
  }),
  async (
    { id, stripeSignature, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeCoupon>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (secret && secret !== process.env.NEXTAUTH_SECRET) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const deletedCoupon = await prisma.stripeCoupon.delete({
        where: { id },
        include,
      });
      if (!deletedCoupon) throw new Error("No Stripe coupon found");
      return handleRes<iStripeCoupon>({
        success: deletedCoupon,
        statusCode: 200,
      });
    } catch (error) {
      return handleRes<iStripeCoupon>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

/**
 * This action is used to create or update a Stripe coupon in the database, provided by Stripe Webhook or `stripeManager` file method
 * @param type - The type of action to perform (create or update)
 * @param data - The data of the new Stripe coupon provided by Stripe API (Id provided from Stripe)
 * @param stripeSignature - The signature provided by Stripe to authenticate the request
 * @param secret - optional - The secret key to authenticate the request
 * @returns The new or updated Stripe coupon
 * @throws An error if the user is not authorized by the secret key
 * @throws An error if user is not an admin and no secret key is provided
 * @throws An error if the type is invalid
 * @throws An error if the request is not authenticated by Stripe
 * @throws An error if the request is not authenticated by the secret key and the user is not an admin
 */
export const createOrUpdateCouponStripeToBdd = action(
  stripeCouponSchema,
  async (
    { type, data, stripeSignature, secret },
    { userSession }
  ): Promise<HandleResponseProps<iStripeCoupon>> => {
    // 🔐 Security
    if (
      (userSession && userSession?.user.role === "USER") ||
      (!stripeSignature && !secret) ||
      (secret && secret !== process.env.NEXTAUTH_SECRET) ||
      (stripeSignature && !verifyStripeRequest(stripeSignature))
    )
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      let coupon;
      if (type === "create") {
        coupon = await createStripeCoupon({
          data,
          secret: process.env.NEXTAUTH_SECRET ?? "",
        });
      } else if (type === "update") {
        coupon = await updateStripeCoupon({
          data,
          secret: process.env.NEXTAUTH_SECRET ?? "",
        });
      } else {
        throw new ActionError("Invalid type");
      }
      if (handleError(coupon).error)
        throw new ActionError(handleError(coupon).message);

      return handleRes<iStripeCoupon>({
        success: coupon.data?.success,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iStripeCoupon>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  Plan: {
    include: {
      Plan: true,
      coupon: true,
    },
  },
};
