"use client";
import { Link } from "@/src/lib/intl/navigation";
import React from "react";
import { Button } from "../../../ui/button";
import { Box } from "lucide-react";
import { useTranslations } from "next-intl";

type TryUsButtonProps = {
  className?: string;
};
export default function TryUsButton({ className }: TryUsButtonProps) {
  const t = useTranslations("Components");
  return (
    <Link href="/pricing" className={className}>
      <Button
        id="try-us-for-free-button"
        className={`px-4 font-bold text-base`}
        variant="ghost"
        size={"lg"}>
        <Box className="icon" />
        {t("Features.Layout.Header.Navbar.TryUsButton.try")}
      </Button>
    </Link>
  );
}
