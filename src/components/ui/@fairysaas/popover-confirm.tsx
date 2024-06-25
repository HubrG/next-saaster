"use client";
import { PopoverClose } from "@radix-ui/react-popover";
import { MessageCircleWarningIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { SimpleLoader } from "./loader";

type Props = {
  handleFunction: () => void;
  size?: "sm" | "lg" | "icon";
  what: string;
  icon?: React.ReactNode;
  display?: string;
  className?: string;
  children?: React.ReactNode;
  variant?:
    | "link"
    | "destructive"
    | "ghost"
    | "ghostDestructive"
    | "outline"
    | "default";
};
/**
 * PopoverConfirm is a component that will display a popover with a confirmation message and two buttons, one to confirm and one to cancel.
 * @param handleFunction - The function that will be called when the user confirms the action.
 * @param size - (optional) The size of the button, can be "sm", "lg" or "icon".
 * @param what - (optional)  The message that will be displayed in the popover.
 * @param icon - (optional) - The icon that will be displayed in the button.
 * @param display - (optional) The text that will be displayed in the button « are you sure you want... [your display]
 *
 */
export const PopoverConfirm = ({
  handleFunction,
  variant,
  size,
  className,
  what,
  icon,
  children,
  display,
}: Props) => {
  const t = useTranslations("Components.UI.popover-confirm");
  const [loading, setLoading] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        {display ? (
          <Button variant={variant ?? "link"} className={className ?? ""}>
            {icon} {display}
          </Button>
        ) : (
          <Button
            variant={variant ?? "ghostDestructive"}
            className={className ?? ""}>
            <Trash className="icon" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <p className="text-center font-bold flex flex-col gap-2 justify-center">
            <MessageCircleWarningIcon className="mx-auto" />
            <span>
              {t("message")} {what}
            </span>
          </p>
          <div className="flex flex-row gap-5 justify-evenly">
            <Button
              variant={"destructive"}
              size={size ? size : "default"}
              className="w-full"
              onClick={() => {
                setLoading(true);
                handleFunction();
                setTimeout(() => setLoading(false), 3000);
              }}>
              {loading ? <SimpleLoader /> : t("confirm")}
            </Button>
            <PopoverClose asChild>
              <Button
                variant={"ghost"}
                onClick={() => setLoading(false)}
                className=" w-full">
                {t("cancel")}
              </Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
