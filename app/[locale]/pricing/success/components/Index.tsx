"use client";
import { Card } from '@/src/components/ui/card';
import { Loader } from '@/src/components/ui/loader';
import { useIsClient } from '@/src/hooks/useIsClient';
import { Link } from '@/src/lib/intl/navigation';
import dynamic from "next/dynamic";
import Confetti from 'react-confetti';
const LottieComponent = dynamic(() => import("@/src/lotties/LottieComponent"), {
  ssr: false,
});

type IndexProps = {
    session: any;
}

export const Index = ({session}: IndexProps) => {
  const isClient = useIsClient();
  if (!isClient) { return <Loader />; }
  return (
    <>
      <Confetti recycle={false} gravity={0.5} />
    <Card>
      <h1 className="text-2xl">
        Thanks for your{" "}
        {session.data === "payment" ? "purchase" : "subscription"} !
      </h1>
      <p className="text-center mt-5">
        <Link href={"/dashboard"}>Go to my account</Link>
      </p>
      <div className="mt-5">
        <LottieComponent height={100} width={100} file="success" />
      </div>
    </Card>
    </>
  );
}
