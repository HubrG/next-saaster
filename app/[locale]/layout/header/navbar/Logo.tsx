"use client";
import { Link } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { appSettings } from "@prisma/client";
import { SparklesIcon } from "lucide-react";
type Props = {
  settings: appSettings;
};
export default function Logo({ settings }: Props) {
  const { appSettings } = useAppSettingsStore();
  let name = settings.name;
  if (appSettings.name) name = appSettings.name;

  return (
    <Link href="/" className="logo">
      <span>
        <span className="icon">
          <SparklesIcon size={23} />
        </span>
        <span className="text">{name}</span>
        {/* <sup className="mt-1 ml-2 text-sm text-secondary/60">ai</sup> */}
      </span>
    </Link>
  );
}
