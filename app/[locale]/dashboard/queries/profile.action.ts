"use server";
import { updateUser } from "@/src/helpers/db/users.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import {
    HandleResponseProps,
    handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { ActionError, authAction } from "@/src/lib/safe-actions";
import { iUsers } from "@/src/types/db/iUsers";
import { compare, hash } from "bcrypt";
import { z } from "zod";

export const createPassword = authAction(
  z.object({
    password: z.string(),
    email: z.string().email(),
  }),
  async ({ password, email }): Promise<HandleResponseProps<iUsers>> => {
    const hashedPassword = await hash(password, 10);
    try {
      const upUserPassword = await updateUser({
        data: {
          email,
          password: hashedPassword,
        },
        secret: chosenSecret(),
      });
      if (handleError(upUserPassword).error)
        throw new ActionError(handleError(upUserPassword).message);
      return handleRes<iUsers>({
        success: upUserPassword.data?.success,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUsers>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updatePassword = authAction(
  z.object({
    oldPassword: z.string(),
    password: z.string(),
    oldPasswordCrypted: z.string(),
    email: z.string().email(),
  }),
  async ({
    oldPassword,
    password,
    email,
    oldPasswordCrypted,
  }): Promise<HandleResponseProps<iUsers>> => {
    const hashedPassword = await hash(password, 10);
    const comparePassword = await compare(oldPassword, oldPasswordCrypted);
    if (!comparePassword) throw new ActionError("Old password is incorrect");
    try {
      const upUserPassword = await updateUser({
        data: {
          email,
          password: hashedPassword,
        },
        secret: chosenSecret(),
      });
      if (handleError(upUserPassword).error)
        throw new ActionError(handleError(upUserPassword).message);
      return handleRes<iUsers>({
        success: upUserPassword.data?.success,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iUsers>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
