"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchActiveAutoTranslate() {
  const [activeAutoTranslate, setActiveAutoTranslate] =
    useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveAutoTranslate(data.activeAutoTranslate ?? false);
  }, [data]);

  const handleChangeActiveAutoTranslate = async (e: any) => {
    setLoading(true);
    if (data.id) {
      const dataToSet = await updateAppSettings(
        appSettings.id,
        {
          activeAutoTranslate: e,
        },
        chosenSecret()
      );
      if (dataToSet) {
        setActiveAutoTranslate(e);
        setAppSettings({ ...appSettings, activeAutoTranslate: e });
        setLoading(false);
        return toaster({
          title: "AutoTranslate",
          description: `AutoTranslate ${e ? "enabled" : "disabled"}`,
          icon: <Languages className="icon" />,
          type: "success",
        });
      } else {
        setLoading(false);
        return toaster({
          type: "error",
          description: "Failed to update AutoTranslate",
        });
      }
    }
  };
  return (
    <SwitchWrapper
      handleChange={handleChangeActiveAutoTranslate}
      checked={activeAutoTranslate}
      loading={loading}
      icon={<Languages className="icon" />}
      id="switch-active-AutoTranslate">
      Enable auto translate with API (features, pricing, pages, etc.)
    </SwitchWrapper>
  );
}
