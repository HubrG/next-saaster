"use client";
import { Link } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { Button } from "../../../../../src/components/ui/button";

type TryUsButtonProps = {
  className?: string;
  value: string;
  icon?: React.ReactNode;
};
export default function TryUsButton({
  className,
  icon,
  value,
}: TryUsButtonProps) {
  const { appSettings } = useAppSettingsStore();
  if (appSettings.activeCtaOnNavbar === false) return null;
  return (
    <Link href="/pricing" className={className}>
      <Button
        id="try-us-for-free-button"
        className={`md:px-4 px-0 md:!text-base text-sm font-bold`}
        variant="ghost"
        size={"lg"}>
        {icon}
        {value}
      </Button>
    </Link>
  );
}
