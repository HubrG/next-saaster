import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iOneTimePayment } from "@/src/types/db/iOneTimePayments";
import { createOneTimePaymentSchema } from "@/src/types/schemas/dbSchema";
import { z } from "zod";
import { verifyStripeRequest } from "../functions/verifyStripeRequest";

/**
 * Get just one time payment
 * - Only admins, Stripe or the user who created the one time payment can get it
 * - If stripeSignature is provided, it will be verified
 * - If stripeSignature is not provided, userSession must be provided and the user must be an admin or the user who created the one time payment
 * @param id - The id of the one time payment
 * @param stripeSignature - The stripe signature to verify
 * @returns The one time payment
 */
export const getOneTimePayment = action(
  z.object({
    id: z.string(),
    stripeSignature: z.string().optional(),
  }),
  async (
    { id, stripeSignature },
    { userSession }
  ): Promise<HandleResponseProps<iOneTimePayment>> => {
    if (stripeSignature && !verifyStripeRequest(stripeSignature))
      throw new ActionError("Unauthorized");
    try {
      const oneTimePayment = await prisma.oneTimePayment.findUnique({
        where: { id },
        include: include,
      });
      if (
        !oneTimePayment ||
        (!stripeSignature && !userSession) ||
        (userSession && userSession.user.role === "USER")
      )
        throw new ActionError("Unauthorized");
      return handleRes<iOneTimePayment>({
        success: oneTimePayment,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iOneTimePayment>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
/**
 * Create a one time payment
 * - Only superAdmins or Stripe can create one time payments
 * - If stripeSignature is provided, it will be verified
 * - If stripeSignature is not provided, userSession must be provided and the user must be an admin
 * @param data - The data to create the one time payment
 * @param stripeSignature - The stripe signature to verify
 * @returns The created one time payment
 * @throws ActionError
 *
 */
export const createOneTimePayment = action(
  createOneTimePaymentSchema,
  async (
    { data, stripeSignature },
    { userSession }
  ): Promise<HandleResponseProps<iOneTimePayment>> => {
    if (
      (stripeSignature && !verifyStripeRequest(stripeSignature)) ||
      (!stripeSignature && !userSession) ||
      (userSession && userSession.user.role === "USER")
    )
      throw new ActionError("Unauthorized");
    try {
       const dataWithCorrectItemsType = {
        ...data,
        metadata: data.metadata ? JSON.parse(data.metadata as string) : {},
      };
      const oneTimePayment = await prisma.oneTimePayment.create({
        data:dataWithCorrectItemsType,
        include,
      });
      if (!oneTimePayment)
        throw new Error("No payment created, please try again");
      return handleRes<iOneTimePayment>({
        success: oneTimePayment,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iOneTimePayment>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  user: true,
  price: {
    include: {
      productRelation: {
        include: {
          PlanRelation: true,
        },
      },
    },
  },
};
