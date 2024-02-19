"use client";
import { AddCoupon } from "./stripe-coupons/AddCoupon";
import { CouponsList } from "./stripe-coupons/CouponsList";

export const ManageCoupons = () => {
  return (
    <>
      <AddCoupon />
      <CouponsList />
    </>
  );
};
