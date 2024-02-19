"use client";
import { AdminSaas } from "@/app/[locale]/admin/components/saas/AdminSaas";
import { AdminSetup } from "@/app/[locale]/admin/components/setup/AdminSetup";
import { Loader } from "@/src/components/ui/loader";
import { useIsClient } from "@/src/hooks/useIsClient";

export const AdminMain = () => {
  const isClient = useIsClient();

  if (!isClient) {
    return <Loader />;
  }
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
