import React from 'react'
import { AddCoupon } from './@subcomponents/AddCoupon';
import { CouponsList } from './@subcomponents/CouponsList';

export const ManageCoupons = () => {
  return (
    <>
      <AddCoupon />
      <CouponsList />
    </>
  );
}
