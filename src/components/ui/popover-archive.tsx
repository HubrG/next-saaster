import { PopoverClose } from "@radix-ui/react-popover";
import { ArchiveX, MessageCircleWarningIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { SimpleLoader } from "./loader";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
type Props = {
  handleDelete: () => void;
    size?: "sm" | "lg" | "icon";
    what: string;
};
export const PopoverArchive = ({ handleDelete, size, what }: Props) => {
  const [loading, setLoading] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghostDestructive"} className="">
          <ArchiveX className="icon" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <p className="text-center font-bold flex flex-col gap-2 justify-center">
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
              <Button variant={"ghost"} className="w-full">No</Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
