"use client";
import { SkeletonLoader } from "@/src/components/ui/@blitzinit/loader";
import { useUserStore } from "@/src/stores/userStore";
import SwitchNewsletter from "./@subcomponents/SwitchNewsletter";

export const ProfileEmail = () => {
  const { userStore, isUserStoreLoading } = useUserStore();
 
  if (isUserStoreLoading || !userStore.id) {
    return <SkeletonLoader type="card" />;
  }
  return (
    <div>
      <SwitchNewsletter user={userStore} />
    </div>
  );
};
