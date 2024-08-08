"use client";

import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { useUserStore } from "@/src/stores/userStore";
import { ProfileInformation } from "./subcomponents/Informations";
import { ProfilePicture } from "./subcomponents/ProfilePicture";

type ProfileSetupProps = {};

export const ProfileSetup = ({}: ProfileSetupProps) => {
  const { userStore, isUserStoreLoading } = useUserStore();
 
   if (!userStore.name) {
     return <SkeletonLoader type="card" />;
   }
  return (
    <>
      <ProfilePicture />
      <ProfileInformation user={userStore} />
    </>
  );
};
