import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iOneTimePayment } from "@/src/types/iOneTimePayments";

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

export const createOneTimePayment = async (
  data: Omit<iOneTimePayment, "user" | "price"  | "createdAt" | "updatedAt">
): Promise<{
  success?: boolean;
  data?: iOneTimePayment;
  error?: string;
}> => {
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
}

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