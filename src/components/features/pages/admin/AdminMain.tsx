"use client";
import React from "react";
import { Separator } from "@/src/components/ui/separator";
import { appSettings } from "@prisma/client";
import { ThemeColorChange } from "./setup/theme-settings/ThemeColorChange";
import ToggleActiveDarkMode from "./setup/layout-settings/ToggleActiveDarkMode";
import ToggleCtaOnNavbar from "./setup/layout-settings/ToggleCtaOnNavbar";
import ToggleDefaultDarkMode from "./setup/layout-settings/ToggleDefaultDarkMode";
import ToggleTopLoader from "./setup/layout-settings/ToggleTopLoader";
import { AdminSectionWrapper } from "./ui/AdminSectionWrapper";
import { InfoApp } from "./setup/info-settings/InfoApp";
import { RoundedCornerChange } from "./setup/theme-settings/RoundedCornerChange";

type Props = {
  appSettings: appSettings;
};

export const AdminMain = ({ appSettings }: Props) => {
  return (
    <div className="admin-main">
      <div id="headerAdminNavbar">
        <h1>Administration</h1>
        <Separator className="separator" />
      </div>
      <div className="admin-main-content">
        <AdminSectionWrapper id="InfosApp" sectionName="Informations">
          <InfoApp data={appSettings as appSettings} />
        </AdminSectionWrapper>
        <AdminSectionWrapper id="ThemeColorChange" sectionName="Thèmes">
          <ThemeColorChange data={appSettings as appSettings} />
          <RoundedCornerChange data={appSettings as appSettings} />
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
      </div>
    </div>
  );
};
