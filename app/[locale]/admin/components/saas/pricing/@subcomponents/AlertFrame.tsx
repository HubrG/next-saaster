"use client";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { isStripeSetted } from "@/src/helpers/functions/isStripeSetted";
import { FileWarning } from "lucide-react";

export const AlertFrame = () => {

  return (
    <div>
      {!isStripeSetted() && (
        <Alert variant={"destructive"}>
          <FileWarning className="h-4 w-4" />
          <AlertTitle className="!text-destructive dark:!text-destructive">
            Important
          </AlertTitle>
          <AlertDescription className="text-destructive">
            <ul className="list-disc">
              {!isStripeSetted() && (
                <li>
                  Your Stripe account is not setted. Please set it in the
                  <code className="!bg-destructive/10 dark:!bg-destructive/10">
                    .env
                  </code>{" "}
                  file
                </li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
    </div>
  );
};
