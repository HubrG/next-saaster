"use client";
import { AdminSaas } from "@/src/components/pages/admin/saas/AdminSaas";
import { AdminSetup } from "@/src/components/pages/admin/setup/AdminSetup";
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
