import { AddProduct } from "./stripe-products-prices/AddProduct";
import { ProductsList } from "./stripe-products-prices/ProductsList";

export const ManageStripeProductsAndPrices = () => {
  return (
    <>
      <AddProduct />
      <ProductsList />
    </>
  );
};
