"use client";
import { ButtonWithLoader } from "@/src/components/ui/@fairysaas/button-with-loader";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Slider } from "@/src/components/ui/slider";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { useRouter } from "@/src/lib/intl/navigation";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Coins } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Goodline } from "@/src/components/ui/@aceternity/good-line";
import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { toUpper } from "lodash";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { createRefillSession } from "../queries/refill.action";
type CreditSelectorProps = {
 
  onCreditsChange?: (credits: number) => void;
};

export const Index = ({
  onCreditsChange,
}: CreditSelectorProps) => {
  const format = useFormatter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { saasSettings, isStoreLoading } = useSaasSettingsStore();
  const t = useTranslations("Refill.Components.Index");
  const router = useRouter();
  const [credits, setCredits] = useState(0);
  const pricePerCredit = saasSettings.priceForOneRefillCredit || 1;
  const discount =
    saasSettings.activeDiscountRefillCredit &&
    credits >= (saasSettings.applyDiscountByXRefillCreditStep || 0)
      ? saasSettings.discountForRefillCredit || 0
      : 0;
  const price = credits * pricePerCredit * (1 - discount / 100);
  const confettiRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (value: number[]) => {
    setCredits(value[0]);
    if (onCreditsChange) {
      onCreditsChange(value[0]);
    }
  };

  useEffect(() => {
    if (isStoreLoading) {
      setIsLoaded(false);
    } else {
      setIsLoaded(true);
    }
    setCredits(saasSettings.applyDiscountByXRefillCreditStep || 0);
  }, [saasSettings]);

  useEffect(() => {
    if (discount > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Display confetti for 3 seconds
    }
  }, [discount]);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    if (confettiRef.current) {
      setCardWidth(confettiRef.current.offsetWidth);
    }
  }, [confettiRef]);
  const handleStripeRefill = async () => {
    setLoading(true);
    const refill = await createRefillSession({
      secret: chosenSecret(),
      numberOfCredits: credits,
      price: price,
      creditName: saasSettings.creditName ?? "credits",
    });
    if (!refill) return;
    setLoading(false);
    return router.push(refill as any);
  };

  const discountPosition =
    ((saasSettings.applyDiscountByXRefillCreditStep || 0) /
      (saasSettings.maxRefillCredit || 300)) *
    100;

  return (
    <Card>
      <div ref={confettiRef} className="relative"></div>
      <CardHeader>
        <CardTitle className="mb-10">
          {t("choose-credits-number", {
            credits: credits,
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {saasSettings?.activeDiscountRefillCredit && (
          <div className="relative mb-2">
            {showConfetti && confettiRef.current && (
              <Confetti
                className={`w-1/2 mt-2  mx-auto`}
                width={cardWidth}
                initialVelocityX={10}
                numberOfPieces={50}
                tweenDuration={2000}
                recycle={false}
                gravity={0.2}
                initialVelocityY={-5}
              />
            )}
            {isLoaded && (
              <Badge
                variant="default"
                className={cn(
                  {
                    "opacity-50": discount === 0,
                  },
                  `absolute -top-10 !font-bold flex flex-col items-center custom-badge`
                )}
                style={{
                  left: `${discountPosition}%`,
                  transform: "translateX(-50%)",
                }}>
                {t("discount-off")}{" "}
                {format.number(
                  (saasSettings?.discountForRefillCredit ?? 0) / 100,
                  {
                    style: "percent",
                  }
                )}{" "}
              </Badge>
            )}
          </div>
        )}
        {isLoaded ? (
          <>
            <Slider
              value={[credits]}
              onValueChange={handleSliderChange}
              min={saasSettings.refillCreditStep || 10}
              max={saasSettings.maxRefillCredit || 300}
              step={saasSettings.refillCreditStep || 10}
              className="my-4 mb-10"
            />
            <p className="text-center">
              {format.number(credits, {
                style: "decimal",
              })}{" "}
              {saasSettings.creditName?.toLowerCase()}
            </p>
            <p className="text-center text-xl font-bold">
              {format.number(price, {
                style: "currency",
                currency: toUpper(saasSettings.currency ?? "USD") ?? undefined,
              })}
            </p>
            <Badge
              variant={"outline"}
              className={cn(
                { "opacity-0": discount === 0 },
                `text-center !text-theming-text-500`
              )}>
              {t("discount-applied", {
                discount: saasSettings.discountForRefillCredit,
              })}
            </Badge>
          </>
        ) : (
          <Loader noHFull className="  mx-auto" />
        )}
        <Goodline className="mt-10" />
      </CardContent>
      <CardFooter>
        <ButtonWithLoader
          onClick={handleStripeRefill}
          loading={loading}
          disabled={loading || !isLoaded}
          className="w-full"
          type="button"
          variant="default">
          <Coins className="icon" /> {t("button.refill-credits")}
        </ButtonWithLoader>
      </CardFooter>
    </Card>
  );
};
