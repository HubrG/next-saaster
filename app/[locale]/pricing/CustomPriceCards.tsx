"use client";

import { usePublicSaasPricingStore } from "@/src/stores/publicSaasPricingStore";
import { CustomPriceCard } from "./components/CUSTOM/CustomPriceCard";
import { SwitchCustomRecurrence } from "./components/SwitchCustomRecurrence";

export const CustomPriceCards = () => {
  const { customIs1, customIs2, customIs3, customIs4 } =
    usePublicSaasPricingStore();

  return (
    <>
      <SwitchCustomRecurrence
        enabled={true}
        custom1="Monthly"
        custom1PercentOff={10}
        custom2="Yearly"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 justify-center items-start mx-5 gap-10">
        <CustomPriceCard
          displayOnRecurrence={"custom1"}
          className="lg:col-start-2"
          priceId="price_1PZvf2KEzhGWTuJbGiKm0BEz"
          customMode="subscription"
          creditByMonth={100}
          trialDays={10}
        />
        <CustomPriceCard
          priceId="price_1PafXSKEzhGWTuJb8T4BYcrb"
          slash={"titoken"}
          displayOnRecurrence={"custom1"}
          smallPriceDescription="per user"
          customMode="subscription"
          customQuantity={2}
          creditByMonth={200}
          customPrice={12}
          customPriceStroke={20}
        />
        <CustomPriceCard
          displayOnRecurrence={"custom2"}
          className="lg:col-start-2"
          priceId="price_1PZvf2KEzhGWTuJbGiKm0BEz"
          customMode="subscription"
          creditByMonth={100}
          trialDays={10}
        />
        <CustomPriceCard
          priceId="price_1PafXSKEzhGWTuJb8T4BYcrb"
          slash={"titoken"}
          displayOnRecurrence={"custom2"}
          smallPriceDescription="per user"
          customMode="subscription"
          customQuantity={2}
          creditByMonth={200}
          customPrice={112}
          customPriceStroke={210}
        />
      </div>
    </>
  );
};
