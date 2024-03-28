"use client";

import { SkeletonLoader } from "@/src/components/ui/loader";
import { ReturnProps, getUserInfos } from "@/src/helpers/dependencies/user";
import { useUserStore } from "@/src/stores/userStore";
import { useEffect, useState } from "react";
import { ProfileInformation } from "./subcomponents/Informations";
import { ProfilePicture } from "./subcomponents/ProfilePicture";

type ProfileSetupProps = {};

export const ProfileSetup = ({}: ProfileSetupProps) => {
  const { userStore, isStoreLoading } = useUserStore();
  const [userProfile, setUserProfile] = useState<ReturnProps | null>();
    const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!isStoreLoading) {
      setUserProfile(getUserInfos({ user: userStore }));;
    }
  }, [userStore, refresh, isStoreLoading]);
  
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
