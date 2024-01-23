"use client";
import { Separator } from "@/src/components/ui/separator";
import { appSettings } from "@prisma/client";
import { AdminSaas } from "@/src/components/features/pages/admin/saas/AdminSaas";
import { AdminSetup } from "@/src/components/features/pages/admin/setup/AdminSetup";

type Props = {
  appSettings: appSettings;
};

export const AdminMain = ({ appSettings }: Props) => {
  return (
    <div className="admin-main">
      <div id="headerAdminNavbar">
        <h1>Administration</h1>
        <Separator className="separator" />
      </div>
      <div className="admin-main-content">
        {/* Setup */}
        <AdminSetup appSettings={appSettings} />
        {/* SaaS */}
        <AdminSaas appSettings={appSettings} />
      </div>
    </div>
  );
};
