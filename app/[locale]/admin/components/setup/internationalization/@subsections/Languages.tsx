"use client";
import { toaster } from "@/src/components/ui/@fairysaas/toaster/ToastConfig";
import { SwitchWrapper } from "@/src/components/ui/@fairysaas/user-interface/ui/SwitchWrapper";
import languages from "@/src/lib/intl/languages.json";
import useInternationalizationStore from "@/src/stores/internationalizationStore";
import { useEffect, useState } from "react";
import Flag from "react-world-flags";

export default function Languages() {
  const [enabledLanguages, setEnabledLanguages] = useState<string[]>([]);
  const {
    internationalizations,
    removeLanguageFromStore,
    addLanguageToStore,
    fetchInternationalizations,
  } = useInternationalizationStore();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchInternationalizations();
  }, []);

  useEffect(() => {
    setEnabledLanguages(internationalizations.map((lang) => lang.code));
  }, [internationalizations]);

  const handleLanguageToggle = async (code: string, enabled: boolean) => {
    setLoading(true);
    if (enabled) {
      await addLanguageToStore(code);
    } else {
      await removeLanguageFromStore(code);
    }

    const language = languages.find((lang) => lang.code === code);
    const flag = language ? language.flag : "";
    setLoading(false);
    toaster({
      title: "Language",
      description: `${
        language?.name_en
          ? language.name_en.charAt(0).toUpperCase() + language.name_en.slice(1)
          : "Unknown language"
      } ${enabled ? "enabled" : "disabled"}`,
      icon: <Flag code={flag} className="icon" />,
      type: "success",
    });
  };

  return (
    <div className="grid md:grid-cols-3  grid-cols-2 gap-5">
      {languages.map(({ code, flag, name_en }) => (
        <SwitchWrapper
          key={code}
          handleChange={(e) => handleLanguageToggle(code, e)}
          checked={enabledLanguages.includes(code)}
          loading={loading}
          icon={<Flag code={flag} className="icon" />}
          id={`switch-language-${code}`}>
          <small>{name_en.charAt(0).toUpperCase() + name_en.slice(1)}</small>
        </SwitchWrapper>
      ))}
    </div>
  );
}
