"use client";
import { SetupDesign } from "@/app/[locale]/admin/components/setup/design-settings/SetupDesign";
import { InfoApp } from "@/app/[locale]/admin/components/setup/info-settings/InfoApp";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { Info, LayoutDashboard, Palette } from "lucide-react";
import { Layout } from "./layout-settings/Layout";

export const AdminSetup = () => {
  return (
    <>
      <SectionWrapper
        id="InfosApp"
        sectionName="Info"
        mainSectionName="Setup"
        icon={<Info className="icon" />}>
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
    </>
  );
};
