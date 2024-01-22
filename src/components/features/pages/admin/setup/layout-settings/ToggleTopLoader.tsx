"use client";
import { useEffect, useState } from "react";
import { changeActiveTopLoader } from "../actions.server";
import { Toastify } from "@/src/components/layout/toastify/Toastify";
import { useRouter } from "next/navigation";
import { ToggleWrapper } from "./ui/ToggleWrapper";
import { toggleProps } from "@/src/types/admin/toggleProps";
import { Loader } from "lucide-react";

export default function ToggleTopLoader({ data }: toggleProps) {
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
      Afficher le <strong>top loader lors du chargement</strong> d&apos;une page
    </ToggleWrapper>
  );
}
