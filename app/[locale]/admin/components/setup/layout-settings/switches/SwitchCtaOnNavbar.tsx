"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/user-interface/ui/SwitchWrapper";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchCtaOnNavbar() {
  const [activeCtaOnNavbar, setActiveCtaOnNavbar] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;

  useEffect(() => {
    setActiveCtaOnNavbar(data.activeCtaOnNavbar ?? false);
  }, [data]);

  const handleChangeCtaOnNavbar = async (e: any) => {
    if (data.id) {
      const dataToSet = await updateAppSettings(appSettings.id, {
        activeCtaOnNavbar: e,
      });
      if (dataToSet) {
        setActiveCtaOnNavbar(e);
        useAppSettingsStore
          .getState()
          .setAppSettings({ ...appSettings, activeCtaOnNavbar: e });
        return toaster({
          description: `Active CTA on navbar ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        return toaster({
          type: "error",
          description: "CTA on navbar not changed, please try again",
        });
      }
    }
  };

  return (
    <>
      <SwitchWrapper
        handleChange={handleChangeCtaOnNavbar}
        checked={activeCtaOnNavbar}
        icon={<Box className="icon" />}
        id="switch-active-cta-on-navbar">
        Display the <strong>navbar&apos;s CTA</strong>
      </SwitchWrapper>
    </>
  );
}
