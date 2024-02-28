import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iSubscriptionPayment } from "@/src/types/iSubscriptionPayments";

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
  data,
}: {
  data: Partial<Omit<iSubscriptionPayment, "createdAt" | "updatedAt" | "subscription">>;
}): Promise<{
  success?: boolean;
  data?: iSubscriptionPayment;
  error?: string;
}> => {
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


export const updateSubscriptionPayment = async({
  subId,
  data,
}: {
  subId: string;
  data: Partial<Omit<iSubscriptionPayment, "createdAt" | "updatedAt" | "subscription">>;
}): Promise<{
  success?: boolean;
  data?: iSubscriptionPayment;
  error?: string;
}> => {
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
}
const include = {
  subscription: {
    include: {
      user: true,
    },
  },
};
