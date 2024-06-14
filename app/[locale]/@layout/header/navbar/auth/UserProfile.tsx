"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { Link } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserStore } from "@/src/stores/userStore";
import { UserRole } from "@prisma/client";
import { upperCase } from "lodash";
import { CreditCard, User, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { DropdownMenuItemLogout } from "./LogoutButton";

type UserProfileProps = {
  className?: string;
  isLoading?: boolean;
};
export const UserProfile = ({ className, isLoading }: UserProfileProps) => {
  const { userStore } = useUserStore();
  const [userProfile, setUserProfile] = useState<ReturnUserDependencyProps>();
  const { saasSettings } = useSaasSettingsStore();
  const t = useTranslations("Layout.Header.Navbar.UserProfile");

  // We get the userProfile
  useEffect(() => {
    setUserProfile(getUserInfos({ user: userStore }));
  }, [userStore]);

  if (!userStore.id || isLoading) {
    return (
      <div className="flex items-center space-x-3 h-11 pr-7 -mt-1 ml-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="py-1 !h-0.5 rounded-full w-14" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={`flex flex-row w-full`}>
        <Button
          variant="link"
          className={cn(
            {
              "flex flex-row": className
                ? className
                : "items-center gap-2 justify-center",
              "md:w-32 w-full !p-5": saasSettings.activeCreditSystem,
            },
            "hover:no-underline"
          )}>
          <div className="w-8  userNavbarDiv">
            <Avatar className="!no-underline">
              {userStore?.image && (
                <AvatarImage
                  src={userStore.image?.replace("/upload/", "/upload/f_auto/")}
                  className=""
                  alt={userStore.name ?? "User avatar"}
                />
              )}
              <AvatarFallback
                className="!no-underline"
                style={{ textDecoration: "transparent" }}>
                <span className="!no-underline">
                  {upperCase(
                    userStore?.name
                      ?.toString()
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </span>
              </AvatarFallback>
            </Avatar>
          </div>
          {saasSettings.activeCreditSystem &&
          userProfile?.activeSubscription?.creditAllouedByMonth &&
          userProfile?.activeSubscription?.creditAllouedByMonth > 0 &&
          userProfile?.activeSubscription ? (
            <>
              <div className="w-full userNavbarDiv">
                <div
                  className="relative w-full"
                  data-tooltip-id="remainingTooltip">
                  <div
                    className={`${
                      userProfile?.activeSubscription.creditPercentage <= 0
                        ? "progressTokenVoid"
                        : userProfile?.activeSubscription.creditPercentage < 10
                        ? "progressToken bg-red-500"
                        : "progressToken"
                    }`}
                    style={{
                      width: `${userProfile?.activeSubscription.creditPercentage}%`,
                    }}>
                    &nbsp;
                  </div>
                  <div className="progressTokenVoid"></div>
                </div>
              </div>
              <Tooltip
                id="remainingTooltip"
                opacity={1}
                place="bottom"
                className="tooltip flex flex-col">
                <span>
                  {saasSettings.creditName} :{" "}
                  {userProfile?.activeSubscription.creditPercentage}%
                </span>
                {userProfile?.activeSubscription.creditRemaining} &nbsp;/&nbsp;{" "}
                {userProfile?.activeSubscription.creditAllouedByMonth}
              </Tooltip>
              {className && <div className="ml-5">2%</div>}
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="user-profile-dd max-h-90">
        {saasSettings.activeRefillCredit &&
        userProfile?.activeSubscription?.creditAllouedByMonth &&
        (userProfile?.activeSubscription?.creditAllouedByMonth ?? 0) > 0 &&
        userProfile?.activeSubscription ? (
          <>
            <DropdownMenuItem className="w-full" asChild>
              <Link href="/refill" className="user-profile-buy-credit">
                <CreditCard className="icon" />
                {/* Buy credits */}
                {t("refill")} {saasSettings.creditName}
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuItem className="w-full px-2 mt-1" asChild>
          <Link
            href="/dashboard"
            className="nunderline profile-link text-left pr-10  cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {/* My account */}
            {t("my-account")}
          </Link>
        </DropdownMenuItem>
        {userStore?.role !== ("USER" as UserRole) && (
          <>
            <DropdownMenuItem className="w-full" asChild>
              <Link
                prefetch={false}
                href="/admin"
                className="nunderline profile-link  pr-10 text-left cursor-pointer">
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
