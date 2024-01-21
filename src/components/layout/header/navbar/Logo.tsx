import { Link } from "@/src/lib/intl/navigation";
import { Bot } from "lucide-react";
import { getAppSettings } from "@/app/[locale]/server.actions";

export default async function Logo() {
  const settings = await getAppSettings();
  if (!settings) {
    return "NextSaaster";
  }
  return (
    <Link href="/" className="logo mr-2">
      <span className="sm:text-xs flex flex-row">
        <span className="mr-1">
        <Bot className="icon" />
        </span>
        <span>{settings.name}</span>
        {/* <sup className="mt-1 ml-2 text-sm text-secondary/60">ai</sup> */}
      </span>
    </Link>
  );
}
