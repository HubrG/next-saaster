"use server";
import {
  HandleResponseProps,
  handleRes,
} from "@/src/lib/error-handling/handleResponse";
import { prisma } from "@/src/lib/prisma";
import {
  ActionError,
  action,
  adminAction,
  authAction,
  superAdminAction,
} from "@/src/lib/safe-actions";
import {
  iNotification,
  iNotificationSettings,
  iNotificationType,
} from "@/src/types/db/iNotifications";
import { z } from "zod";
import { sendEmail } from "../emails/sendEmail";
import { verifySecretRequest } from "../functions/verifySecretRequest";

/**
 *  Get blog post by ID
 *
 * @param id - The ID of the blog post
 * @returns The blog post object
 */
export const addNotificationType = adminAction(
  z.object({
    name: z.string(),
    description: z.string().optional(),
    secret: z.string(),
  }),
  async ({
    name,
    description,
    secret,
  }): Promise<HandleResponseProps<iNotificationType>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const notification = await prisma.notificationType.findUnique({
        where: { name: name },
        include,
      });
      //   if exists, return error
      if (notification) {
        throw new ActionError("Notification type already exists");
      }
      //   create notification type
      const notificationType = await prisma.notificationType.create({
        data: {
          name,
          description,
        },
        include,
      });
      if (!notificationType) {
        throw new ActionError("Error creating notification type");
      }
      return handleRes<iNotificationType>({
        success: notificationType as unknown as iNotificationType,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotificationType>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateNotificationType = adminAction(
  z.object({
    id: z.string().cuid(),
    name: z.string(),
    description: z.string().optional(),
    secret: z.string(),
  }),
  async ({
    id,
    name,
    description,
    secret,
  }): Promise<HandleResponseProps<iNotificationType>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const notification = await prisma.notificationType.findUnique({
        where: { id: id },
        include,
      });
      //   if exists, return error
      if (!notification) {
        throw new ActionError("Notification type does not exist");
      }
      //   update notification type
      const notificationType = await prisma.notificationType.update({
        where: { id: id },
        data: {
          name,
          description,
        },
        include,
      });
      if (!notificationType) {
        throw new ActionError("Error updating notification type");
      }
      return handleRes<iNotificationType>({
        success: notificationType as unknown as iNotificationType,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotificationType>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const deleteNotificationType = adminAction(
  z.object({
    id: z.string().cuid(),
    secret: z.string(),
  }),
  async ({ id, secret }): Promise<HandleResponseProps<iNotificationType>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const notification = await prisma.notificationType.findUnique({
        where: { id: id },
        include,
      });
      //   if exists, return error
      if (!notification) {
        throw new ActionError("Notification type does not exist");
      }
      //   delete notification type
      const notificationType = await prisma.notificationType.delete({
        where: { id: id },
        include,
      });
      if (!notificationType) {
        throw new ActionError("Error deleting notification type");
      }
      return handleRes<iNotificationType>({
        success: notificationType as unknown as iNotificationType,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotificationType>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const getNotificationTypes = action(
  z.object({
    secret: z.string(),
  }),
  async ({ secret }): Promise<HandleResponseProps<iNotificationType[]>> => {
    // 🔐 Security
    if (!secret || (secret && !verifySecretRequest(secret)))
      throw new ActionError("Unauthorized");
    // 🔓 Unlocked
    try {
      const notificationTypes = await prisma.notificationType.findMany({
        include,
      });
      if (!notificationTypes) {
        throw new ActionError("Error fetching notification types");
      }
      return handleRes<iNotificationType[]>({
        success: notificationTypes as unknown as iNotificationType[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotificationType[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const addNotification = action(
  z.object({
    userId: z.string().cuid(),
    content: z.string(),
    title: z.string(),
    link: z.string().optional(),
    type: z.string(),
    read: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  async ({
    userId,
    content,
    title,
    link,
    type,
    read,
    createdAt,
    updatedAt,
  }): Promise<HandleResponseProps<iNotification>> => {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          content,
          title,
          link,
          typeId: type,
          read,
          createdAt,
          updatedAt,
        },
      });
      console.log(notification);
      if (!notification) {
        throw new ActionError("Error creating notification");
      }
      return handleRes<iNotification>({
        success: notification as unknown as iNotification,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotification>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const addNotificationForAllUsers = superAdminAction(
  z.object({
    content: z.string(),
    title: z.string(),
    link: z.string().optional(),
    type: z.string(),
    read: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  async ({
    content,
    title,
    link,
    type,
    read,
    createdAt,
    updatedAt,
  }): Promise<HandleResponseProps<iNotification[]>> => {
    try {
      const users = await prisma.user.findMany();
      const notifications = await Promise.all(
        users.map(async (user) => {
          const notification = await prisma.notification.create({
            data: {
              userId: user.id,
              content,
              title,
              link,
              typeId: type,
              read,
              createdAt,
              updatedAt,
            },
          });
          return notification;
        })
      );
      if (!notifications) {
        throw new ActionError("Error creating notifications");
      }
      return handleRes<iNotification[]>({
        success: notifications as unknown as iNotification[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotification[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
export const getNotificationsSettings = authAction(
  z.object({
    userId: z.string().cuid(),
    secret: z.string(),
  }),
  async ({
    userId,
    secret,
  }): Promise<HandleResponseProps<iNotificationSettings[]>> => {
    // 🔐 Security
    if (!verifySecretRequest(secret)) throw new ActionError("Unauthorized");
    // 🔓
    try {
      const notificationSettings = await prisma.notificationSettings.findMany({
        where: { userId: userId },
        include: includeNotificationSettings,
      });
      if (!notificationSettings) {
        throw new ActionError("Error fetching notification settings");
      }
      return handleRes<iNotificationSettings[]>({
        success: notificationSettings as unknown as iNotificationSettings[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotificationSettings[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);
export const addNotificationSettings = authAction(
  z.object({
    data: z.object({
      userId: z.string().cuid(),
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
      typeId: z.string().cuid(),
    }),
    notificationTypes: z.array(z.string()),
  }),
  async ({ data }): Promise<HandleResponseProps<iNotificationSettings>> => {
    try {
      const notificationSettings = await prisma.notificationSettings.create({
        data: data,
      });
      if (!notificationSettings) {
        throw new ActionError("Error creating notification settings");
      }
      return handleRes<iNotificationSettings>({
        success: notificationSettings as unknown as iNotificationSettings,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotificationSettings>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const updateNotificationSettings = authAction(
  z.object({
    id: z.string().cuid().optional(),
    userId: z.string().cuid(),
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    typeId: z.string().cuid(),
    secret: z.string(),
  }),
  async ({
    id,
    userId,
    email,
    sms,
    push,
    secret,
    typeId,
  }): Promise<HandleResponseProps<iNotificationSettings>> => {
    try {
      if (secret && !verifySecretRequest(secret))
        throw new ActionError("Unauthorized");
      // We check if the user already has notification settings for this type
      const notificationSettings = await prisma.notificationSettings.findFirst({
        where: { userId: userId, typeId: typeId },
      });
      // If the user does not have notification settings for this type, create them
      if (!notificationSettings) {
        const notificationSettingsCreate =
          await prisma.notificationSettings.create({
            data: {
              userId,
              email,
              sms,
              push,
              typeId,
            },
          });
        if (!notificationSettingsCreate) {
          throw new ActionError("Error creating notification settings");
        }
        return handleRes<iNotificationSettings>({
          success: notificationSettings as unknown as iNotificationSettings,
          statusCode: 200,
        });
      } else {
        // If the user already has notification settings for this type, we update them
        const notificationSettingsUpdate =
          await prisma.notificationSettings.update({
            where: { typeId: typeId, userId: userId },
            data: {
              email,
              sms,
              push,
              typeId,
            },
          });
        if (!notificationSettingsUpdate) {
          throw new ActionError("Error updating notification settings");
        }
        return handleRes<iNotificationSettings>({
          success: notificationSettings as unknown as iNotificationSettings,
          statusCode: 200,
        });
      }
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotificationSettings>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const sendNotification = action(
  z.object({
    userId: z.string().cuid(),
    content: z.string(),
    title: z.string(),
    link: z.string().optional(),
    type: z.string(),
    read: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    secret: z.string(),
  }), // Ajout de la parenthèse fermante ici
  async ({
    userId,
    content,
    title,
    link,
    type,
    read,
    createdAt,
    updatedAt,
    secret,
  }): Promise<HandleResponseProps<iNotification>> => {
    // 🔐 Security
    if (!verifySecretRequest(secret)) throw new ActionError("Unauthorized");
    // 🔓
    try {
      // If the user has disabled notifications for this type, we mark the notification as read
      const notificationSettingsVerify = await prisma.notificationSettings.findFirst({
        where: { userId: userId, typeId: type },
      });
      if (!notificationSettingsVerify?.push) {
        read = true;
      }
      const notification = await prisma.notification.create({
        data: {
          userId,
          content,
          title,
          link,
          typeId: type,
          read,
          createdAt,
          updatedAt,
        },
      });
     
      if (!notification) {
        throw new ActionError("Error creating notification");
      }
      // We send email notifications if the user has enabled email notifications
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new ActionError("Error fetching user");
      }
      const notificationSettings = await prisma.notificationSettings.findFirst({
        where: { userId: userId, typeId: type },
      });
      if (!notificationSettings) {
        throw new ActionError("Error fetching notification settings");
      }
      if (notificationSettings.email) {
        sendEmail({
          to: user.email ?? "",
          subject: title,
          type: "notification",
          tag_value: "notification",
          tag_name: "category",
          vars: {
            notification: {
              content: content,
              title: title,
              actionUrl: link ?? process.env.NEXT_PUBLIC_URI,
              actionText: content,
            },
          },
        }).catch((err) => console.error("Failed to send email:", err));
      }
      return handleRes<iNotification>({
        success: notification as unknown as iNotification,
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotification>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

export const sendNotificationForAllUsers = superAdminAction(
  z.object({
    content: z.string(),
    title: z.string(),
    link: z.string().optional(),
    type: z.string(),
    read: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    secret: z.string(),
  }),
  async ({
    content,
    title,
    link,
    type,
    read,
    createdAt,
    updatedAt,
    secret,
  }): Promise<HandleResponseProps<iNotification[]>> => {
    try {
      const users = await prisma.user.findMany();

      const notifications = await Promise.all(
        users.map(async (user) => {
          // Only if users has accepted this type of notification
          const notificationSettings =
            await prisma.notificationSettings.findFirst({
              where: { userId: user.id, typeId: type },
            });
          const notification = await prisma.notification.create({
            data: {
              userId: user.id,
              content,
              title,
              link,
              typeId: type,
              read,
              createdAt,
              updatedAt,
            },
          });
          return notification;
        })
      );
      if (!notifications) {
        throw new ActionError("Error creating notifications");
      }
      return handleRes<iNotification[]>({
        success: notifications as unknown as iNotification[],
        statusCode: 200,
      });
    } catch (ActionError) {
      console.error(ActionError);
      return handleRes<iNotification[]>({
        error: ActionError,
        statusCode: 500,
      });
    }
  }
);

const include = {
  Notifications: true,
  NotificationSettings: true,
};

const includeNotificationSettings = {
  NotificationType: true,
};
