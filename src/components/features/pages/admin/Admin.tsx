"use client";
import { AdminMain } from "@/src/components/features/pages/admin/@subcomponents/Main";
import { AdminNavbar } from "@/src/components/features/pages/admin/@subcomponents/Navbar";
import { Loader } from "@/src/components/ui/loader";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useSaasMRRSPlans } from "@/src/stores/saasMRRSPlans";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import {
  MRRSPlan,
  SaasSettings,
  appSettings,
} from "@prisma/client";
import { useEffect, useState } from "react";

type Props = {
  appSettings: appSettings;
  saasSettings: SaasSettings;
  saasMRRSPlans: MRRSPlan[];
};

export const AdminComponent = ({
  appSettings,
  saasSettings,
  saasMRRSPlans,
}: Props) => {
  const { setAppSettings } = useAppSettingsStore();
  const { setSaasSettings } = useSaasSettingsStore();
  const { setSaasMRRSPlans } = useSaasMRRSPlans();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (appSettings.id) {
      setAppSettings(appSettings); 
      setSaasMRRSPlans(saasMRRSPlans);
      setSaasSettings(saasSettings);
      setMounted(true);
    }
  }, [
    appSettings,
    saasMRRSPlans,
    setAppSettings,
    saasSettings,
    setSaasSettings,
    setSaasMRRSPlans,
  ]);

  if (!mounted && !useAppSettingsStore.getState().appSettings.id){
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
