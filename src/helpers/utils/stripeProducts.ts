"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { StripeProduct } from "@prisma/client";
import Stripe from "stripe";

export const getStripeProducts = async (): Promise<{
  success?: boolean;
  data?: StripeProduct[];
  error?: string;
}> => {
  try {
    const stripeProducts = await prisma.stripeProduct.findMany();
    if (!stripeProducts) throw new Error("No app settings found");
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
    });
    if (!stripeProduct) throw new Error("No app settings found");
    return { success: true, data: stripeProduct as StripeProduct };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const createStripeProduct = async (
  data: Partial<StripeProduct>
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
        default_price: data.default_price as string,
        metadata: data.metadata ?? {},
        unit_label: data.unit_label ?? null,
        statement_descriptor: data.statement_descriptor ?? null,
        PlanId: data.PlanId,
      },
    });
    return { success: true, data: stripeProduct as StripeProduct };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateStripeProduct = async (
  data: Partial<StripeProduct>
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
    });
    return { success: true, data: stripeProduct as StripeProduct };
  } catch (error) {
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
  type: "create" | "update";
  stripeProduct: Stripe.Product;
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
    // Créer un nouvel objet avec les propriétés attendues par createStripeProduct
    const productData = {
      ...stripeProduct,
      id: stripeProduct.id,
      default_price: stripeProduct.default_price as Stripe.Price["id"],
      metadata: stripeProduct.metadata ?? {},
      unit_label: stripeProduct.unit_label ?? null,
      statement_descriptor: stripeProduct.statement_descriptor ?? null,
      name: stripeProduct.name,
      active: stripeProduct.active,
      PlanId: id,
      description: stripeProduct.description,
    };
    if (type === "create") {
      const product = await createStripeProduct(productData);
      return { success: true, data: product };
    } else if (type === "update") {
      const product = await updateStripeProduct(productData);
      return { success: true, data: product };
    } else {
      return { error: "An unknown error occurred" };
    }
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};
