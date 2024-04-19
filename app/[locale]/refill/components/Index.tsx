"use client";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "@/src/lib/intl/navigation";
import { createRefillSession, portailclient } from "../queries/refill.action";

type RefillButtonProps = {};

export const Index = ({}: RefillButtonProps) => {
  const router = useRouter();
  const handleStripeRefill = async () => {
    const refill = await createRefillSession();
    if (!refill) return;
    return router.push(refill as any);
  };

  const handleClient = async () => {
    const refill = await portailclient();
    if (!refill) return;
    return router.push(refill as any);
  }
  return (
    <div>
      <Button onClick={handleStripeRefill}>Refill</Button>
      <Button onClick={handleClient}>Client</Button>
    </div>
  );
};
