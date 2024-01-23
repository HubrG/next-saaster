"use client";
import { useEffect, useState } from "react";
import { changeActiveTopLoader } from "@/src/components/features/pages/admin/actions.server";
import { Toastify } from "@/src/components/ui/toastify/Toastify";
import { useRouter } from "next/navigation";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { Loader } from "lucide-react";
import { useAppSettingsStore } from "@/src/stores/settingsStore";

export default function ToggleTopLoader() {
  const [activeTopLoader, setActiveTopLoader] = useState(true);
  const { appSettings } = useAppSettingsStore();
  const data = appSettings;
  const router = useRouter();

  useEffect(() => {
    setActiveTopLoader(data.activeTopLoader ?? false);
  }, [data]);

  const handleChangeTopLoader = async (e: any) => {
    if (data.id) {
      const dataToSet = await changeActiveTopLoader(data.id, e);
      if (dataToSet === true) {
        setActiveTopLoader(e);
        return Toastify({
          type: "success",
          value: `Top loader ${e ? "enabled" : "disabled"}`,
          callbackOnOpen: () => router.refresh(),
          position: "bottom-right",
        });
      } else {
        return Toastify({
          type: "error",
          value: "Top loader not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeTopLoader}
      checked={activeTopLoader}
      id="switch-top-loader">
      <Loader className="icon" />
      Display the <strong>top loader during page loading</strong>
    </ToggleWrapper>
  );
}
