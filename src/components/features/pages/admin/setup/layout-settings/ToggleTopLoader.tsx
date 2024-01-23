"use client";
import { useEffect, useState } from "react";
import { changeActiveTopLoader } from "@/src/components/features/pages/admin/setup/actions.server";
import { Toastify } from "@/src/components/ui/toastify/Toastify";
import { useRouter } from "next/navigation";
import { ToggleWrapper } from "@/src/components/features/pages/admin/ui/ToggleWrapper";
import { toggleProps } from "@/src/types/admin/toggleProps";
import { Loader } from "lucide-react";

export default function ToggleTopLoader({ data }: toggleProps) {
  const [activeTopLoader, setActiveTopLoader] = useState(true);
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
