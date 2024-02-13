"use client";
import { Link } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { appSettings } from "@prisma/client";
import { Bot } from "lucide-react";
type Props = {
  settings: appSettings;
};
export default function Logo({ settings }: Props) {
  const { appSettings } = useAppSettingsStore();
  let name = settings.name;
  if (appSettings.name) name = appSettings.name;

  return (
    <Link href="/" className="logo md:mr-2 mr-0">
      <span className="sm:text-xs flex flex-row">
        <span className="mr-1 max-sm:hidden">
          <Bot className="icon" />
        </span>
        <span>{name}</span>
        {/* <sup className="mt-1 ml-2 text-sm text-secondary/60">ai</sup> */}
      </span>
    </Link>
  );
}
