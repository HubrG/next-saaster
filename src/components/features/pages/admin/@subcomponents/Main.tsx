"use client";
import { AdminSaas } from "@/src/components/features/pages/admin/saas/AdminSaas";
import { AdminSetup } from "@/src/components/features/pages/admin/setup/AdminSetup";

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
