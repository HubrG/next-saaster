"use client";
import React from 'react'
import { BackgroundGrad } from './Background';
import { MRRSPlan } from '@prisma/client';
import { useSaasSettingsStore } from '@/src/stores/saasSettingsStore';
import { usePublicSaasPricingStore } from '@/src/stores/admin/publicSaasPricingStore';
import currenciesData from "@/src/jsons/currencies.json";
import { Currencies } from '@/src/types/Currencies';
import { Separator } from '@/src/components/ui/separator';
import { CheckoutButton } from './CheckoutButton';

type Props = {
    plan: MRRSPlan;
}
export const PriceCard = ({ plan }: Props) => {
    const { saasSettings } = useSaasSettingsStore();
    const { isYearly } = usePublicSaasPricingStore();
      const currencies = currenciesData as Currencies;

  return (
    <BackgroundGrad>
      <div className="flex flex-col items-center gap-5 justify-center">
        <h2 className="font-bold text-center">{plan.name}</h2>
        <div className="flex flex-col items-center justify-center ">
          <span className="text-3xl font-bold text-center">
            {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
            <small>
              {saasSettings.currency
                ? currencies[saasSettings.currency]?.sigle
                : ""}
            </small>
          </span>
          <sup className="text-lg text-center">
            /{isYearly ? "year" : "month"}
          </sup>
        </div>
        <CheckoutButton plan={plan} />

        <Separator />
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-center">
            {plan.description}
          </span>
        </div>
      </div>
    </BackgroundGrad>
  );
}
