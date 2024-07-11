"use client";
import { translateTextWithDeepL } from "@/src/lib/translate-api";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useTranslationStore } from "@/src/stores/translationStore";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

type PriceCardFeatureProps = {
  featName?: string | null | undefined;
  featDesc?: string | null | undefined;
  featCategory?: string | null | undefined;
  id?: string;
  enabledFeature?: boolean;
  icon?: JSX.Element;
  creditAlloued?: string | undefined;
  onlyFeatureName?: boolean;
  onlyFeatureDesc?: boolean;
  onlyFeatureCategory?: boolean;
};
export const PriceCardFeatureNameAndDesc = ({
  featName,
  featDesc,
  enabledFeature,
  id,
  icon,
  onlyFeatureName,
  featCategory,
  onlyFeatureDesc,
  onlyFeatureCategory,
  creditAlloued,
}: PriceCardFeatureProps) => {
  const locale = useLocale();
  // Dynamical translation
  const [hasTranslated, setHasTranslated] = useState(false);
  const { appSettings } = useAppSettingsStore();
  const key = `${featName}-${locale}`;
  const { featureTranslations, setFeatureTranslations } = useTranslationStore();
  useEffect(() => {
    const translateNameAndDescription = async () => {
      if (
        !hasTranslated &&
        !featureTranslations[key] &&
        locale !== appSettings.defaultLocale
      ) {
        setHasTranslated(true);
        if (hasTranslated) return;
        const name = await translateTextWithDeepL(featName ?? "", locale);
        const description = await translateTextWithDeepL(
          featDesc ?? "",
          locale
        );
        const category = await translateTextWithDeepL(
          featCategory ?? "",
          locale
        );
        setFeatureTranslations(key, {
          name,
          description,
          category,
        });
      }
    };
    translateNameAndDescription();
  }, [
    key,
    locale,
    featName,
    featDesc,
    featureTranslations,
    setFeatureTranslations,
    featCategory,
    hasTranslated,
  ]);
  const { name, description, category } = featureTranslations[key] || {
    name: featName ?? "",
    description: featDesc ?? "",
    category: featCategory ?? "",
  };
  const rand = Math.random();
  if (onlyFeatureName) {
    return <>{name}</>;
  }
  if (onlyFeatureDesc) {
    return <>{description}</>;
  }
  if (onlyFeatureCategory) {
    return <>{category}</>;
  }
  return (
    <>
      <p
        className={`flex px-0.5 ${description && "hover:bg-theming-text-50/50"} rounded-default items-center ${!enabledFeature && "opacity-50"}  !text-sm cursor-default`}
        data-tooltip-id={rand + (id ?? "")}>
        {icon}
        {creditAlloued}
        {name}
      </p>
      {featDesc && (
        <Tooltip place="top" delayShow={200} noArrow className="tooltip !w-3/4 " id={rand + (id ?? "")} opacity={90}>
          {description}
        </Tooltip>
      )}
    </>
  );
};
