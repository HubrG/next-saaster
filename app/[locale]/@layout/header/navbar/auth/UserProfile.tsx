"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/@shadcn/avatar";
import { Button } from "@/src/components/ui/@shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/@shadcn/dropdown-menu";
import { Skeleton } from "@/src/components/ui/@shadcn/skeleton";
import { ReturnUserDependencyProps } from "@/src/helpers/dependencies/user-info";
import { useSlice } from "@/src/hooks/utils/useSlice";
import { Link } from "@/src/lib/intl/navigation";
import { useUserQuery } from "@/src/queries/useUserQuery";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { UserRole } from "@prisma/client";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { upperCase } from "lodash";
import { CreditCard, Crown, User } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { DropdownMenuItemLogout } from "./LogoutButton";
import { CreditLine } from "./components/CreditLine";

type UserProfileProps = {
  className?: string;
  isLoading?: boolean;
  email: string;
};
export const UserProfile = ({
  className,
  email,
  isLoading,
}: UserProfileProps) => {
  const format = useFormatter();
  const { data: user } = useUserQuery(email);
  const { userInfoStore: userStore } = useUserInfoStore();

  const [userProfile, setUserProfile] = useState<ReturnUserDependencyProps>();
  const { saasSettings } = useSaasSettingsStore();
  const t = useTranslations("Layout.Header.Navbar.UserProfile");

  if (!userStore?.info?.id || isLoading) {
    return (
      <div className="flex items-center space-x-3 h-11 pr-7 ml-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        {/* <div className="space-y-2">
            <Skeleton className="py-1 !h-0.5 rounded-full w-14" />
          </div> */}
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className={`flex flex-row`}>
          <Button variant="link">
            <div className="w-7 h-7  userNavbarDiv push-effect">
              <Avatar className="!no-underline ">
                {userStore?.info?.image && (
                  <AvatarImage
                    src={userStore.info?.image?.replace(
                      "/upload/",
                      "/upload/f_auto/"
                    )}
                    className=""
                    alt={userStore.info?.name ?? "User avatar"}
                  />
                )}
                <AvatarFallback
                  className="!no-underline"
                  style={{ textDecoration: "transparent" }}>
                  <span className="!no-underline">
                    {upperCase(
                      userStore?.info?.name
                        ?.toString()
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </span>
                </AvatarFallback>
              </Avatar>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="user-profile-dd">
          {/*  NOTE:  My account */}
          {userStore?.info?.name && (
            <DropdownMenuItem className="w-full" asChild>
              <Link
                href="/dashboard"
                className="nunderline profile-link text-left pr-10 cursor-pointer">
                <User className="icon self-start mt-1" />
                <span className="flex flex-col  justify-start gap-0">
                  <span>{userStore.info?.name}</span>
                  <span className="text-xs -mt-1 font-medium">
                    {useSlice(userStore.info?.email, 21)}
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          )}
          {/* <DropdownMenuItem className="w-full px-2 mt-1" asChild>
          <Link
            href="/dashboard"
            className="nunderline profile-link text-left pr-10  cursor-pointer">
            <AtSign className="mr-2 h-4 w-4" />
            {/* My account */}
          {/* {t("my-account")} */}
          {/* </Link> */}
          {/* </DropdownMenuItem> */}
          {/* NOTE:  Refill */}
          {saasSettings.activeRefillCredit && (
            <>
              <DropdownMenuItem className="w-full mt-1" asChild>
                <Link href="/refill" className="user-profile-buy-credit">
                  <CreditCard className="icon" />
                  {/* Buy credits */}
                  {t("refill")} {saasSettings.creditName?.toLowerCase()}s
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {userStore?.info?.role !== ("USER" as UserRole) && (
            <>
              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem className="w-full mt-1" asChild>
                <Link
                  prefetch={false}
                  href="/admin"
                  className="nunderline profile-link text-left pr-10 cursor-pointer">
                  <Crown className="mr-2 icon" />
                  Admin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
            </>
          )}
          <DropdownMenuItemLogout />
          <DropdownMenuArrow className="dropdown-arrow" />
        </DropdownMenuContent>
      </DropdownMenu>
      <CreditLine className="" saasSettings={saasSettings} />
    </div>
  );
};
