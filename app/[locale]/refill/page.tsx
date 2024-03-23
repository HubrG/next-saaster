import { DivFullScreenGradient } from '@/src/components/ui/layout-elements/gradient-background';
import { getSaasSettings } from '@/src/helpers/db/saasSettings.action';
import { redirect } from 'next/navigation';
import { Index } from './components/Index';

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
