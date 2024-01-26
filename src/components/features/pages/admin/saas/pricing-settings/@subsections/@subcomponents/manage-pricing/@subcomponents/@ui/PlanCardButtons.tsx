import { Button } from '@/src/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import { cn } from '@/src/lib/utils';
import { PopoverClose } from '@radix-ui/react-popover';
import { MessageCircleWarningIcon, Trash } from 'lucide-react';
type Props = {
    save: boolean;
    cancel: boolean;
    handleSave: () => void;
    handleCancel: () => void;
    handleDelete: () => void;
    setCancel: (cancel: boolean) => void;
};
export const PlanCardButtons = ({ save, cancel, handleSave, handleCancel, handleDelete, setCancel } : Props) => {
    return (
      <>
   <Button
            disabled={!save}
            className={cn({ disabled: !save })}
            onClick={handleSave}>
            Save changes
          </Button>
          <Button
            variant={"link"}
            disabled={!cancel}
            className={cn({ hidden: !save }, "grayscale-50")}
            onClick={handleCancel}>
            Reset
          </Button>
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
                  <span>Are you sure you want to delete this plan ?</span>
                </p>
                <div className="flex flex-row gap-5 justify-evenly">
                  <Button
                    className="w-full"
                    variant={"destructive"}
                    onClick={() => {
                      handleDelete();
                    }}>
                    Yes
                  </Button>
                  <PopoverClose asChild>
                    <Button
                      className="grayscale w-full"
                      onClick={() => {
                        setCancel(false);
                      }}>
                      No
                    </Button>
                  </PopoverClose>
                </div>
              </div>
            </PopoverContent>
          </Popover>
      </>
  )
}
