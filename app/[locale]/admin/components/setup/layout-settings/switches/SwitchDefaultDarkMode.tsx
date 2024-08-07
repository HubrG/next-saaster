"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@blitzinit/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { MoonStar } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchDefaultDarkMode() {
  const [defaultDarkmode, setDefaultDarkmode] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setDefaultDarkmode(data.defaultDarkMode ?? false);
  }, [data]);

  const handleChangeDefaultDarkmode = async (e: any) => {
    setLoading(true);
    if (data.id) {
      const dataToSet = await updateAppSettings(
        appSettings.id,
        {
          defaultDarkMode: e,
          defaultLightMode: e ? false : data.defaultLightMode, // Ne pas forcer le mode clair
        },
        chosenSecret()
      );
      if (dataToSet) {
        setDefaultDarkmode(e);
        setAppSettings({
          ...appSettings,
          defaultDarkMode: e,
          defaultLightMode: e ? false : data.defaultLightMode,
        });
        setLoading(false);
        return toaster({
          description: `Default darkmode ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setLoading(false);
        return toaster({
          type: "error",
          description: "Default darkmode not changed, please try again",
        });
      }
    }
  };

  return (
    <SwitchWrapper
      handleChange={handleChangeDefaultDarkmode}
      checked={defaultDarkmode}
      icon={<MoonStar className="icon" />}
      loading={loading}
      id="switch-default-dark-mode">
      Activate <strong>dark mode by default</strong> on a first visit.
    </SwitchWrapper>
  );
}
