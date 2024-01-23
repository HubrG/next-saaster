"use client";
import { useEffect, useState } from "react";
import { changeActiveDarkMode } from "../actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { useRouter } from "next/navigation";
import { ToggleWrapper } from "./ui/ToggleWrapper";
import { toggleProps } from "@/src/types/admin/toggleProps";
import { Eclipse } from "lucide-react";

export default function ToggleActiveDarkMode({ data }: toggleProps) {
  const [activeDarkmode, setActiveDarkmode] = useState<boolean>(true);
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
      Permettre à l&apos;utilisateur de <strong>changer le thème en{" "}
      dark ou ligth</strong> mode
    </ToggleWrapper>
  );
}
