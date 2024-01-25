"use client";
import { changeActiveDarkMode } from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Eclipse } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ToggleActiveDarkMode() {
  const [activeDarkmode, setActiveDarkmode] = useState<boolean>(true);
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const data = appSettings;
  const router = useRouter();

  useEffect(() => {
    setActiveDarkmode(data.activeDarkMode ?? false);
  }, [data]);

  const handleChangeActiveDarkmode = async (e: any) => {
    if (data.id) {
      const dataToSet = await changeActiveDarkMode(data.id, e);
      if (dataToSet === true) {
        setActiveDarkmode(e);
        useAppSettingsStore
          .getState()
          .setAppSettings({ ...appSettings, activeDarkMode: e });
        return toaster({
          description: `Active darkmode ${e ? "enabled" : "disabled"}`,
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
          description: "Active darkmode not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeActiveDarkmode}
      checked={activeDarkmode}
      id="switch-active-dark-mode">
      <Eclipse className="icon" />
      Authorize user to <strong>switch the theme to dark or light</strong> mode
    </ToggleWrapper>
  );
}
