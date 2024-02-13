"use client";
import { AdminSaas } from "@/src/components/pages/admin/saas/AdminSaas";
import { AdminSetup } from "@/src/components/pages/admin/setup/AdminSetup";

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
