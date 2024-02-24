"use client";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { useIsClient } from "@/src/hooks/useIsClient";
import { Coins, Settings2 } from "lucide-react";
import { SaasPricing } from "./pricing/SaasPricing";
import { AdminSaasSettings } from "./settings/AdminSaasSettings";

export const AdminSaas = () => {
  const isClient = useIsClient();
  if (!isClient) return null;
  return (
    <>
      <SectionWrapper
        id="SaasSettings"
        sectionName="Settings"
        mainSectionName="SaaS"
        icon={<Settings2 className="icon" />}>
        <AdminSaasSettings />
      </SectionWrapper>
      <SectionWrapper
        id="Pricing"
        sectionName="Pricing"
        mainSectionName="SaaS"
        icon={<Coins className="icon" />}>
        <SaasPricing />
      </SectionWrapper>
    </>
  );
};
