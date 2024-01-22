"use client";
import { useEffect, useState } from "react";
import { changeActiveCtaOnNavbar } from "../actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { useRouter } from "next/navigation";
import { ToggleWrapper } from "./ui/ToggleWrapper";
import { toggleProps } from "@/src/types/admin/toggleProps";
import { Box } from "lucide-react";

export default function ToggleCtaOnNavbar({ data }: toggleProps) {
  const [activeCtaOnNavbar, setActiveCtaOnNavbar] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    setActiveCtaOnNavbar(data?.activeCtaOnNavbar ?? false);
  }, [data]);

  const handleChangeCtaOnNavbar = async (e: any) => {
    if (data?.id) {
      const dataToSet = await changeActiveCtaOnNavbar(data?.id, e);
      if (dataToSet === true) {
        setActiveCtaOnNavbar(e);
        return Toastify({
          type: "success",
          value: `Active CTA on navbar ${e ? "enabled" : "disabled"}`,
          callbackOnOpen: () => router.refresh(),
          position: "bottom-right",
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
    <ToggleWrapper
      handleChange={handleChangeCtaOnNavbar}
      checked={activeCtaOnNavbar}
      id="switch-active-cta-on-navbar">
      <Box  className="icon" />
      Afficher le <strong>CTA de la navbar</strong>
    </ToggleWrapper>
  );
}
