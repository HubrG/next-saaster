"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError } from "@/src/lib/safe-actions";
import { iFeature } from "@/src/types/iFeatures";
import { updateFeatureSchema } from "@/src/types/schemas/dbSchema";
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

export const getFeature = async ({
  id,
}: {
  id: string;
}): Promise<HandleResponseProps<iFeature>> => {
  try {
    const feature = await prisma.feature.findUnique({
      where: { id },
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
};

export const createFeature = async ({
  data,
}: z.infer<typeof updateFeatureSchema>): Promise<HandleResponseProps<iFeature>> => {
  try {
    const feature = await prisma.feature.create({
      data: {
        ...data,
        alias: data.alias === "" ? null : data.alias,
      },
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
};

export const updateFeature = async ({
  data,
}: z.infer<typeof updateFeatureSchema>): Promise<HandleResponseProps<iFeature>> => {
  try {
    const feature = await prisma.feature.update({
      where: { id: data.id },
      data: {
        ...data,
        alias: data.alias === "" ? null : data.alias,
      },
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
};

const include = {
  Plans: {
    include: {
      plan: true,
    },
  },
  category: true,
};
