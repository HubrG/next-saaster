"use client";
import { changeActiveCtaOnNavbar } from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Box } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ToggleCtaOnNavbar() {
  const [activeCtaOnNavbar, setActiveCtaOnNavbar] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const router = useRouter();

  useEffect(() => {
    setActiveCtaOnNavbar(data.activeCtaOnNavbar ?? false);
  }, [data]);

  const handleChangeCtaOnNavbar = async (e: any) => {
    if (data.id) {
      const dataToSet = await changeActiveCtaOnNavbar(data.id, e);
      if (dataToSet === true) {
        setActiveCtaOnNavbar(e);
        useAppSettingsStore
          .getState()
          .setAppSettings({ ...appSettings, activeCtaOnNavbar: e });
        return toaster({
          description: `Active CTA on navbar ${e ? "enabled" : "disabled"}`,
          type: "success",
          // onAutoClose: () => {
          //   router.refresh();
          // },
          // onDismiss: () => {
          //   router.refresh();
          // },
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
      <ToggleWrapper
        handleChange={handleChangeCtaOnNavbar}
        checked={activeCtaOnNavbar}
        id="switch-active-cta-on-navbar">
        <Box className="icon" />
        Display the <strong>navbar&apos;s CTA</strong>
      </ToggleWrapper>
    </>
  );
}
