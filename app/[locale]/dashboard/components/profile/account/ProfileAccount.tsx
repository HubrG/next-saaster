"use client";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Card } from "@/src/components/ui/card";
import { SkeletonLoader } from "@/src/components/ui/loader";
import { PopoverConfirm } from "@/src/components/ui/popover-confirm";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { deleteUser } from "@/src/helpers/db/users.action";
import { ReturnProps, getUserInfos } from "@/src/helpers/dependencies/user";
import { useUserStore } from "@/src/stores/userStore";
import { capitalize } from "lodash";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { CreatePassword } from "./components/CreatePassword";
import { UpdatePassword } from "./components/UpdatePassword";

type ProfileAccountProps = {};

export const ProfileAccount = ({}: ProfileAccountProps) => {
  const { userStore, isStoreLoading } = useUserStore();
  const [userProfile, setUserProfile] = useState<ReturnProps | null>();
  const [refresh, setRefresh] = useState(false);
  const [stopLoading, setStopLoading] = useState(true);
  const isLoading = isStoreLoading;

  useEffect(() => {
    if (!isStoreLoading) {
      setUserProfile(getUserInfos({ user: userStore }));
      setRefresh(false);
    }
  }, [userStore, refresh, isLoading, isStoreLoading]);

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

  const provider = userStore?.accounts && userStore.accounts[0].provider;

  if (!userProfile || userProfile?.isLoading) {
    return <SkeletonLoader type="card" />;
  }

  return (
    <>
      {provider && (
        <Card className="mt-14">
          <h4 className="font-normal">{userStore.email}</h4>
          <p className="italic text-center flex flex-col justify-center">
            You are connected with your {capitalize(provider)} account.
          </p>
        </Card>
      )}
      <div className="my-10">
        <h3 className="!text-left md:text-xl text-base opacity-90">
          Manage your password
        </h3>
        {!userStore.password ? (
          <>
            <p className="text-sm opacity-70 !text-left">
              You haven&apos;t created a password because you&apos;re logged in
              with a {capitalize(provider ?? "")} account.{" "}
              <CreatePassword
                user={userProfile.info}
                className="inline font-bold underline"
              />
            </p>
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
        display="Close account definitely..."
        what={"to delete your account? This action cannot be undone."}
      />
    </>
  );
};
