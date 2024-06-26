"use client";

import { SubSectionWrapper } from "@/src/components/ui/@fairysaas/user-interface/SubSectionWrapper";

import { DefaultLocale } from "./@subsections/DefaultLocale";
import { Glossary } from "./@subsections/Glossary";
import Languages from "./@subsections/Languages";
import SwitchActiveAutoTranslate from "./switches/ActiveAutoTranslate";
import SwitchActiveInternationalization from "./switches/ActiveInternationalization";

export default function Internationalization() {
  return (
    <>
      <SubSectionWrapper
        sectionName="Settings"
        id="sub-active-internationalization"
        info="Active or deactivate the internationalization features">
        <div className="grid grid-cols-2 gap-10">
          <SwitchActiveInternationalization />
          <SwitchActiveAutoTranslate />
        </div>
        <Glossary />
      </SubSectionWrapper>
      <SubSectionWrapper
        sectionName="Default Locale"
        className="col-span-12"
        id="sub-default-locale"
        info="Set the default locale for your app. It's the language that will be used by default.">
        <DefaultLocale />
      </SubSectionWrapper>
      <SubSectionWrapper
        sectionName="Languages"
        id="sub-inter-dictionary"
        info="Enable or disable switch languages">
        <Languages />
      </SubSectionWrapper>
    </>
  );
}
