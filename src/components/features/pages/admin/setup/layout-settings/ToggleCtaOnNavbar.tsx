"use client";
import { useEffect, useState } from "react";
import { changeActiveCtaOnNavbar } from "@/src/components/features/pages/admin/actions.server";
import { Toastify } from "@/src/components/ui/toastify/Toastify";
import { useRouter } from "next/navigation";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { Box } from "lucide-react";
import { useAppSettingsStore } from "@/src/stores/settingsStore";

export default function ToggleCtaOnNavbar() {
  const [activeCtaOnNavbar, setActiveCtaOnNavbar] = useState<boolean>(true);
  const { appSettings } = useAppSettingsStore();
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
        return Toastify({
          type: "success",
          value: `Active CTA on navbar ${e ? "enabled" : "disabled"}`,
          callbackOnOpen: () => router.refresh(),
          position: "bottom-right",
        });
      } else {
        return Toastify({
          type: "error",
          value: "CTA on navbar not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeCtaOnNavbar}
      checked={activeCtaOnNavbar}
      id="switch-active-cta-on-navbar">
      <Box className="icon" />
      Display the <strong>navbar&apos;s CTA</strong>
    </ToggleWrapper>
  );
}
