"use client";

import { Loader } from "@/src/components/ui/loader";
import { useIsClient } from "@/src/hooks/useIsClient";

export const Index = () => {
  const isClient = useIsClient();
  if (!isClient) return <Loader />;

  return (
   
    <></>
  );
};
