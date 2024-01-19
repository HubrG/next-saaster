"use server";
import { prisma } from "@/src/lib/prisma";


export const getNumberOfUsers = async () => {
    const users = await prisma.user.count();
    return users;
}

