"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { useEffect, useState } from "react";
import { changeActiveTopLoader } from "./actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { appSettings } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  data: appSettings;
};
export default function ToggleTopLoader({ data }: Props) {
  const [activeTopLoader, setActiveTopLoader] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setActiveTopLoader(data?.activeTopLoader ?? false);
  }, [data]);

  const handleChangeTopLoader = async (e: any) => {
    if (data?.id) {
      const dataToSet = await changeActiveTopLoader(data?.id, e);
      if (dataToSet === true) {
        setActiveTopLoader(e);
        return Toastify({
          type: "success",
          value: `Top loader ${e ? "enabled" : "disabled"}`,
          callbackOnOpen: () => router.refresh(),
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
    <div className="my-card">
      <Switch
        onCheckedChange={handleChangeTopLoader}
        id="switch-top-loader"
        checked={activeTopLoader}
      />
      <Label htmlFor="switch-top-loader">Activer le Top loader</Label>
    </div>
  );
}
