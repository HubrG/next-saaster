"use server";
import { prisma } from "@/src/lib/prisma";


export const getNumberOfUsers = async () => {
    const users = await prisma.user.count();
    return users;
}

export const getColorTheme = async () => {
    const theme = await prisma.appSettings.findFirst();
    if (!theme) {
        return 'pink2';
    }
    return theme.theme;
}