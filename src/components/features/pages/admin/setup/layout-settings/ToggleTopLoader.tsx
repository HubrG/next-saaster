"use client";
import { changeActiveTopLoader } from "@/src/components/features/pages/admin/actions.server";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { ToggleWrapper } from "@/src/components/ui/user-interface/ui/ToggleWrapper";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
