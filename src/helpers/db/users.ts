"use server";
import { isMe, isSuperAdmin } from "@/src/helpers/functions/isUserRole";
import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iUsers } from "@/src/types/iUsers";

type GetUserProps = {
  email: string;
  stripeSignature?: string | undefined;
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
  stripeSignature,
}: GetUserProps): Promise<{
  success?: boolean;
  data?: iUsers;
  error?: string;
}> => {
  const authorized = await authorize({ email, stripeSignature });
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  //
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
  data?: Partial<iUsers>;
  error?: string;
}> => {
  //
  try {
    const user = await prisma.user.findFirst({
      where: { customerId: customerId },
      // include: include,
      select: {
        id: true,
        email: true,
      },
    });
    if (!user) throw new Error("No user found");
    return handleResponse<Partial<iUsers>>(user);
  } catch (error) {
    console.error(error);
    return handleResponse<undefined>(undefined, error);
  }
};

export const updateUser = async ({
  email,
  data,
  stripeSignature,
}: {
  email: string;
  data: any;
  stripeSignature?: string | undefined;
}): Promise<{
  success?: boolean;
  data?: iUsers;
  error?: string;
}> => {
  const authorized = await authorize({ email, stripeSignature });
  if (!authorized) {
    return handleResponse<undefined>(undefined, "Unauthorized");
  }
  try {
    const user = await prisma.user.update({
      where: { email: email },
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
  organization: {
    include: {
      owner: true,
      members: true,
    },
  },
  subscriptions: {
    where: { isActive: true },
    include: {
      subscription: {
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
    },
  },
  contacts: true,
  oneTimePayments: {
    include: {
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
};
// SECTION AUTHORIZE
type AuthorizeProps = {
  email?: string;
  stripeSignature?: string | undefined;
};
async function authorize({
  email,
  stripeSignature,
}: AuthorizeProps): Promise<boolean> {
  const isSuperAdminFlag = await isSuperAdmin();
  let isUserFlag = true;
  if (email) {
    isUserFlag = await isMe(email);
  }

  let isStripeValid = false;
  if (stripeSignature) {
    isStripeValid = await verifyStripeRequest(stripeSignature);
  }

  return isSuperAdminFlag || isUserFlag || isStripeValid;
}
function verifyStripeRequest(stripeSignature: string) {
  return stripeSignature === process.env.STRIPE_SIGNIN_SECRET;
}
