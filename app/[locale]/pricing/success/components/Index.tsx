"use client";
import { Loader } from '@/src/components/ui/@blitzinit/loader';
import { Card } from '@/src/components/ui/@shadcn/card';
import { useIsClient } from '@/src/hooks/utils/useIsClient';
import { Link } from '@/src/lib/intl/navigation';
import { useTranslations } from 'next-intl';
import dynamic from "next/dynamic";
import Confetti from 'react-confetti';
const LottieComponent = dynamic(() => import("@/src/lotties/LottieComponent"), {
  ssr: false,
});

type IndexProps = {
    session: any;
}

export const Index = ({ session }: IndexProps) => {
  const t = useTranslations("Pricing.Success.Components.Index");
  const isClient = useIsClient();
  if (!isClient) { return <Loader />; }
  return (
    <>
      <Confetti recycle={false} gravity={0.5} />
    <Card>
        <h1 className="text-2xl">
          {
            t("success")
          }
      </h1>
      <p className="text-center mt-5">
          <Link href={"/dashboard"}>{t("go-to")}</Link>
      </p>
      <div className="mt-5">
        <LottieComponent height={100} width={100} file="success" />
      </div>
    </Card>
    </>
  );
}
