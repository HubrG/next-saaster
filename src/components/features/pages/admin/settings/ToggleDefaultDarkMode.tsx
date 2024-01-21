"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { useEffect, useState } from "react";
import { changeDefaultDarkMode } from "./actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { appSettings } from '@prisma/client';

type Props = {
  data: appSettings;
};

export default function ToggleDefaultDarkMode({data} : Props) {
  
  const [defaultDarkmode, setDefaultDarkmode] = useState<boolean>(true);

  useEffect(() => {
    setDefaultDarkmode(data?.defaultDarkMode ?? false);
  }, [data]);

  const handleChangeDefaultDarkmode = async (e: any) => {
    if (data?.id) {
      const dataToSet = await changeDefaultDarkMode(data?.id, e);
      if (dataToSet === true) {
        setDefaultDarkmode(e);
        return Toastify({
          type: "success",
          value: `Default darkmode ${e ? "enabled" : "disabled"}`,
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
    <div className="my-card">
      <Switch
        onCheckedChange={handleChangeDefaultDarkmode}
        id="switch-default-dark-mode"
        checked={defaultDarkmode}
      />
      <Label htmlFor="switch-default-dark-mode">
        Activer le Darkmode par défaut lors d&apos;une première visite
      </Label>
    </div>
  );
}
