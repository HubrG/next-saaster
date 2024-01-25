"use client";
import { changeDefaultDarkMode } from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export default function ToggleDefaultDarkMode() {
  const [defaultDarkmode, setDefaultDarkmode] = useState<boolean>(true);
  const { appSettings } = useAppSettingsStore();
  const data = appSettings;

  useEffect(() => {
    setDefaultDarkmode(data.defaultDarkMode ?? false);
  }, [data]);

  const handleChangeDefaultDarkmode = async (e: any) => {
    if (data.id) {
      const dataToSet = await changeDefaultDarkMode(data.id, e);
      if (dataToSet === true) {
        setDefaultDarkmode(e);
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
      id="switch-default-dark-mode">
      <MoonStar className="icon" />
      Activate <strong>dark mode by default</strong> on a first visit instead user&apos;s system settings.
    </ToggleWrapper>
  );
}
