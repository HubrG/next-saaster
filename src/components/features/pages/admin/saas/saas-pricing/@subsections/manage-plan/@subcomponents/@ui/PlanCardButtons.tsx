import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { PopoverArchive } from "@/src/components/ui/popover-archive";
import { SimpleLoader } from "@/src/components/ui/loader";
type Props = {
  save: boolean;
  cancel: boolean;
  handleSave: () => void;
  handleReset: () => void;
  handleDelete: () => void;
  isLoading?: boolean;
};
export const PlanCardButtons = ({
  save,
  cancel,
  handleSave,
  handleReset,
  handleDelete,
  isLoading
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
      <PopoverArchive what="this plan" handleDelete={handleDelete} />
    </>
  );
};
