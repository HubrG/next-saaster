"use client";
import { ExtendedStripeProduct, useSaasStripeProductsStore } from "@/src/stores/admin/stripeProductsStore";
import { DataTable } from "./@ui/data-table";
import {  StripeProductsAndPrices, columns } from "./@ui/columns";
import { StripeProduct } from "@prisma/client";

// Cette fonction filtre les propriétés des objets à 'id', 'active', et 'description'
 function getData(
  saasStripeProducts: ExtendedStripeProduct[]
): StripeProductsAndPrices[] {
  const filteredData = saasStripeProducts.map(
    ({
      id,
      active,
      description,
      MRRSPlanRelation,
    }): StripeProductsAndPrices => {
      return {
        id,
        active,
        description: description ?? "",
        MRRSPlanId: MRRSPlanRelation?.id ?? "",
        MRRSPlanName: MRRSPlanRelation?.name ?? "",
      };
    }
  );
  return filteredData;
}
export const StripeManager = () => {
  const { saasStripeProducts, setSaasStripeProducts } =
    useSaasStripeProductsStore();
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    return <div>Stripe secret key not found</div>;
  }
  const data = getData(saasStripeProducts as StripeProduct[]);
  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};
