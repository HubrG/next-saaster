type PriceCardProps = {
  productId: string;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  reccurence?: "monthly" | "yearly" | "weekly" | "daily";
  reccurenceEvery?: string;
};

export const CustomPriceCard = ({}: PriceCardProps) => {
  return <></>;
};
