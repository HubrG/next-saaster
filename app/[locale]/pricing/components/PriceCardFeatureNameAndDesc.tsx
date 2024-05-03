"use client";
import { defaultLocale } from "@/src/lib/intl/navigation";
import { translateTextWithDeepL } from "@/src/lib/translate-api";
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
  const key = `${featName}-${locale}`;
  const { featureTranslations, setFeatureTranslations } = useTranslationStore();
  useEffect(() => {
    const translateNameAndDescription = async () => {
      if (
        !hasTranslated &&
        !featureTranslations[key] &&
        locale !== defaultLocale
      ) {
        setHasTranslated(true);
        if (hasTranslated) return;
        const name = await translateTextWithDeepL(
          featName ?? "",
          locale,
          defaultLocale
        );
        const description = await translateTextWithDeepL(
          featDesc ?? "",
          locale,
          defaultLocale
        );
        const category = await translateTextWithDeepL(
          featCategory ?? "",
          locale,
          defaultLocale
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
        className={`flex items-center ${!enabledFeature && "opacity-50"}  !text-sm cursor-default`}
        data-tooltip-id={rand + (id ?? "")}>
        {icon}
        {creditAlloued}
        {name}
      </p>
      {featDesc && (
        <Tooltip place="left" className="tooltip" id={rand + (id ?? "")} opacity={100}>
          {description}
        </Tooltip>
      )}
    </>
  );
};
