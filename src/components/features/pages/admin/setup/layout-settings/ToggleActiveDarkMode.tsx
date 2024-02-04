"use client";
import { updateAppSettings } from "@/src/components/features/pages/admin/queries/queries";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Eclipse } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToggleActiveDarkMode() {
  const [activeDarkmode, setActiveDarkmode] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;

  useEffect(() => {
    setActiveDarkmode(data.activeDarkMode ?? false);
  }, [data]);

  const handleChangeActiveDarkmode = async (e: any) => {
    if (data.id) {
      const dataToSet = await updateAppSettings(appSettings.id, {
        activeDarkMode: e,
      });
      if (dataToSet) {
        setActiveDarkmode(e);
        setAppSettings({ ...appSettings, activeDarkMode: e });
        return toaster({
          description: `Active darkmode ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        return toaster({
          type: "error",
          description: "Active darkmode not changed, please try again",
        });
      }
    }
  };
  return (
    <ToggleWrapper
      handleChange={handleChangeActiveDarkmode}
      checked={activeDarkmode}
      icon={<Eclipse className="icon" />}
      id="switch-active-dark-mode">
      Authorize user to <strong>switch the theme to dark or light</strong> mode
    </ToggleWrapper>
  );
}
