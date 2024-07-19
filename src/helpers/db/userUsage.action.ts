"use server";

import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, authAction } from "@/src/lib/safe-actions";
import { iUserUsage } from "@/src/types/db/iUserUsage";
import { z } from "zod";
import { verifySecretRequest } from "../functions/verifySecretRequest";

export const addUserUsage = authAction(
  z.object({
    userId: z.string(),
    featureId: z.string(),
    quantityForFeature: z.number().optional(),
    ConsumeCreditAllouedByMonth: z.number().optional(),
    ConsumeCredit: z.number().optional(),
    secret: z.string().optional(),
  }),
  async ({ userId, secret }): Promise<HandleResponseProps<iUserUsage>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const userUsage = await prisma.userUsage.create({
        data: {
          userId,
        },
        include,
      });
      return handleRes<iUserUsage>({
        success: {
          ...userUsage,
          planToFeature: userUsage.planToFeature ?? undefined,
        },
        statusCode: 200,
      });
    } catch (error) {
      return handleRes<iUserUsage>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  user: true,
  feature: true,
  planToFeature: true,
};
