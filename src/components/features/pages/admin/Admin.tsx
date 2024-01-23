"use client";
import { Loader } from "@/src/components/ui/loader";
import { PricingFeatureCategory, appSettings } from "@prisma/client";
import { useEffect, useState } from "react";
import { AdminMain } from "@/src/components/features/pages/admin/subcomponents/Main";
import { AdminNavbar } from "@/src/components/features/pages/admin/subcomponents/Navbar";
import { useFeatureCategoryStore } from "@/src/stores/featureCategoryStore";
import { useAppSettingsStore } from "@/src/stores/settingsStore";

type Props = {
  appSettings: appSettings;
  featureCategories: PricingFeatureCategory[];
};

export const AdminComponent = ({ appSettings, featureCategories }: Props) => {
  const { setPricingFeatCat } = useFeatureCategoryStore();
  const { setAppSettings } = useAppSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (appSettings) {
      setMounted(true);
      setAppSettings(appSettings); // Déplacer cette logique ici
      setPricingFeatCat(featureCategories);
    }
  }, [appSettings, setAppSettings, setPricingFeatCat, featureCategories]);

  if (!mounted) {
    return (
      <div className="flex justify-center w-full h-[90vh] items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="grid grid-cols-12 gap-10">
          <AdminNavbar />
          <AdminMain />
        </div>
      </div>
    </>
  );
};
