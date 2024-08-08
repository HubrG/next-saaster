"use client";
import { PopoverClose } from "@radix-ui/react-popover";
import { MessageCircleWarningIcon, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "../@shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../@shadcn/popover";
import { SimpleLoader } from "./loader";
type Props = {
  handleDelete: () => void;
  size?: "sm" | "lg" | "icon";
  what: string;
  display?: string;
  icon?: React.ReactNode;
  variant?:
    | "link"
    | "destructive"
    | "ghost"
    | "ghostDestructive"
    | "outline"
    | "default";
  className?: string;
};
export const PopoverDelete = ({
  handleDelete,
  variant,
  size,
  className,
  icon,
  what,
  display,
}: Props) => {
  const t = useTranslations("Components.UI.popover-delete");
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
          <p className="text-center !font-semibold flex flex-col gap-2 justify-center">
            <MessageCircleWarningIcon className="mx-auto" />
            <span className="!font-semibold">
              {t("message")} {what} ?
            </span>
          </p>
          <div className="flex flex-row gap-5 justify-evenly">
            <Button
              variant={"destructive"}
              size={size ? size : "default"}
              className="w-full"
              onClick={() => {
                setLoading(true);
                handleDelete();
              }}>
              {loading ? <SimpleLoader /> : t("confirm")}
            </Button>
            <PopoverClose asChild>
              <Button variant={"ghost"} className=" w-full">
                {t("cancel")}
              </Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
