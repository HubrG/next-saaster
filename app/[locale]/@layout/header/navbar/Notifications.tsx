"use client";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Button } from "@/src/components/ui/@shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/@shadcn/dropdown-menu";
import { Skeleton } from "@/src/components/ui/@shadcn/skeleton";
import { useNotifications } from "@/src/hooks/utils/useNotification";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSessionQuery } from "@/src/queries/useSessionQuery";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { iNotification } from "@/src/types/db/iNotifications";
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
  const router = useRouter();

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
  const prevNotificationsRef = useRef<iNotification[]>([]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        markAsRead(session?.user.userId ?? "");
      }, 5000);
      setNotificationCount(0);
    }
  }, [open, session?.user.userId]);

  useEffect(() => {
    if (notifications) {
      setNotificationCount(
        notifications.filter(
          (notification: iNotification) => !notification.read
        ).length
      );

      if (prevNotificationsRef.current.length > 0) {
        const newNotifications = notifications.filter(
          (notification: iNotification) =>
            !prevNotificationsRef.current.some(
              (prevNotification) => prevNotification.id === notification.id
            )
        );

        if (newNotifications.length > 0) {
          newNotifications.forEach((notification: iNotification) => {
            toaster({
              description: `${notification.title} / ${notification.content}`,
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
        className="user-profile-dd !min-w-96 !max-w-96 overflow-y-auto ">
        {notifications?.length > 0 ? (
          notifications.map((notification: iNotification, index: number) => (
            <Fragment key={notification.id}>
              <DropdownMenuItem
                onClick={() => {
                  notification.link && router.push(notification.link as any);
                }}
                className={cn(
                  `p-2 rounded-default profile-link hover:cursor-pointer`,
                  { "!bg-theming-text-500/20": !notification.read }
                )}>
                <div className="flex flex-col w-full">
                  <div className="w-full items-center flex flex-row justify-between">
                    <h4 className="font-bold text-base !text-theming-text-600-second">
                      {notification.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {notification.type.name}
                    </p>
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
