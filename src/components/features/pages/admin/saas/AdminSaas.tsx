"use client";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { appSettings } from "@prisma/client";
import { SaasPricing } from "./saas-pricing/SaasPricing";
import { AdminSaasSettings } from "./saas-settings/AdminSaasSettings";
import { Settings2, Coins } from "lucide-react";
import { Suspense } from "react";
import { Loader } from "@/src/components/ui/loader";

type Props = {
  appSettings: appSettings;
};

export const AdminSaas = () => {
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
        icon={<Coins className="icon" />}>
        <Suspense fallback={<Loader />}>
        <SaasPricing />
        </Suspense>
      </SectionWrapper>
    </>
  );
};
