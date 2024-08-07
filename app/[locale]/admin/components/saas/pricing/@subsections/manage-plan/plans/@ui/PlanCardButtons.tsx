"use client";
import { SimpleLoader } from "@/src/components/ui/@blitzinit/loader";
import { PopoverArchive } from "@/src/components/ui/@blitzinit/popover-archive";
import { Button } from "@/src/components/ui/@shadcn/button";
import { cn } from "@/src/lib/utils";
type Props = {
  save: boolean;
  cancel: boolean;
  handleSave: () => void;
  handleReset: () => void;
  handleDelete: () => void;
  isLoading?: boolean;
  handleInputChange: (e: string, name: string) => void;
  saasTypeState: string;
};
export const PlanCardButtons = ({
  save,
  cancel,
  handleSave,
  handleReset,
  handleDelete,
  handleInputChange,
  saasTypeState,
  isLoading,
}: Props) => {
  return (
    <>
      <Button
        disabled={!save}
        className={cn({ disabled: !save })}
        onClick={handleSave}>
        {isLoading && <SimpleLoader />} Save changes
      </Button>
      <Button
        variant={"link"}
        disabled={!cancel}
        className={cn({ hidden: !save }, "grayscale-50")}
        onClick={handleReset}>
        Reset
      </Button>
      {/* <PlanCardSwitchSaasType
        saasTypeState={saasTypeState}
        handleInputChange={handleInputChange}
      /> */}
      <PopoverArchive what="this plan" handleDelete={handleDelete} />
    </>
  );
};
