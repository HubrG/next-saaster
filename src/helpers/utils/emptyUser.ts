"use server";
import { prisma } from "@/src/lib/prisma";

export const isEmptyUser = async () => {
  const users = await prisma.user.count();
  // If there are no users, return true
  if (users === 0) {
    return true;
  }
  return false;
};
