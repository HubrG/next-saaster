"use client";
import { AdminMain } from "@/src/components/features/pages/admin/@subcomponents/Main";
import { AdminNavbar } from "@/src/components/features/pages/admin/@subcomponents/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useFeatureCategoryStore } from "@/src/stores/featureCategoryStore";
import { useSaasMRRSPlans } from "@/src/stores/saasMRRSPlans";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  MRRSPlan,
  PricingFeatureCategory,
  SaasSettings,
  appSettings,
} from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  appSettings: appSettings;
  featureCategories: PricingFeatureCategory[];
  saasSettings: SaasSettings;
  saasMRRSPlans: MRRSPlan[];
};

export const AdminComponent = ({
  appSettings,
  featureCategories,
  saasSettings,
  saasMRRSPlans,
}: Props) => {
  const { setPricingFeatCat } = useFeatureCategoryStore();
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { setSaasMRRSPlans } = useSaasMRRSPlans();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (appSettings) {
      setMounted(true);
      setAppSettings(appSettings); // Déplacer cette logique ici
      setPricingFeatCat(featureCategories);
      setSaasMRRSPlans(saasMRRSPlans);
      setSaasSettings(saasSettings);
    }
  }, [
    appSettings,
    saasMRRSPlans,
    setAppSettings,
    setPricingFeatCat,
    featureCategories,
    saasSettings,
    setSaasSettings,
    setSaasMRRSPlans,
  ]);

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
