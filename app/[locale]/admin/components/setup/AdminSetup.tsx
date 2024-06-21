"use client";
import { SetupDesign } from "@/app/[locale]/admin/components/setup/design-settings/SetupDesign";
import { InfoApp } from "@/app/[locale]/admin/components/setup/info-settings/InfoApp";
import { SectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SectionWrapper";
import { Building2, Languages, LayoutDashboard, Palette } from "lucide-react";
import Internationalization from "./internationalization/Internationalization";
import { Layout } from "./layout-settings/Layout";

export const AdminSetup = () => {
  return (
    <>
      <SectionWrapper
        id="AppCompany"
        sectionName="Company"
        mainSectionName="Setup"
        icon={<Building2 className="icon" />}>
        <InfoApp />
      </SectionWrapper>
      <SectionWrapper
        icon={<Palette className="icon" />}
        id="Design"
        mainSectionName="Setup"
        sectionName="Design">
        <SetupDesign />
      </SectionWrapper>
      <SectionWrapper
        icon={<LayoutDashboard className="icon" />}
        id="Layout"
        sectionName="Layout"
        mainSectionName="Setup"
        className="multiple-components ">
        <Layout />
      </SectionWrapper>
      <SectionWrapper
        icon={<Languages className="icon" />}
        id="Internationalization"
        sectionName="Internationalization"
        mainSectionName="Setup">
        <Internationalization />
      </SectionWrapper>
    </>
  );
};
