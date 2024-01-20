"use client";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Link } from "@/src/lib/intl/navigation";
import { DropdownMenuItemLogout } from "./LogoutButton";
import { Separator } from "@/src/components/ui/separator";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { CreditCard, User, Wrench } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useTranslations } from "next-intl";

type UserProfileProps = {
  className?: string;
};
export const UserProfile = ({ className }: UserProfileProps) => {
  const userInfo = useSession().data?.user;
  const user = useSession().data?.user;
  const t = useTranslations("Components");
  const tokenPercentage = 50;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={`flex flex-row w-full`}>
        <Button
          variant="ghost"
          className={`${
            className
              ? "flex flex-row " + className
              : "flex flex-row items-center gap-2 justify-center w-32 pr-5"
          }`}>
          <div className="w-10 h-10 p-0 userNavbarDiv">
            <div className="relative rounded-full w-full border-[2px] border-secondary border-opacity-50 dark:border-app-950 p-0">
              {user?.image && (
                <Image
                  src={user.image}
                  alt="Profil picture"
                  fill
                  className="object-cover rounded-full w-20 h-20"
                />
              )}
            </div>
          </div>
          <div className="w-full userNavbarDiv">
            <div className="relative w-full" data-tooltip-id="remainingTooltip">
              <div
                className={`${
                  tokenPercentage <= 0
                    ? "progressTokenVoid"
                    : tokenPercentage < 10
                    ? "progressToken bg-red-500"
                    : "progressToken"
                }`}
                style={{
                  width: `${tokenPercentage}%`,
                }}>
                &nbsp;
              </div>
              <div className="progressTokenVoid"></div>
            </div>
            <Tooltip
              id="remainingTooltip"
              opacity={1}
              classNameArrow="hidden"
              variant="dark"
              className="tooltip flex flex-col">
              <span className="font-bold">
                {/* Crédit remaining */}
                {t("Features.Layout.Header.Auth.UserProfile.tooltips.credits")}{" "}
                : x%
              </span>
              <small>50 &nbsp;/&nbsp; 100</small>
            </Tooltip>
          </div>
          {className && <div className="ml-5">2%</div>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        <DropdownMenuItem className="w-full" asChild>
          <Link
            href="/pricing"
            className="user-profile-buy-credit">
            <CreditCard className="icon" />
            {/* Buy credits */}
            {t("Features.Layout.Header.Auth.UserProfile.links.buy")}
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem className="w-full px-2 mt-1" asChild>
          <Link
            href="/profil/mon-compte"
            className="nunderline text-left pr-10  cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {/* My account */}
            {t("Features.Layout.Header.Auth.UserProfile.links.account")}
          </Link>
        </DropdownMenuItem>
        <Separator className="my-1 h-0.5" />
        {userInfo?.role === "ADMIN" && (
          <>
            <DropdownMenuItem className="w-full" asChild>
              <Link
                prefetch={false}
                href="/admin"
                className="nunderline pr-10 text-left cursor-pointer">
                <Wrench className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </DropdownMenuItem>
            <Separator className="my-1" />
          </>
        )}
        <DropdownMenuItemLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
