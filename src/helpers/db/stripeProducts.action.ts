"use server";
import { getErrorMessage } from "@/src/lib/error-handling/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { iPlan } from "@/src/types/db/iPlans";
import { iStripeProduct } from "@/src/types/db/iStripeProducts";
import { StripeProduct } from "@prisma/client";
import Stripe from "stripe";

export const getStripeProducts = async (): Promise<{
  success?: boolean;
  data?: StripeProduct[];
  error?: string;
}> => {
  try {
    const stripeProducts = await prisma.stripeProduct.findMany();
    if (!stripeProducts) throw new Error("No stripe products found");
    return { success: true, data: stripeProducts as StripeProduct[] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getStripeProduct = async (
  id: string
): Promise<{
  success?: boolean;
  data?: StripeProduct;
  error?: string;
}> => {
  try {
    const stripeProduct = await prisma.stripeProduct.findUnique({
      where: { id: id },
      include: {
        prices: true,
      },
    });
    if (!stripeProduct) throw new Error("No Stripe Product found");
    return { success: true, data: stripeProduct as iStripeProduct };
  } catch (error) {
    // console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const createStripeProduct = async (
  data: Partial<iStripeProduct>
): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const stripeProduct = await prisma.stripeProduct.create({
      data: {
        id: data.id ?? "",
        name: data.name ?? "",
        active: data.active ?? false,
        description: data.description,
        default_price: data.default_price,
        metadata: data.metadata ?? {},
        unit_label: data.unit_label ?? null,
        statement_descriptor: data.statement_descriptor ?? null,
        PlanId: data.PlanId,
      },
    });
    return { success: true, data: stripeProduct as iStripeProduct };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const updateStripeProduct = async (
  data: Partial<iStripeProduct>
): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const stripeProduct = await prisma.stripeProduct.update({
      where: { id: data.id },
      data: {
        name: data.name,
        active: data.active,
        description: data.description,
        default_price: data.default_price as string,
        metadata: data.metadata ?? {},
        unit_label: data.unit_label,
        statement_descriptor: data.statement_descriptor,
      },
      include: {
        prices: true,
        PlanRelation: true,
      },
    });
    return { success: true, data: stripeProduct as StripeProduct };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const deleteProduct = async (
  id: string
): Promise<{ success?: boolean; data?: any; error?: string }> => {
  try {
    const product = await prisma.stripeProduct.delete({
      where: { id: id },
    });
    return { success: true, data: product };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export type CreateOrUpdateProductType = {
  type: "create" | "update" | "update_from_admin";
  stripeProduct: iStripeProduct | Stripe.Product;
  id?: string;
};
export const createOrUpdateProductStripeToBdd = async ({
  type,
  stripeProduct,
  id,
}: CreateOrUpdateProductType): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const productData = {
      ...stripeProduct,
      id: stripeProduct.id,
      default_price: stripeProduct.default_price,
      metadata: stripeProduct.metadata ?? {},
      unit_label: stripeProduct.unit_label ?? null,
      statement_descriptor: stripeProduct.statement_descriptor ?? null,
      name: stripeProduct.name,
      active: stripeProduct.active,
      PlanId: id,
      description: stripeProduct.description,
    };
    // NOTE : Create
    if (type === "create") {
      const product = await createStripeProduct(productData as iStripeProduct);
      return { success: true, data: product };
    }
    // NOTE : Update
    else if (type === "update") {
      const product = (await updateStripeProduct(productData as iStripeProduct))
        .data as {
        id: string;
        name: string;
        active: boolean;
        description: string;
        default_price: string;
        metadata: any;
        unit_label: string;
        statement_descriptor: string;
        PlanId: string;
        PlanRelation: iPlan;
        error: string;
        success: boolean;
      };
      if (product.error) throw new Error(product.error);
      // const getDefaultPrice = (
      //   await getStripePrice(productData.default_price as string)
      // ).data as {
      //   unit_amount: number;
      //   unit_amount_decimal: string;
      //   type: string;
      //   recurring_interval: string;
      //   id: string;
      //   success: boolean;
      //   error?: string;
      // };

      // let oncePrice;
      // let monthlyPrice;
      // let yearlyPrice;
      // let upPlan;
      // console.log(product.PlanRelation);
      // if (
      //   getDefaultPrice.type === "recurring" &&
      //   product.PlanRelation.stripeMonthlyPriceId === null &&
      //   product.PlanRelation.stripeYearlyPriceId === null
      // ) {
      //   switch (getDefaultPrice.recurring_interval) {
      //     case "month":
      //       monthlyPrice = getDefaultPrice.unit_amount / 100;
      //       upPlan = await updatePlan({
      //         id: product.PlanId,
      //         monthlyPrice: monthlyPrice,
      //         stripeMonthlyPriceId: getDefaultPrice.id,
      //       });
      //       break;
      //     case "year":
      //       yearlyPrice = getDefaultPrice.unit_amount / 100;
      //       upPlan = await updatePlan({
      //         id: product.PlanId,
      //         yearlyPrice: yearlyPrice,
      //         stripeYearlyPriceId: getDefaultPrice.id,
      //       });
      //       break;
      //     default:
      //       break;
      //   }
      // } else {
      //   oncePrice = getDefaultPrice.unit_amount / 100;
      // }
      // if (upPlan?.error) throw new Error(upPlan.error);

      return { success: true, data: product };
    } else {
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};
