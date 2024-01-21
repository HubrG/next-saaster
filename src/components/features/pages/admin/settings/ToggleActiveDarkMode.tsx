"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { useEffect, useState } from "react";
import { changeActiveDarkMode } from "./actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { appSettings } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  data: appSettings;
};

export default function ToggleActiveDarkMode({ data }: Props) {
  const [activeDarkmode, setActiveDarkmode] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setActiveDarkmode(data?.activeDarkMode ?? false);
  }, [data]);

  const handleChangeActiveDarkmode = async (e: any) => {
    if (data?.id) {
      const dataToSet = await changeActiveDarkMode(data?.id, e);
      if (dataToSet === true) {
        setActiveDarkmode(e);
        return Toastify({
          type: "success",
          value: `Active darkmode ${e ? "enabled" : "disabled"}`,
          callbackOnOpen: () => router.refresh(),
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
    <div className="my-card">
      <Switch
        onCheckedChange={handleChangeActiveDarkmode}
        id="switch-active-dark-mode"
        checked={activeDarkmode}
      />
      <Label htmlFor="switch-active-dark-mode">
        Permettre à l&apos;utilisateur de changer le thème en{" "}
        <strong>dark</strong> ou <strong>ligth</strong> mode
      </Label>
    </div>
  );
}
