"use server";
import { prisma } from "@/src/lib/prisma";

export const isUserExists = async (email: string): Promise<boolean> => {
  const getUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return !!getUser;
}
