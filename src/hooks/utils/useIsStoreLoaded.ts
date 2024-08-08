"use client";
import useSaasPlansStore from "../../stores/admin/saasPlansStore";
import { useSaasSettingsStore } from "../../stores/saasSettingsStore";

export const useIsStoreLoading = () => {
  const { isStoreLoading } = useSaasSettingsStore();
  const { isPlanStoreLoading } = useSaasPlansStore();
  const loading = isStoreLoading || isPlanStoreLoading;
  return loading;
};
