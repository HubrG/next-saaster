"use client";
import { useEffect, useState } from "react";
import { Toastify } from "@/src/components/ui/toastify/Toastify";
import { ToggleWrapper } from "@/src/components/features/pages/admin/ui/ToggleWrapper";
import { toggleProps } from "@/src/types/admin/toggleProps";
import { MoonStar } from "lucide-react";
import { changeDefaultDarkMode } from "@/src/components/features/pages/admin/setup/actions.server";

export default function ToggleDefaultDarkMode({ data }: toggleProps) {
  const [defaultDarkmode, setDefaultDarkmode] = useState<boolean>(true);

  useEffect(() => {
    setDefaultDarkmode(data.defaultDarkMode ?? false);
  }, [data]);

  const handleChangeDefaultDarkmode = async (e: any) => {
    if (data.id) {
      const dataToSet = await changeDefaultDarkMode(data.id, e);
      if (dataToSet === true) {
        setDefaultDarkmode(e);
        return Toastify({
          type: "success",
          value: `Default darkmode ${e ? "enabled" : "disabled"}`,
          position: "bottom-right",
        });
      } else {
        return Toastify({
          type: "error",
          value: "Default darkmode not changed, please try again",
        });
      }
    }
  };

  return (
    <ToggleWrapper
      handleChange={handleChangeDefaultDarkmode}
      checked={defaultDarkmode}
      id="switch-default-dark-mode">
      <MoonStar  className="icon" />
      Activate <strong>dark mode by default</strong> on a first visit
    </ToggleWrapper>
  );
}
