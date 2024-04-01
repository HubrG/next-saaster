"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { useRouter } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchTopLoader() {
  const [activeTopLoader, setActiveTopLoader] = useState(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const router = useRouter();

  useEffect(() => {
    setActiveTopLoader(data.activeTopLoader ?? false);
  }, [data]);

  const handleChangeTopLoader = async (e: any) => {
    const dataToSet = await updateAppSettings(appSettings.id, {
      activeTopLoader: e,
    });
    if (dataToSet) {
      setActiveTopLoader(e);
      setAppSettings({ ...appSettings, activeTopLoader: e });

      return toaster({
        description: `Top loader ${e ? "enabled" : "disabled"}`,
        type: "success",
        onDismiss: () => router.refresh(),
        onAutoClose: () => router.refresh(),
      });
    } else {
      return toaster({
        type: "error",
        description: "Top loader not changed, please try again",
      });
    }
  };

  return (
    <SwitchWrapper
      handleChange={handleChangeTopLoader}
      checked={activeTopLoader}
      icon={<Loader className="icon" />}
      id="switch-top-loader">
      Display the <strong>top loader during page loading</strong>
    </SwitchWrapper>
  );
}
