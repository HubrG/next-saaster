"use client";

import { Loader } from "@/src/components/ui/loader";
import { PopoverConfirm } from "@/src/components/ui/popover-confirm";
import { toaster } from "@/src/components/ui/toaster/ToastConfig";
import { deleteUser } from "@/src/helpers/db/users.action";
import { ReturnProps, getUserInfos } from "@/src/helpers/dependencies/user";
import { handleError } from "@/src/lib/error-handling/handleError";
import { useUserStore } from "@/src/stores/userStore";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type ProfileAccountProps = {};

export const ProfileAccount = ({}: ProfileAccountProps) => {
  const { userStore, isStoreLoading } = useUserStore();
  const [userInfo, setUserInfo] = useState<ReturnProps | null>();
  const [refresh, setRefresh] = useState(false);
  const [stopLoading, setStopLoading] = useState(true);
  const isLoading = isStoreLoading;

  useEffect(() => {
    if (!isStoreLoading) {
      setUserInfo(getUserInfos({ user: userStore }));
      setRefresh(false);
    }
  }, [userStore, refresh, isLoading, isStoreLoading]);
  if (!userInfo || userInfo?.isLoading) {
    return <Loader noHFull />;
  }
  const handleDeleteAccount = async () => {
    const deleteAccount = (await deleteUser({
      email: userStore.email ?? "",
    })) as { data: { error: string, statusCode : number } };
    if (deleteAccount.data.statusCode === 500) {
      toaster({
        type: "error",
        description: deleteAccount.data.error,
        duration:13000
      });
      setStopLoading(false);
      return;
    }
    toaster({ type: "success", description: "Account deleted" });
    return signOut();
  };

  return (
    <PopoverConfirm
      handleFunction={() => {
        handleDeleteAccount();
      }}
      display="Delete account"
      what={"to delete your account? This action cannot be undone."}
    />
  );
};
