"use client";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Separator } from "@/src/components/ui/separator";
import { Link } from "@/src/lib/intl/navigation";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { UserRole } from "@prisma/client";
import { CreditCard, User, Wrench } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import { DropdownMenuItemLogout } from "./LogoutButton";

type UserProfileProps = {
  className?: string;
};
export const UserProfile = ({ className }: UserProfileProps) => {
  const { saasSettings } = useSaasSettingsStore();
  const userInfo = useSession().data?.user;
  const user = useSession().data?.user;
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
                  sizes="50px"
                  fill
                  className="object-cover rounded-full w-20 h-20"
                />
              )}
            </div>
          </div>
          {saasSettings.activeCreditSystem && (
            <>
              <div className="w-full userNavbarDiv">
                <div
                  className="relative w-full"
                  data-tooltip-id="remainingTooltip">
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
                    Credit remaining
                    {saasSettings.creditName} : x%
                  </span>
                  <small>50 &nbsp;/&nbsp; 100</small>
                </Tooltip>
              </div>
              {className && <div className="ml-5">2%</div>}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
        {saasSettings.activeRefillCredit && (
          <>
            <DropdownMenuItem className="w-full" asChild>
              <Link href="/pricing" className="user-profile-buy-credit">
                <CreditCard className="icon" />
                {/* Buy credits */}
                Buy credit
                {saasSettings.creditName}
              </Link>
            </DropdownMenuItem>
            <Separator />
          </>
        )}
        <DropdownMenuItem className="w-full px-2 mt-1" asChild>
          <Link
            href="/profil/mon-compte"
            className="nunderline profile-link text-left pr-10  cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {/* My account */}
            My account
          </Link>
        </DropdownMenuItem>
        <Separator className="my-1 h-0.5" />
        {userInfo?.role !== ("USER" as UserRole) && (
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
