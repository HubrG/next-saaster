import { handleResponse } from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iSubscriptionPayment } from "@/src/types/iSubscriptionPayments";
import { isSuperAdmin } from "../functions/isUserRole";

type GetSubPayProps = {
  subId: string;
};
export const getSubscriptionPayment = async ({
  subId,
}: GetSubPayProps): Promise<{
  success?: boolean;
  data?: iSubscriptionPayment;
  error?: string;
}> => {
    const authorized = await authorize({ });
    if (!authorized) {
      return handleResponse<undefined>(undefined, "Unauthorized");
    }
  try {
    const subscriptionPayment = await prisma.subscriptionPayment.findUnique({
      where: { id: subId },
      include: include,
    });
    if (!subscriptionPayment) throw new Error("No user found");
    return handleResponse<iSubscriptionPayment>(subscriptionPayment);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};
export const createSubcriptionPayment = async ({
  stripeSignature,
  data,
}: {
  data: Partial<
    Omit<iSubscriptionPayment, "createdAt" | "updatedAt" | "subscription">
  >;
  stripeSignature?: string | undefined;
}): Promise<{
  success?: boolean;
  data?: iSubscriptionPayment;
  error?: string;
}> => {
    const authorized = await authorize({ stripeSignature });
    if (!authorized) {
      return handleResponse<undefined>(undefined, "Unauthorized");
    }
  try {
    const subscriptionPayment = await prisma.subscriptionPayment.create({
      data: data,
      include: include,
    });
    return handleResponse<iSubscriptionPayment>(subscriptionPayment);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const updateSubscriptionPayment = async ({
  subId,
  data,
  stripeSignature,
}: {
  stripeSignature?: string | undefined;
  subId: string;
  data: Partial<
    Omit<iSubscriptionPayment, "createdAt" | "updatedAt" | "subscription">
  >;
}): Promise<{
  success?: boolean;
  data?: iSubscriptionPayment;
  error?: string;
}> => {
    const authorized = await authorize({ stripeSignature });
    if (!authorized) {
      return handleResponse<undefined>(undefined, "Unauthorized");
    }
  try {
    const subscriptionPayment = await prisma.subscriptionPayment.update({
      where: { id: subId },
      data: data,
      include: include,
    });
    return handleResponse<iSubscriptionPayment>(subscriptionPayment);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};
const include = {
  subscription: true
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
