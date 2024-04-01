import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { getUserInfos } from "@/src/helpers/dependencies/user";
import { formatDateWithFns } from "@/src/helpers/functions/convertDate";
import { cn } from "@/src/lib/utils";
import { iUsers } from "@/src/types/db/iUsers";
import { upperCase } from "lodash";
import { UserDialogChangeRole } from "./UserDialogSelectRole";
import { SubscriptionHistory } from "./UserDialogSubscriptionsHistory";
import { CurrencyComponentStore } from "./table";
type UserDialogProps = {
  user: iUsers;
};
export function UserDialog({ user }: UserDialogProps) {
  const userProfile = getUserInfos({ user });
  return (
    <>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle className="flex md:flex-row flex-col items-center justify-between">
            <div className="flex flex-row items-start gap-2">
              <Avatar className="!no-underline h-[3.3rem] w-[3.3rem] mx-auto mt-1 ">
                {user.image !== "" && (
                  <AvatarImage
                    src={user.image ?? ""}
                    className={cn(``)}
                    alt={user.name ?? "User avatar"}
                  />
                )}
                <AvatarFallback style={{ textDecoration: "transparent" }}>
                  <span className="!no-underline text-base">
                    {upperCase(
                      user.name
                        ?.toString()
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </span>
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex flex-row items-center">
                  <span className="text-3xl">{user.name}</span>
                </div>
                <span className="text-base">
                  <CurrencyComponentStore />
                  {(userProfile.payments.total_amount_subscriptions ?? 0) +
                    (userProfile.payments.total_amount_ontime_payments ?? 0) ??
                    0}{" "}
                  total spent
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">
                Joined on {formatDateWithFns(user.createdAt ?? "0", "US")}
              </span>
              <UserDialogChangeRole user={user} />
            </div>
          </DialogTitle>
        </DialogHeader>
        <Goodline />
        <SubscriptionHistory user={userProfile} />
      </DialogContent>
    </>
  );
}
