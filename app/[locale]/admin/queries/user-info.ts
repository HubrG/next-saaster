"use server"

import { isAdmin } from "@/src/helpers/functions/isUserRole";
import { prisma } from "@/src/lib/prisma";
import { Notification } from "@prisma/client";

export const sendNotification = async (data: Notification) => {
    if (!isAdmin()) {
        console.log("You are not allowed to send notifications");
        return false
    }
    const send = await prisma.notification.create({
        data: {
            title: data.title,
            content: data.content,
            userId: data.userId,
            type: data.type,
            read: false,
        },
    });
    if (!send) {
        console.log("Error while sending notification");
        return false;
    }
    return true;
}
    