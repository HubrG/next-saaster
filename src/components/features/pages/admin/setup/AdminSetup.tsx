import React from "react";
import ToggleActiveDarkMode from "@/src/components/features/pages/admin/setup/layout-settings/ToggleActiveDarkMode";
import ToggleCtaOnNavbar from "@/src/components/features/pages/admin/setup/layout-settings/ToggleCtaOnNavbar";
import ToggleDefaultDarkMode from "@/src/components/features/pages/admin/setup/layout-settings/ToggleDefaultDarkMode";
import ToggleTopLoader from "@/src/components/features/pages/admin/setup/layout-settings/ToggleTopLoader";
import { SetupDesign } from "@/src/components/features/pages/admin/setup/design-settings/SetupDesign";
import { AdminSectionWrapper } from "@/src/components/features/pages/admin/ui/AdminSectionWrapper";
import { appSettings } from "@prisma/client";
import { InfoApp } from "@/src/components/features/pages/admin/setup/info-settings/InfoApp";
type Props = {
  appSettings: appSettings;
};

export const AdminSetup = ({ appSettings }: Props) => {
  return (
    <>
      <AdminSectionWrapper id="InfosApp" sectionName="Info">
        <InfoApp data={appSettings as appSettings} />
      </AdminSectionWrapper>
      <AdminSectionWrapper id="Design" sectionName="Design">
        <SetupDesign data={appSettings as appSettings} />
      </AdminSectionWrapper>
      <AdminSectionWrapper
        id="Layout"
        sectionName="Layout"
        className="multiple-components">
        <ToggleDefaultDarkMode data={appSettings as appSettings} />
        <ToggleActiveDarkMode data={appSettings as appSettings} />
        <ToggleTopLoader data={appSettings as appSettings} />
        <ToggleCtaOnNavbar data={appSettings as appSettings} />
      </AdminSectionWrapper>
    </>
  );
};
