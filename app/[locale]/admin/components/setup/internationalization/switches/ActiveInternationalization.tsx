"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchActiveInternationalization() {
  const [activeInternationalization, setActiveInternationalization] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveInternationalization(data.activeInternationalization ?? false);
  }, [data]);

  const handleChangeActiveInternationalization = async (e: any) => {
    setLoading(true);
    if (data.id) {
      const dataToSet = await updateAppSettings(
        appSettings.id,
        {
          activeInternationalization: e,
        },
        chosenSecret()
      );
      if (dataToSet) {
        setActiveInternationalization(e);
        setAppSettings({ ...appSettings, activeInternationalization: e });
        setLoading(false);
        return toaster({
          title: "Internationalization",
          description: `Internationalization ${e ? "enabled" : "disabled"}`,
          icon: <Languages className="icon" />,
          type: "success",
        });
      } else {
        setLoading(false);
        return toaster({
          type: "error",
          description: "Failed to update Internationalization",
        });
      }
    }
  };
  return (
    <SwitchWrapper
      handleChange={handleChangeActiveInternationalization}
      checked={activeInternationalization}
      loading={loading}
      icon={<Languages className="icon" />}
      id="switch-active-internationalization">
      Active Internationalization
    </SwitchWrapper>
  );
}
