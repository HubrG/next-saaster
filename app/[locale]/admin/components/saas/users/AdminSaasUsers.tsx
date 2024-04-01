"use client";

import { SkeletonLoader } from "@/src/components/ui/@fairysaas/loader";
import { useUserStore } from "@/src/stores/userStore";
import { DataTableDemo } from "./@subcomponents/table";

type AdminSaasUsersProps = {};

export const AdminSaasUsers = ({}: AdminSaasUsersProps) => {
  const { usersStore, fetchUserStore, isUserStoreLoading } = useUserStore();
  if (isUserStoreLoading) return <SkeletonLoader type="card-page" />;
  return (
    <div>
      <DataTableDemo  />
    </div>
  );
};
