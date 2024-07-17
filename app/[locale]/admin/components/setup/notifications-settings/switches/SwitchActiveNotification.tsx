"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { BellDot } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchNotifications() {
  const [activeNotifications, setActiveNotifications] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveNotifications(data.activeNotification ?? false);
  }, [data]);

  const handleChangeNotifications = async (e: any) => {
    setLoading(true);
    setAppSettings({ ...appSettings, activeNotification: e });
    if (data.id) {
      const dataToSet = await updateAppSettings(appSettings.id, {
        activeNotification: e,
      }, chosenSecret());
      if (dataToSet) {
        setActiveNotifications(e);
        setAppSettings({ ...appSettings, activeNotification: e });
        setLoading(false);
        return toaster({
          description: `Notifications system ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setLoading(false);
        return toaster({
          type: "error",
          description: "Notifications settings not changed, please try again",
        });
      }
    }
  };

  return (
    <>
      <SwitchWrapper
        handleChange={handleChangeNotifications}
        checked={activeNotifications}
        loading={loading}
        icon={<BellDot className="icon" />}
        id="switch-active-notification-system">
        Enable the <strong>notifications system</strong> for your users
      </SwitchWrapper>
    </>
  );
}
