"use client";

import { DropdownMenuItem } from "@/src/components/ui/dropdown-menu";
import { Loader } from "@/src/components/ui/loader";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export const DropdownMenuItemLogout = () => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Components");
  return (
    <DropdownMenuItem
      className=" text-left cursor-pointer  font-medium"
      onClick={() => {
        startTransition(() => signOut());
      }}>
      {isPending ? (
        <Loader className="mr-2 h-4 w-4" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      {/* Logout */}
      {t("Features.Layout.Header.Navbar.Auth.LogoutButton.title")}
    </DropdownMenuItem>
  );
};
