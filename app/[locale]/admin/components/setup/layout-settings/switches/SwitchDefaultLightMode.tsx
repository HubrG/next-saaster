"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchDefaultLightMode() {
  const [defaultDarkmode, setDefaultDarkmode] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;

  useEffect(() => {
    setDefaultDarkmode(data.defaultLightMode ?? false);
  }, [data]);

  const handleChangeDefaultLightmode = async (e: any) => {
    if (data.id) {
      const dataToSet = await updateAppSettings(
        appSettings.id,
        {
          defaultLightMode: e,
          defaultDarkMode: e ? false : data.defaultDarkMode, // Ne pas forcer le mode sombre
        },
        chosenSecret()
      );
      if (dataToSet) {
        setDefaultDarkmode(e);
        setAppSettings({
          ...appSettings,
          defaultLightMode: e,
          defaultDarkMode: e ? false : data.defaultDarkMode,
        });
        return toaster({
          description: `Default lightmode ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        return toaster({
          type: "error",
          description: "Default lightmode not changed, please try again",
        });
      }
    }
  };

  return (
    <SwitchWrapper
      handleChange={handleChangeDefaultLightmode}
      checked={defaultDarkmode}
      icon={<Sun className="icon" />}
      id="switch-default-light-mode">
      Activate <strong>light mode by default</strong> on a first visit.
    </SwitchWrapper>
  );
}
