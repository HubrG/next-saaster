import { handleResponse } from "@/src/lib/handleResponse";
import { prisma } from "@/src/lib/prisma";
import { iUsers } from "@/src/types/iUsers";

type GetUserProps = {
  email: string;
};
/**
 *  Get user by email
 *
 * @remarks
 * This method is part of the {@link utils/users | users utilities}.
 *
 * @param email - The email of the user
 * @returns The user object
 */
export const getUser = async ({
  email,
}: GetUserProps): Promise<{
  success?: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        transactions: true,
        subscriptions: true,
        contacts: true,
        UserFeatures: {
          include: {
            feature: true,
          },
        },
      },
    });
    if (!user) throw new Error("No user found");
    return handleResponse<iUsers>(user);
  } catch (error) {
    console.error(error);
    return handleResponse<null>(null, error);
  }
};
