"use client";
import { Link } from "@/src/lib/intl/navigation";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { appSettings } from "@prisma/client";
import { SparklesIcon } from "lucide-react";
import Image from "next/image";
type Props = {
  settings: appSettings;
};
export default function Logo({ settings }: Props) {
  const { appSettings } = useAppSettingsStore();
  let name = settings.name;
  
  
  return (
    <Link href="/" className="logo">
      <span>
        <span className="icon">
          {appSettings.image ? (
            <Image
              priority
              className="rounded-full"
              src={
                appSettings.image?.replace("/upload/", "/upload/f_auto,w_40,h_40/") ?? ""
              }
              alt={name + " Logo" ?? "Logo"}
              width={40}
              height={40}
            />
          ) : (
            <SparklesIcon size={23} />
          )}
        </span>
        <span className="text ml-2">{appSettings.name ?? name}</span>
        {/* <sup className="mt-1 ml-2 text-sm text-secondary/60">ai</sup> */}
      </span>
    </Link>
  );
}
