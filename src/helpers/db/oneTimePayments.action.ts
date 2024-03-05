import { handleResponse } from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iOneTimePayment } from "@/src/types/iOneTimePayments";
import { isSuperAdmin } from "../functions/isUserRole";

type GetOncePayProps = {
  payId: string;
};
export const getOneTimePayment = async ({
  payId,
}: GetOncePayProps): Promise<{
  success?: boolean;
  data?: iOneTimePayment;
  error?: string;
}> => {
  const authorized = await authorize({});
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  try {
    const oneTimePayment = await prisma.oneTimePayment.findUnique({
      where: { id: payId },
      include: include,
    });
    if (!oneTimePayment) throw new Error("No user found");
    return handleResponse<iOneTimePayment>(oneTimePayment);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const createOneTimePayment = async ({
  data,
  stripeSignature,
}: {
  data: Omit<iOneTimePayment, "user" | "price" | "createdAt" | "updatedAt">;
  stripeSignature?: string | undefined;
}): Promise<{
  success?: boolean;
  data?: iOneTimePayment;
  error?: string;
}> => {
  const authorized = await authorize({ stripeSignature });
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  try {
    const oneTimePayment = await prisma.oneTimePayment.create({
      data: data,
      include: include,
    });
    return handleResponse<iOneTimePayment>(oneTimePayment);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

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
