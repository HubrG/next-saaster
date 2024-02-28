import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iSubscription } from "@/src/types/iSubscription";
import { Subscription } from "@prisma/client";

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
  subId,
  data,
}: {
  subId: string;
  data: Partial<Omit<Subscription, "createdAt" | "userId" | "stripeCustomerId" | "id"  | "updatedAt">>;
}): Promise<{
  success?: boolean;
  data?: iSubscription;
  error?: string;
}> => {
  try {
    const dataWithCorrectItemsType = {
      ...data,
      discount: data.discount ? JSON.parse(data.discount as string) : {},
      items: data.items ? JSON.parse(data.items as string) : {},
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
  data,
}: {
  data: Omit<Subscription, "createdAt" | "updatedAt">;
}): Promise<{
  success?: boolean;
  data?: iSubscription;
  error?: string;
}> => {
  try {
    // Ensure that the items property is of the correct type
    const dataWithCorrectItemsType = {
      ...data,
      discount: data.discount ? JSON.parse(data.discount as string) : {},
      items: data.items
        ? JSON.parse(data.items as string) 
        : {},
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

export const deleteSubscription = async({
  subId,
}: {
  subId: string;
}): Promise<{
  success?: boolean;
  data?: iSubscription;
  error?: string;
}> => {
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
}

const include = {
  user: true,
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
                  coupon: true
                },
              }
            },
          },
        },
      },
    },
  },
  SubscriptionPayments: true,
};
