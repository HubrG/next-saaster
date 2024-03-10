import { handleResponse } from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iSubscription } from "@/src/types/db/iSubscription";
import { Subscription } from "@prisma/client";
import { isSuperAdmin } from "../functions/isUserRole";

type GetSubProps = {
  subId: string;
};
export const getSubscription = async ({
  subId,
}: GetSubProps): Promise<{
  success?: boolean;
  data?: iSubscription;
  error?: string;
}> => {
  const authorized = await authorize({});
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subId },
      include: include,
    });
    if (!subscription) throw new Error("No user found");
    return handleResponse<iSubscription>(subscription);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const updateSubscription = async ({
  stripeSignature,
  subId,
  data,
}: {
  stripeSignature?: string | undefined;
  subId: string;
  data: Partial<
    Omit<
      Subscription,
      "createdAt" | "userId" | "stripeCustomerId" | "id" | "updatedAt"
    >
  >;
}): Promise<{
  success?: boolean;
  data?: iSubscription;
  error?: string;
}> => {
   const authorized = await authorize({stripeSignature});
   if (!authorized) {
     return handleResponse<undefined>(undefined, "Unauthorized");
   }
  try {
    const dataWithCorrectItemsType = {
      ...data,
      allDatas: data.allDatas ? JSON.parse(data.allDatas as string) : {},
    };
    const subscription = await prisma.subscription.update({
      where: { id: subId },
      data: dataWithCorrectItemsType,
      include: include,
    });
    return handleResponse<iSubscription>(subscription);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const createSubscription = async ({
  stripeSignature,
  data,
}: {
  data: Omit<Subscription, "createdAt" | "updatedAt">;
  stripeSignature?: string | undefined;
}): Promise<{
  success?: boolean;
  data?: iSubscription;
  error?: string;
}> => {

  const authorized = await authorize({ stripeSignature });
   if (!authorized) {
     return handleResponse<undefined>(undefined, "Unauthorized");
   }
  try {
    // Ensure that the items property is of the correct type
    const dataWithCorrectItemsType = {
      ...data,
      allDatas: data.allDatas ? JSON.parse(data.allDatas as string) : {},
    };
    const subscription = await prisma.subscription.create({
      data: dataWithCorrectItemsType,
      include: include,
    });
    return handleResponse<iSubscription>(subscription);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const deleteSubscription = async ({
  stripeSignature,
  subId,
}: {
    subId: string;
    stripeSignature?: string | undefined;
}): Promise<{
  success?: boolean;
  data?: iSubscription;
  error?: string;
}> => {
   const authorized = await authorize({ stripeSignature });
   if (!authorized) {
     return handleResponse<undefined>(undefined, "Unauthorized");
   }
  try {
    const subscription = await prisma.subscription.delete({
      where: { id: subId },
      include: include,
    });
    return handleResponse<iSubscription>(subscription);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

const include = {
  users: {
    include: {
      user: true,
    },
  },
  price: {
    include: {
      productRelation: {
        include: {
          PlanRelation: {
            include: {
              Features: {
                include: { feature: true },
              },
              coupons: {
                include: {
                  coupon: true,
                },
              },
            },
          },
        },
      },
    },
  },
  SubscriptionPayments: true,
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
