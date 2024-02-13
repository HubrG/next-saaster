"use client";

import { DropdownMenuItem } from "@/src/components/ui/dropdown-menu";
import { SimpleLoader } from "@/src/components/ui/loader";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTransition } from "react";

export const DropdownMenuItemLogout = () => {
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
      Logout
    </DropdownMenuItem>
  );
};
