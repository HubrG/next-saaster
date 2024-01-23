"use client";
import { useEffect, useState } from "react";
import { changeActiveDarkMode } from "@/src/components/features/pages/admin/actions.server";
import { Toastify } from "@/src/components/ui/toastify/Toastify";
import { useRouter } from "next/navigation";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { Eclipse } from "lucide-react";
import { useAppSettingsStore } from "@/src/stores/settingsStore";

export default function ToggleActiveDarkMode() {
  const [activeDarkmode, setActiveDarkmode] = useState<boolean>(true);
  const { appSettings } = useAppSettingsStore();
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
        return Toastify({
          type: "success",
          value: `Active darkmode ${e ? "enabled" : "disabled"}`,
          callbackOnOpen: () => router.refresh(),
          position: "bottom-right",
        });
      } else {
        return Toastify({
          type: "error",
          value: "Active darkmode not changed, please try again",
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
      Enable the user to <strong>switch the theme to{" "}
      dark or light</strong> mode
    </ToggleWrapper>
  );
}
