import { isStripeSetted } from '@/src/helpers/functions/isStripeSetted';
import { cn } from '@/src/lib/utils';
import React from 'react';
import { Tooltip } from 'react-tooltip';

type Props = {
    children: React.ReactNode;
    id: string;
    }
export const AddButtonWrapper = ({children, id}: Props) => {
  return (
    <div className="flex justify-start my-5 mb-5">
      <div
        className={cn(
          {
            "cursor-not-allowed": !isStripeSetted(),
          },
          "flex items-center gap-2"
        )}
        data-tooltip-id={`add-${id}`}>
        {children}
        {!isStripeSetted() && (
            <Tooltip id={`add-${id}`} className="tooltip">
              <span>
                You need to fill your Stripe API keys in the <code>.env</code>{" "}
                file to be able to add button.
              </span>
            </Tooltip>
          )}
      </div>
    </div>
  );
}
