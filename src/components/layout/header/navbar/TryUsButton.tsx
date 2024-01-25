"use client";
import { Link } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Box } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "../../../ui/button";

type TryUsButtonProps = {
  className?: string;
};
export default function TryUsButton({ className }: TryUsButtonProps) {
  const t = useTranslations("Components");
  const { appSettings } = useAppSettingsStore();
  if (appSettings.activeCtaOnNavbar === false) return null;
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
