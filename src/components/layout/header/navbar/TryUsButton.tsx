"use client";
import { Link } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Box } from "lucide-react";
import { Button } from "../../../ui/button";

type TryUsButtonProps = {
  className?: string;
};
export default function TryUsButton({ className }: TryUsButtonProps) {
  const { appSettings } = useAppSettingsStore();
  if (appSettings.activeCtaOnNavbar === false) return null;
  return (
    <Link href="/pricing" className={className}>
      <Button
        id="try-us-for-free-button"
        className={`md:px-4 px-0 md:!text-base text-sm font-bold`}
        variant="ghost"
        size={"lg"}>
        <Box className="icon" />
        Try us for free
      </Button>
    </Link>
  );
}
