"use client";
import useSWR from "swr";
import { useNotificationSettingsStore } from "../stores/admin/notificationSettingsStore";
import { iNotification } from "../types/db/iNotifications";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useNotifications = (
  userId: string,
  email: string,
  active: boolean
) => {
  const { notificationSettingsStore } = useNotificationSettingsStore();
  // Check that userId, email, and active are valid before calling useSWR
  const shouldFetch = userId && email && active;

  const { data, error } = useSWR(
    shouldFetch ? `/api/notifications?userId=${userId}&email=${email}` : null,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  

  // We remove the notification if the user has disabled it
  if (data && notificationSettingsStore) {
    return {
      notifications: data.filter((notification: iNotification) =>
        notificationSettingsStore.find(
          (setting) => setting.typeId === notification.typeId && setting.push
        )
      ),
      isLoading: !error && !data,
      isError: error,
    };
  }

  return {
    notifications: data as iNotification[],
    isLoading: !error && !data,
    isError: error,
  };
};
