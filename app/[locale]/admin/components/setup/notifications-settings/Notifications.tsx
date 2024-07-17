"use client";
import { ManageNotificationType } from "./subcomponents/ManageNotificationType";
import { SendNotificationToAllUsers } from "./subcomponents/SendNotificationToAllUsers";
import SwitchNotifications from "./switches/SwitchActiveNotification";

export const Notifications = () => {
  return (
    <>
      <SwitchNotifications />
      <div className="grid grid-cols-2 gap-5 w-full items-baseline">
        <div>
          <ManageNotificationType />
        <p className="text-xs opacity-80 pt-1">
          Add notification types to allow your users to enable or disable from
          their dashboard certain notifications based on their type
        </p>
        </div>
        <div><SendNotificationToAllUsers /></div>
      </div>
    </>
  );
};
