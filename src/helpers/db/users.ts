"use server";
import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iUsers } from "@/src/types/iUsers";

type GetUserProps = {
  email: string;
};
/**
 *  Get user by email
 *
 * @remarks
 * This method is part of the {@link utils/users | users utilities}.
 *
 * @param email - The email of the user
 * @returns The user object
 */
export const getUser = async ({
  email,
}: GetUserProps): Promise<{
  success?: boolean;
  data?: iUsers;
  error?: string;
}> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: include,
    });
    if (!user) throw new Error("No user found");
    return handleResponse<iUsers>(user);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const getUserByCustomerId = async ({
  customerId,
}: {
  customerId: string;
}): Promise<{
  success?: boolean;
  data?: iUsers;
  error?: string;
}> => {
  try {
    const user = await prisma.user.findFirst({
      where: { customerId: customerId },
      include: include,
    });
    if (!user) throw new Error("No user found");
    return handleResponse<iUsers>(user);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: any;
}): Promise<{
  success?: boolean;
  data?: iUsers;
  error?: string;
}> => {
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: data,
      include: include,
    });
    if (!user) throw new Error("No user found");
    return handleResponse<iUsers>(user);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

const include = {
  subscriptions: {
    include: {
      SubscriptionPayments: true,
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
    },
  },
  contacts: true,
  oneTimePayments: {
    include: {
      price: {
        include: {
          productRelation: {
            include: {
              PlanRelation: true,
            },
          },
        },
      },
    },
  },
};
