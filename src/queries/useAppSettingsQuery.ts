"use client";
import { appSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getAppSettings } from "../helpers/db/appSettings.action";

const fetchSAppSettings = async () => {
  try {
    const response = (await getAppSettings()) as appSettings;
    return response;
  } catch (error) {
    return null;
  }
};

export const useAppSettingsQuery = () => {
  return useQuery({
    queryKey: ["appSettings"],
    staleTime: 1000 * 60 * 60,
    queryFn: () => fetchSAppSettings(),
  });
};
