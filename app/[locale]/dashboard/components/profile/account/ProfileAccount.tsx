"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { PopoverConfirm } from "@/src/components/ui/@blitzinit/popover-confirm";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Card } from "@/src/components/ui/@shadcn/card";
import { deleteUser } from "@/src/helpers/db/users.action";
import {
  ReturnUserDependencyProps
} from "@/src/helpers/dependencies/user-info";
import { useUserInfoStore } from "@/src/stores/userInfoStore";
import { useUserStore } from "@/src/stores/userStore";
import { capitalize } from "lodash";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CreatePassword } from "./components/CreatePassword";
import { UpdatePassword } from "./components/UpdatePassword";

type ProfileAccountProps = {};

export const ProfileAccount = ({}: ProfileAccountProps) => {
  const t = useTranslations("Dashboard.Components.Profile.Account");
  const { userStore, isUserStoreLoading } = useUserStore();
  const { userInfoStore, setUserInfoStore } = useUserInfoStore();
  const [userProfile, setUserProfile] =
    useState<ReturnUserDependencyProps | null>();
  const [refresh, setRefresh] = useState(false);
  const [stopLoading, setStopLoading] = useState(true);
  const isLoading = isUserStoreLoading;

  useEffect(() => {
    if (!isUserStoreLoading) {
      setUserProfile(userInfoStore);
      setRefresh(false);
    }
  }, [userStore, refresh, isLoading, isUserStoreLoading]);

  const handleDeleteAccount = async () => {
    const deleteAccount = (await deleteUser({
      email: userStore.email ?? "",
    })) as { data: { error: string; statusCode: number } };
    if (deleteAccount.data.statusCode === 500) {
      toaster({
        type: "error",
        description: deleteAccount.data.error,
        duration: 13000,
      });
      setStopLoading(false);
      return;
    }
    toaster({ type: "success", description: "Account deleted" });
    return signOut();
  };

   const provider =
     userStore?.accounts && userStore.accounts.length > 0
       ? userStore.accounts[0]?.provider
       : null;

  if (!userProfile || userProfile?.isLoading) {
    return <SkeletonLoader type="card" />;
  }

  // userInfoStore.info.usage[0].

  return (
    <>
      {provider && (
        <Card className="mt-14">
          <p className="font-bold text-center hyphens-auto">
            {userStore.email}
          </p>
          <p className="italic text-center flex text-sm flex-col justify-center">
            {t("connectedWith", { varIntlProvider: capitalize(provider) })}
          </p>
        </Card>
      )}
      <div className="my-10">
        <h3 className="!text-left md:text-xl text-base opacity-90">
          {t("manage-password")}
        </h3>
        {!userStore.password ? (
          <>
            <p className="text-sm opacity-70 !text-left">
              {t("create-password", {
                varIntlProvider: capitalize(provider ?? ""),
              })}
            </p>
            <CreatePassword user={userProfile.info} className="w-full mt-5" />
          </>
        ) : (
          <p className="text-base opacity-70 !text-left">
            <UpdatePassword
              user={userProfile.info}
              className="inline font-bold underline"
            />
          </p>
        )}
      </div>
      <Goodline />
      <PopoverConfirm
        handleFunction={() => {
          handleDeleteAccount();
        }}
        className="mt-5 text-left float-right dark:text-theming-text-900 text-red-500"
        display={t("close-account")}
        what={t("close-account-popover-message")}
      />
    </>
  );
};
