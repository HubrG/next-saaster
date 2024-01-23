import { appSettings } from "@prisma/client";
import { AdminSectionWrapper } from "@/src/components/features/pages/admin/ui/AdminSectionWrapper";
import { SaasPricing } from './pricing/SaasPricing';

type Props = {
  appSettings: appSettings;
};

export const AdminSaas = ({ appSettings }: Props) => {
  return (
    <>
      <AdminSectionWrapper id="Pricing" sectionName="Pricing">
        <SaasPricing appSettings={appSettings} />
      </AdminSectionWrapper>
    </>
  );
};
