"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Newspaper } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchEnableNewsletter() {
  const [enableNewsletter, setEnableNewsletter] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setEnableNewsletter(data.enableNewsletter ?? false);
  }, [data]);

  const handleChangeEnableNewsletter = async (e: any) => {
    setLoading(true);
    if (data.id) {
      const dataToSet = await updateAppSettings(appSettings.id, {
        enableNewsletter: e,
      }, chosenSecret());
      if (dataToSet) {
        setEnableNewsletter(e);
        setAppSettings({ ...appSettings, enableNewsletter: e });
        setLoading(false);
        return toaster({
          title: "Success",
          description: `Newsletter display ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setLoading(false);
        return toaster({
          type: "error",
          description: "Newsletter display not changed, please try again",
        });
      }
    }
  };
  return (
    <SwitchWrapper
      handleChange={handleChangeEnableNewsletter}
      checked={enableNewsletter}
      loading={loading}
      icon={<Newspaper className="icon" />}
      id="switch-enable-NL">
      Display the <strong>newsletter</strong> form on the website
    </SwitchWrapper>
  );
}
