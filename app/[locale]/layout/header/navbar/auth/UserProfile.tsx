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
import { SimpleLoader } from "@/src/components/ui/loader";
import { Separator } from "@/src/components/ui/separator";
import { Link } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { UserRole } from "@prisma/client";
import { CreditCard, User, Wrench } from "lucide-react";
import { useSession } from "next-auth/react";
import { Tooltip } from "react-tooltip";
import { DropdownMenuItemLogout } from "./LogoutButton";
type UserProfileProps = {
  className?: string;
};
export const UserProfile = ({ className }: UserProfileProps) => {
  const { saasSettings } = useSaasSettingsStore();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <>
        <SimpleLoader />
      </>
    );
  }
  if (session?.user === undefined || session === undefined) {
    return (
      <>
        <SimpleLoader />
      </>
    );
  }

  const user = session.user;

  const tokenPercentage = 50;
  const nameInitials = user?.name
    ?.toString()
    .split(" ")
    .map((n) => n[0]);
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
              {user?.image && (
                <AvatarImage src={user.image} className="" alt="@shadcn" />
              )}
              <AvatarFallback
                className="!no-underline"
                style={{ textDecoration: "transparent" }}>
                <span className="!no-underline">{nameInitials}</span>
              </AvatarFallback>
            </Avatar>
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
                  <span>50 &nbsp;/&nbsp; 100</span>
                </Tooltip>
              </div>
              {className && <div className="ml-5">2%</div>}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="user-profile-dd max-h-90">
        {saasSettings.activeRefillCredit && (
          <>
            <DropdownMenuItem className="w-full" asChild>
              <Link href="/pricing" className="user-profile-buy-credit">
                <CreditCard className="icon" />
                {/* Buy credits */}
                Buy credit {saasSettings.creditName}
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem className="w-full px-2 mt-1" asChild>
          <Link
            href="/dashboard"
            className="nunderline profile-link text-left pr-10  cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            {/* My account */}
            My account
          </Link>
        </DropdownMenuItem>
        {user?.role !== ("USER" as UserRole) && (
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
