"use client";
import { updateAppSettings } from "@/src/components/pages/admin/queries/queries";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToggleDefaultDarkMode() {
  const [defaultDarkmode, setDefaultDarkmode] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;

  useEffect(() => {
    setDefaultDarkmode(data.defaultDarkMode ?? false);
  }, [data]);

  const handleChangeDefaultDarkmode = async (e: any) => {
    if (data.id) {
      const dataToSet = await updateAppSettings(appSettings.id, {
        defaultDarkMode: e,
      });
      if (dataToSet) {
        setDefaultDarkmode(e);
        setAppSettings({ ...appSettings, defaultDarkMode: e });
        return toaster({
          description: `Default darkmode ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        return toaster({
          type: "error",
          description: "Default darkmode not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeDefaultDarkmode}
      checked={defaultDarkmode}
      icon={<MoonStar className="icon" />}
      id="switch-default-dark-mode">
      Activate <strong>dark mode by default</strong> on a first visit instead
      user&apos;s system settings.
    </ToggleWrapper>
  );
}
