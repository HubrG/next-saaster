"use client";
import { AdminMain } from "@/src/components/features/pages/admin/@subcomponents/Main";
import { AdminNavbar } from "@/src/components/features/pages/admin/@subcomponents/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasMRRSFeaturesStore } from "@/src/stores/saasMRRSFeaturesStore";
import { useSaasMRRSPlansStore } from "@/src/stores/saasMRRSPlansStore";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  MRRSFeature,
  MRRSPlan,
  SaasSettings,
  appSettings,
} from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
  saasMRRSPlans: MRRSPlan[];
  saasMRRSFeatures: MRRSFeature[];
};

export const AdminComponent = ({
  appSettings,
  saasSettings,
  saasMRRSPlans,
  saasMRRSFeatures,
}: Props) => {
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { setSaasMRRSPlans } = useSaasMRRSPlansStore();
  const { setSaasMRRSFeatures } = useSaasMRRSFeaturesStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (appSettings.id) {
      setAppSettings(appSettings);
      setSaasMRRSPlans(saasMRRSPlans);
      setSaasMRRSFeatures(saasMRRSFeatures);
      setSaasSettings(saasSettings);
      setMounted(true);
    }
  }, [
    appSettings,
    saasMRRSPlans,
    saasMRRSFeatures,
    setSaasMRRSFeatures,
    setAppSettings,
    saasSettings,
    setSaasSettings,
    setSaasMRRSPlans,
  ]);

  if (!mounted && !useAppSettingsStore.getState().appSettings.id) {
    return (
      <div className="flex justify-center w-full h-[90vh] items-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="grid grid-cols-12 md:gap-5 gap-0">
          <AdminNavbar />
          <AdminMain />
        </div>
      </div>
    </>
  );
};
