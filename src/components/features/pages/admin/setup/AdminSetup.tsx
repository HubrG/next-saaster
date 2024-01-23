import React from "react";
import ToggleActiveDarkMode from "@/src/components/features/pages/admin/setup/layout-settings/ToggleActiveDarkMode";
import ToggleCtaOnNavbar from "@/src/components/features/pages/admin/setup/layout-settings/ToggleCtaOnNavbar";
import ToggleDefaultDarkMode from "@/src/components/features/pages/admin/setup/layout-settings/ToggleDefaultDarkMode";
import ToggleTopLoader from "@/src/components/features/pages/admin/setup/layout-settings/ToggleTopLoader";
import { SetupDesign } from "@/src/components/features/pages/admin/setup/design-settings/SetupDesign";
import { SectionWrapper } from "@/src/components/ui/user-interface/SectionWrapper";
import { InfoApp } from "@/src/components/features/pages/admin/setup/info-settings/InfoApp";


export const AdminSetup = () => {
  return (
    <>
      <SectionWrapper id="InfosApp" sectionName="Info">
        <InfoApp />
      </SectionWrapper>
      <SectionWrapper id="Design" sectionName="Design">
        <SetupDesign />
      </SectionWrapper>
      <SectionWrapper
        id="Layout"
        sectionName="Layout"
        className="multiple-components">
        <ToggleDefaultDarkMode  />
        <ToggleActiveDarkMode />
        <ToggleTopLoader  />
        <ToggleCtaOnNavbar  />
      </SectionWrapper>
    </>
  );
};
