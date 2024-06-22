"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Eclipse } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchActiveDarkMode() {
  const [activeDarkmode, setActiveDarkmode] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveDarkmode(data.activeDarkMode ?? false);
  }, [data]);

  const handleChangeActiveDarkmode = async (e: any) => {
    setLoading(true);
    if (data.id) {
      const dataToSet = await updateAppSettings(appSettings.id, {
        activeDarkMode: e,
      }, chosenSecret());
      if (dataToSet) {
        setActiveDarkmode(e);
        setAppSettings({ ...appSettings, activeDarkMode: e });
        setLoading(false);
        return toaster({
          title: "Success",
          description: `Active darkmode ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setLoading(false);
        return toaster({
          type: "error",
          description: "Active darkmode not changed, please try again",
        });
      }
    }
  };
  return (
    <SwitchWrapper
      handleChange={handleChangeActiveDarkmode}
      checked={activeDarkmode}
      loading={loading}
      icon={<Eclipse className="icon" />}
      id="switch-active-dark-mode">
      Authorize user to <strong>switch the theme to dark or light</strong> mode
    </SwitchWrapper>
  );
}
