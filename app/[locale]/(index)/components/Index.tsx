"use client";

import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { useIsClient } from "@/src/hooks/useIsClient";
import { useUserStore } from "@/src/stores/userStore";

export const Index = () => {
  const isClient = useIsClient();
  const { userStore } = useUserStore();
  if (!isClient) return <Loader />;
  return (
   
    <></>
  );
};
