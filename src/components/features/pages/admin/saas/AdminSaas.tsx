"use client";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { appSettings } from "@prisma/client";
import { SaasPricing } from "./saas-pricing/SaasPricing";
import { AdminSaasSettings } from "./saas-settings/AdminSaasSettings";

type Props = {
  appSettings: appSettings;
};

export const AdminSaas = () => {
  return (
    <>
      <SectionWrapper id="SaasSettings" sectionName="SaaS settings">
        <AdminSaasSettings />
      </SectionWrapper>
      <SectionWrapper id="Pricing" sectionName="SaaS pricing">
        <SaasPricing />
      </SectionWrapper>
    </>
  );
};
