"use client";
import { updateAppSettings } from "@/app/[locale]/admin/queries/app-saas-settings.action";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";

export default function SwitchCtaOnNavbar() {
  const [activeCtaOnNavbar, setActiveCtaOnNavbar] = useState<boolean>(true);
  const { appSettings } = useAppSettingsStore();
  const data = appSettings;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setActiveCtaOnNavbar(data.activeCtaOnNavbar ?? false);
  }, [data]);

  const handleChangeCtaOnNavbar = async (e: any) => {
    setLoading(true);
    if (data.id) {
      const dataToSet = await updateAppSettings(appSettings.id, {
        activeCtaOnNavbar: e,
      }, chosenSecret());
      if (dataToSet) {
        setActiveCtaOnNavbar(e);
        useAppSettingsStore
          .getState()
          .setAppSettings({ ...appSettings, activeCtaOnNavbar: e });
        setLoading(false);
        return toaster({
          description: `CTA on navbar ${e ? "enabled" : "disabled"}`,
          type: "success",
        });
      } else {
        setLoading(false);
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
        loading={loading}
        id="switch-active-cta-on-navbar">
        Display the <strong>navbar&apos;s CTA</strong>
      </SwitchWrapper>
    </>
  );
}
