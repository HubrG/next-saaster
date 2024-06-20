"use client";
import { SaasSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getSaasSettings } from "../helpers/db/saasSettings.action";

const fetchSaasSettings = async () => {
  try {
    const response = (await getSaasSettings()) as SaasSettings;
    return response;
  } catch (error) {
    return null;
  }
};

export const useSaasSettingsQuery = () => {
  return useQuery({
    queryKey: ["saasSettings"],
    staleTime: 1000 * 60 * 60,
    queryFn: () => fetchSaasSettings(),
  });
};
