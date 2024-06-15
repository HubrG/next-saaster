"use client";

import { useSessionQuery } from "@/src/queries/useSessionQuery";

export default  function HowItWorksPage() {
  const session = useSessionQuery().data?.user;
  
  return <div>{session?.name}</div>;
}
