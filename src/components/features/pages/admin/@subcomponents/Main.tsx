"use client";
import { AdminSaas } from "@/src/components/features/pages/admin/saas/AdminSaas";
import { AdminSetup } from "@/src/components/features/pages/admin/setup/AdminSetup";
import { Separator } from "@/src/components/ui/separator";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { useFeatureCategoryStore } from "@/src/stores/featureCategoryStore";

export const AdminMain = () => {
  const { appSettings } = useAppSettingsStore();
  const { pricingFeatCat } = useFeatureCategoryStore();

  return (
    <div className="admin-main">
      <div id="headerAdminNavbar">
        <h1>Administration</h1>
        <Separator className="separator" />
      </div>
      <div className="admin-main-content">
        {/* Setup */}
        <AdminSetup />
        {/* SaaS */}
        <AdminSaas />
      </div>
    </div>
  );
};
