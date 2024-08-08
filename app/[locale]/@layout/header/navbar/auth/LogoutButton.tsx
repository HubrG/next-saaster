"use client";

import { SimpleLoader } from "@/src/components/ui/@blitzinit/loader";
import { DropdownMenuItem } from "@/src/components/ui/@shadcn/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export const DropdownMenuItemLogout = () => {
  const t = useTranslations("Layout.Header.Navbar.UserProfile");
  const [isPending, startTransition] = useTransition();
  return (
    <DropdownMenuItem
      className=" text-left profile-link  cursor-pointer  font-medium"
      onClick={() => {
        startTransition(() => signOut());
      }}>
      {isPending ? (
        <SimpleLoader className="mr-2 h-4 w-4" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      {/* Logout */}
      {t('logout')}
    </DropdownMenuItem>
  );
};
