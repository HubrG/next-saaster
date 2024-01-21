"use client";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { useEffect, useState } from "react";
import { changeActiveCtaOnNavbar } from "./actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { appSettings } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  data: appSettings;
};

export default function ToggleCtaOnNavbar({ data }: Props) {
  const [activeCtaOnNavbar, setActiveCtaOnNavbar] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setActiveCtaOnNavbar(data?.activeCtaOnNavbar ?? false);
  }, [data]);

  const handleChangeActiveDarkmode = async (e: any) => {
    if (data?.id) {
      const dataToSet = await changeActiveCtaOnNavbar(data?.id, e);
      if (dataToSet === true) {
        setActiveCtaOnNavbar(e);
        return Toastify({
          type: "success",
          value: `Active CTA on navbar ${e ? "enabled" : "disabled"}`,
          callbackOnOpen: () => router.refresh(),
        });
      } else {
        return Toastify({
          type: "error",
          value: "CTA on navbar not changed, please try again",
        });
      }
    }
  };

  return (
    <div className="my-card">
      <Switch
        onCheckedChange={handleChangeActiveDarkmode}
        id="switch-active-cta-on-navbar"
        checked={activeCtaOnNavbar}
      />
      <Label htmlFor="switch-active-cta-on-navbar">
        Afficher le CTA de la navbar
      </Label>
    </div>
  );
}
