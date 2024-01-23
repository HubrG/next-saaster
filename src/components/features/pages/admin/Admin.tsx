"use client";
import { Loader } from "@/src/components/ui/loader";
import { appSettings } from "@prisma/client";
import { useEffect, useState } from "react";
import { AdminMain } from "@/src/components/features/pages/admin/AdminMain";
import { AdminNavbar } from "./AdminNavbar";
import { useAppSettingsStore } from "@/src/stores/settingsStore";

type Props = {
  appSettings: appSettings;
};

export const AdminComponent = ({ appSettings }: Props) => {
  const { appSet, setAppSettings } = useAppSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAppSettings(appSettings);
  }, [appSettings, setAppSettings]);

  return (
    <>
      {mounted ? (
        <div>
          <div className="grid grid-cols-12 gap-10">
            <AdminNavbar />
            <AdminMain appSettings={appSettings} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full h-[90vh] items-center">
          <Loader />
        </div>
      )}
    </>
  );
};
