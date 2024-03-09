import {
  HandleResponseProps,
  handleRes
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action } from "@/src/lib/safe-actions";
import { iOneTimePayment } from "@/src/types/iOneTimePayments";
import { createOneTimePaymentSchema } from "@/src/types/schemas/dbSchema";
import { z } from "zod";
import { isSuperAdmin } from "../functions/isUserRole";


export const getOneTimePayment = action(
  z.object({
    payId: z.string(),
  }),
  async ({ payId }): Promise<HandleResponseProps<iOneTimePayment>> => {
    const authorized = await authorize({});
    if (!authorized) {
      throw new ActionError("Unauthorized");
    }
    try {
      const oneTimePayment = await prisma.oneTimePayment.findUnique({
        where: { id: payId },
        include: include,
      });
      if (!oneTimePayment) throw new Error("No user found");
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

export const createOneTimePayment = action(
  createOneTimePaymentSchema,
  async ({
    data,
    stripeSignature,
  }): Promise<HandleResponseProps<iOneTimePayment>> => {
    const authorized = await authorize({ stripeSignature });
    if (!authorized) {
     throw new ActionError("Unauthorized");
    }
    try {
      const oneTimePayment = await prisma.oneTimePayment.create({
        data,
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

// SECTION AUTHORIZE
type AuthorizeProps = {
  stripeSignature?: string | undefined;
};
async function authorize({
  stripeSignature,
}: AuthorizeProps): Promise<boolean> {
  const isSuperAdminFlag = await isSuperAdmin();
  let isStripeValid = false;
  if (stripeSignature) {
    isStripeValid = verifyStripeRequest(stripeSignature);
  }

  return isSuperAdminFlag || isStripeValid;
}
function verifyStripeRequest(stripeSignature: string) {
  return stripeSignature === process.env.STRIPE_WEBHOOK_SECRET;
}
