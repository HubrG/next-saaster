import { prisma } from "@/src/lib/prisma";
import { getAuthSession } from "@/src/lib/next-auth/auth";
import { User } from '@prisma/client';

export const getUserLog = async () => {
  const session = await getAuthSession();
  if (!session?.user.id) {
    return;
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
  });
  return user;
};

export const getUsers = async (): Promise<User[] | null> => {
  try {
    const users = await prisma.user.findMany();
    const queryKey = ["users", users];
    return users;
  } catch (error) {
    console.error("Error retrieving users : ", error);
    return null;
  }
};

export const getUser = async (email?: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Error retrieving user : ", error);
    return null;
  }
};
