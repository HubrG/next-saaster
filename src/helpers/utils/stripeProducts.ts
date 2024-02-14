"use server";
import { getErrorMessage } from "@/src/lib/getErrorMessage";
import { prisma } from "@/src/lib/prisma";
import { StripeProduct } from "@prisma/client";

export const getStripeProducts = async (): Promise<{
  success?: boolean;
  data?: any;
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
