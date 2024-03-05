import { handleResponse } from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iUserSubscription } from "@/src/types/iUserSubscription";
import { UserSubscription } from "@prisma/client";
import { isSuperAdmin } from "../functions/isUserRole";

export const getUserSubscription = async ({
  data,
}: {
  data: UserSubscription;
}): Promise<{
  success?: boolean;
  data?: iUserSubscription;
  error?: string;
}> => {
  const authorized = await authorize({});
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  try {
    const subscription = await prisma.userSubscription.findUnique({
      where: {
        userId_subscriptionId: {
          userId: data.userId,
          subscriptionId: data.subscriptionId,
        },
      },
      include: include,
    });
    if (!subscription) throw new Error("No user found");
    return handleResponse<iUserSubscription>(subscription);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const updateUserSubscription = async ({
  stripeSignature,
  data,
}: {
  data: UserSubscription;
  stripeSignature?: string | undefined;
}): Promise<{
  success?: boolean;
  data?: UserSubscription;
  error?: string;
}> => {
  const authorized = await authorize({ stripeSignature });
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  try {
    const userSubscriptions = await prisma.userSubscription.findMany({
      where: {
        OR: [{ subscriptionId: data.subscriptionId }, { userId: data.userId }],
      },
    });

    const updatePromises = userSubscriptions.map((userSub) => {
      return prisma.userSubscription.update({
        where: {
          userId_subscriptionId: {
            userId: userSub.userId,
            subscriptionId: userSub.subscriptionId,
          },
        },
        data: {
          isActive: data.isActive,
        },
      });
    });

    const updatedSubscriptions = await Promise.all(updatePromises);
    return handleResponse<any>(updatedSubscriptions);
  } catch (error) {
    console.error(error);
    return handleResponse(undefined, error);
  }
};

export const createUserSubscription = async ({
  stripeSignature,
  data,
}: {
  data: UserSubscription;
  stripeSignature?: string | undefined;
}): Promise<{
  success?: boolean;
  data?: iUserSubscription;
  error?: string;
}> => {
  const authorized = await authorize({ stripeSignature });
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  try {
    // Ensure that the items property is of the correct type

    const subscription = await prisma.userSubscription.create({
      data: data,
      include: include,
    });
    return handleResponse<iUserSubscription>(subscription);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

const include = {
  user: true,
  subscription: true,
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
