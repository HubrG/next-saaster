import { DivFullScreenGradient } from '@/src/components/ui/@fairysaas/layout-elements/gradient-background';
import { getSaasSettings } from '@/src/helpers/db/saasSettings.action';
import { redirect } from '@/src/lib/intl/navigation';
import createMetadata from '@/src/lib/metadatas';
import { getTranslations } from 'next-intl/server';
import { Index } from './components/Index';
export const generateMetadata = async () => {
  const t = await getTranslations();

  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: t("Refill.metadatas.title"),
  });
};
export default async function page() {
    const saasSettings = await getSaasSettings();
    console.log(saasSettings.data?.activeRefillCredit)
    if (!saasSettings.data?.activeRefillCredit && !saasSettings.data?.activeCreditSystem) {
        redirect('/')
    }
    
  return (
   <>
      <DivFullScreenGradient gradient="gradient-to-bl" />
      <div className=" items-center justify-center ">
        <Index />
        </div>
        </>
  )
}
