"use client";
import { AdminSaas } from "@/app/[locale]/admin/components/saas/AdminSaas";
import { AdminSetup } from "@/app/[locale]/admin/components/setup/AdminSetup";
import { Card } from "@/src/components/ui/card";
import { Loader } from "@/src/components/ui/loader";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";

export const AdminMain = () => {

  return (
    <>
      {/* Setup */}
      <AdminSetup />
      {/* SaaS */}
      <AdminSaas />
    </>
  );
};
export default AdminMain;
