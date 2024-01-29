import { PopoverClose } from "@radix-ui/react-popover";
import { MessageCircleWarningIcon, Trash } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
type Props = {
  handleDelete: () => void;
    size?: "sm" | "lg" | "icon";
    what: string;
};
export const PopoverDelete = ({ handleDelete, size, what }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghostDestructive"} className="">
          <Trash className="icon" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <p className="text-center font-bold flex flex-col gap-2 justify-center">
            <MessageCircleWarningIcon className="mx-auto" />
            <span>Are you sure you want to delete {what} ?</span>
          </p>
          <div className="flex flex-row gap-5 justify-evenly">
            <Button
              size={size ? size : "default"}
              className="w-full"
              onClick={() => {
                handleDelete();
              }}>
              Yes
            </Button>
            <PopoverClose asChild>
              <Button className="grayscale w-full">No</Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
