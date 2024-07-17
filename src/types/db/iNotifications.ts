// src/types/db/iNotificationType.ts
import { Notification, NotificationSettings, NotificationType, User } from "@prisma/client";

export interface iNotificationType extends NotificationType {
  Notifications: iNotification[];
  NotificationSettings: iNotificationSettings[];
}


export interface iNotification extends Notification {
  type: iNotificationType;
  user: User;
}


export interface iNotificationSettings extends NotificationSettings {
  NotificationType: iNotificationType;
  user: User;
}
