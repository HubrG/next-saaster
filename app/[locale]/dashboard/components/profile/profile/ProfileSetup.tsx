"use client";

import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import {
  ReturnUserDependencyProps,
  getUserInfos,
} from "@/src/helpers/dependencies/user";
import { useUserStore } from "@/src/stores/userStore";
import { useEffect, useState } from "react";
import { ProfileInformation } from "./subcomponents/Informations";
import { ProfilePicture } from "./subcomponents/ProfilePicture";

type ProfileSetupProps = {};

export const ProfileSetup = ({}: ProfileSetupProps) => {
  const { userStore, isUserStoreLoading } = useUserStore();
  const [userProfile, setUserProfile] =
    useState<ReturnUserDependencyProps | null>();

  useEffect(() => {
    if (!isUserStoreLoading) {
      setUserProfile(getUserInfos({ user: userStore }));
    }
  }, [userStore, isUserStoreLoading]);
  
   if (!userProfile || userProfile?.isLoading) {
     return <SkeletonLoader type="card" />;
   }
  return (
    <>
      <ProfilePicture />
      <ProfileInformation user={userStore} />
    </>
  );
};
