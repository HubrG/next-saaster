"use client";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useNotifications } from "@/src/hooks/useNotification";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Notification } from "@prisma/client";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { now } from "lodash";
import { BellIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Fragment, useEffect, useRef, useState } from "react";
import { mutate } from "swr";

const Notifications = ({ active }: { active: boolean }) => {
  if (!active) {
    return null;
  }

  const { appSettings } = useAppSettingsStore();
  const { data: session } = useSessionQuery();
  const { notifications, isLoading, isError } = useNotifications(
    session?.user.userId || "",
    session?.user.email || "",
    appSettings.activeNotification ?? false
  );

  const [open, setOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const format = useFormatter();
  const t = useTranslations("Header.Navbar.Notifications");
  const prevNotificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    if (open) {
      markAsRead(session?.user.userId ?? "");
      setNotificationCount(0);
    }
  }, [open, session?.user.userId]);

  useEffect(() => {
    if (notifications) {
      setNotificationCount(
        notifications.filter((notification: Notification) => !notification.read)
          .length
      );

      if (prevNotificationsRef.current.length > 0) {
        const newNotifications = notifications.filter(
          (notification: Notification) =>
            !prevNotificationsRef.current.some(
              (prevNotification) => prevNotification.id === notification.id
            )
        );

        if (newNotifications.length > 0) {
          newNotifications.forEach((notification: Notification) => {
            toaster({
              title: "New Notification",
              description: `${notification.title} \n\n ${notification.content}`,
              duration: 5000,
              type: "success",
              icon: <BellIcon />,
              position: "bottom-center",
            });
          });
        }
      }

      prevNotificationsRef.current = notifications;
    }
  }, [notifications]);

  const markAsRead = async (userId: string) => {
    if (userId) {
      await fetch("/api/notifications/mark-as-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email: session?.user.email }),
      });

      mutate(
        `/api/notifications?userId=${userId}&email=${session?.user.email}`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 h-11 pr-7 ml-4">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className={`flex flex-row`}>
        <Button className="relative" variant={open ? "default" : "ghost"}>
          <BellIcon />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none !text-theming-text-100 bg-theming-background-600 rounded-full">
              {notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="user-profile-dd !w-96 !max-w-96 overflow-y-auto ">
        {notifications?.length > 0 ? (
          notifications.map((notification: Notification, index: number) => (
            <Fragment key={notification.id}>
              <DropdownMenuItem
                className={`p-2 rounded-default profile-link hover:cursor-pointer`}>
                <div className="flex flex-col w-full">
                  <div className="w-full items-center flex flex-row justify-between">
                    <h4 className="font-bold text-base !text-theming-text-600-second">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-500">{notification.type}</p>
                  </div>
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-gray-400">
                    {format.relativeTime(notification.createdAt, now())}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                className={`${
                  index === notifications.length - 1 && "!hidden"
                } `}
              />
            </Fragment>
          ))
        ) : (
          <DropdownMenuItem className="p-2 w-full bg-theming-background-200">
            <h3 className="w-full text-sm text-center">
              {t("noNotifications")}
            </h3>
          </DropdownMenuItem>
        )}
        <DropdownMenuArrow className="dropdown-arrow" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
