import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { CopySomething } from "@/src/components/ui/@fairysaas/copy-something";
import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { getUser } from "@/src/helpers/db/users.action";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { formatDateWithFns } from "@/src/helpers/functions/convertDate";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { iUsers } from "@/src/types/db/iUsers";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { random, round, upperCase } from "lodash";
import { View } from "lucide-react";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { UserDialogInfo } from "./UserDialogInfo";
import { PurchaseHistory } from "./UserDialogPurchaseHistory";
import { UserDialogChangeRole } from "./UserDialogSelectRole";
import { SubscriptionHistory } from "./UserDialogSubscriptionsHistory";
type UserDialogProps = {
  user: iUsers;
};
export function UserDialog({ user }: UserDialogProps) {
  const [userProfile, setUserProfile] = useState<ReturnUserDependencyProps>();
  const [update, setUpdate] = useState<boolean>(false);
  const format = useFormatter();
  useEffect(() => {
    const fetchUser = async () => {
      if (update) {
        // await 5 sc
        Promise.resolve(
          setTimeout(() => {
            console.log("waited 5 seconds");
          })
        );

        const fetchedUser = await getUser({
          email: userProfile?.info.email ?? "",
          secret: chosenSecret(),
        });
        setUserProfile(
          getUserInfos({ user: fetchedUser.data?.success as iUsers })
        );
        setUpdate(false);
      } else if (!userProfile) {
        setUserProfile(getUserInfos({ user }));
      }
    };
    fetchUser();
  }, [user, update]);
  const { saasSettings } = useSaasSettingsStore();
  if (!userProfile)
    return (
      <div className="flex flex-row gap-2 w-1/2">
        <SkeletonLoader type="rounded" />
        <div className="flex flex-col gap-2">
          <SkeletonLoader type="simple-line" />
          <SkeletonLoader type="simple-line" />
          <SkeletonLoader type="simple-line" />
        </div>
      </div>
    );

  const totalSpent = format.number(
    round(
      (userProfile.payments.total_amount_subscriptions ?? 0) +
        (userProfile.payments.total_amount_ontime_payments ?? 0) ?? 0,
      2
    ),
    {
      style: "currency",
      currency: saasSettings.currency ?? "USD",
    }
  );
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          {" "}
          <div className="px-0 text-sm">
            <View className="icon mt-1" />
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <ScrollArea className="overflow-auto p-4 max-h-[90vh]">
            <DrawerHeader className="relative -mt-9  w-full">
              <DrawerTitle className="sticky -top-5 w-full  z-[9999] bg-background">
                <div className="flex md:flex-row flex-col items-center justify-between">
                  <div className="flex md:flex-row flex-col items-center gap-2">
                    <Avatar className="!no-underline h-[3.3rem] w-[3.3rem] max-md:mx-auto mt-1 ">
                      {userProfile.info.image !== "" && (
                        <AvatarImage
                          src={userProfile.info.image ?? ""}
                          className={cn(``)}
                          alt={userProfile.info.name ?? "User avatar"}
                        />
                      )}
                      <AvatarFallback style={{ textDecoration: "transparent" }}>
                        <span className="!no-underline text-base">
                          {upperCase(
                            userProfile.info.name
                              ?.toString()
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          )}
                        </span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center max-sm:justify-center">
                        <span className="text-3xl">
                          {userProfile.info.name}
                        </span>
                      </div>
                      <div>
                        <CopySomething
                          copyText={userProfile.info.email ?? ""}
                          what="User email"
                          id={"copyEmail" + random(1, 900)}>
                          {userProfile.info.email ?? "No email"}
                        </CopySomething>
                      </div>

                      <span className="text-base  font-extrabold">
                        <CopySomething
                          copyText={totalSpent}
                          what="Total spent"
                          id={"copyTotal" + random(1, 900)}>
                          {totalSpent}
                        </CopySomething>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-base">
                      Joined on{" "}
                      {formatDateWithFns(
                        userProfile.info.createdAt ?? "0",
                        "US"
                      )}
                    </span>
                    <UserDialogChangeRole user={user} />
                  </div>
                </div>
                <Goodline />
              </DrawerTitle>
              <div className="mt-10">
                <UserDialogInfo setUpdate={setUpdate} user={userProfile} />
              </div>
              <Goodline />
              <SubscriptionHistory user={userProfile} />
              <Goodline />
              <PurchaseHistory user={userProfile} />
            </DrawerHeader>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
}
