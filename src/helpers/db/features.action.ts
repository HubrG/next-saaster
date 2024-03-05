"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, adminAction } from "@/src/lib/safe-actions";
import { iFeature } from "@/src/types/iFeatures";
import { z } from "zod";

export const getFeatures = async (): Promise<
  HandleResponseProps<iFeature[]>
> => {
  try {
    const features = await prisma.feature.findMany({
      orderBy: {
        position: "asc",
      },
      include: include,
    });
    if (!features) throw new ActionError("No features found");
    return handleRes<iFeature[]>({
      success: features,
      statusCode: 200,
    });
  } catch (ActionError) {
    return handleRes<iFeature[]>({ error: ActionError, statusCode: 500 });
  }
};

export const updateFeature = adminAction(
  z.object({
    data: z.object({
      id: z.string().cuid(),
      position: z.number().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      categoryId: z.string().optional(),
      isAvailable: z.boolean().optional(),
    }),
  }),
  async ({ data }): Promise<HandleResponseProps<iFeature>> => {
    try {
      const feature = await prisma.feature.update({
        where: { id: data.id },
        data,
        include,
      });
      if (!feature) throw new ActionError("No feature found");
      return handleRes<iFeature>({
        success: feature,
        statusCode: 200,
      });
    } catch (ActionError) {
      return handleRes<iFeature>({ error: ActionError, statusCode: 500 });
    }
  }
);

const include = {
  Plans: {
    include: {
      plan: true,
    },
  },
  category: true,
};
