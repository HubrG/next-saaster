import { PopoverClose } from "@radix-ui/react-popover";
import { ArchiveX, MessageCircleWarningIcon } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "react-tooltip";
import { Button } from "../@shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../@shadcn/popover";
import { SimpleLoader } from "./loader";
type Props = {
  handleDelete: () => void;
  size?: "sm" | "lg" | "icon";
  what: string;
};
export const PopoverArchive = ({ handleDelete, size, what }: Props) => {
  const [loading, setLoading] = useState(false);
  let randomId = Math.random().toString(36).substring(7);
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghostDestructive"}
            className=""
            data-tooltip-id={randomId}>
            <ArchiveX className="icon" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <p className="text-center !font-semibold flex flex-col gap-2 justify-center">
              <MessageCircleWarningIcon className="mx-auto" />
              <span>Are you sure you want to archive {what} ?</span>
            </p>
            <div className="flex flex-row gap-5 justify-evenly">
              <Button
                size={size ? size : "default"}
                className="w-full"
                variant="destructive"
                onClick={() => {
                  setLoading(true);
                  handleDelete();
                }}>
                {loading ? <SimpleLoader /> : "Yes"}
              </Button>
              <PopoverClose asChild>
                <Button variant={"ghost"} className="w-full">
                  No
                </Button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Tooltip id={randomId} className="tooltip" >
        <span>Archive</span>
      </Tooltip>
    </>
  );
};
