"use server";
import { updateUser } from "@/src/helpers/db/users.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { ActionError, action, authAction } from "@/src/lib/safe-actions";
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

export const resetPassword = action(
  z.object({
    password: z.string(),
    email: z.string().email(),
    token: z.string(),
  }),
  async ({ password, token, email }): Promise<HandleResponseProps<iUsers>> => {
    const hashedPassword = await hash(password, 10);
      const isEmailExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!isEmailExist) throw new ActionError("Email not found");
      const isTokenExist = await prisma.verificationToken.findFirst({
        where: {
          token: token,
        },
      });
      if (!isTokenExist) throw new ActionError("Token not found");
      if (isTokenExist.expires < new Date())
        throw new ActionError("Token expired");
      if (isTokenExist.identifier !== email)
        throw new ActionError("Token is not valid");
        try {
          const upUserPassword = await prisma.user.update({
            where: {
              email,
            },
            data: {
              password: hashedPassword,
            },
          });
          if (!upUserPassword)
            throw new ActionError("Problem while updating user password");
          // We delete the token
          await prisma.verificationToken.delete({
            where: {
              token,
            },
          });
          return handleRes<iUsers>({
            success: upUserPassword,
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
