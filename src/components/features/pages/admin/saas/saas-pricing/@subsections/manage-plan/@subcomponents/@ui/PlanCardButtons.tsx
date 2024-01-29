import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { PopoverDelete } from "../../../../../../../../../ui/popover-delete";
type Props = {
  save: boolean;
  cancel: boolean;
  handleSave: () => void;
  handleReset: () => void;
  handleDelete: () => void;
};
export const PlanCardButtons = ({
  save,
  cancel,
  handleSave,
  handleReset,
  handleDelete,
}: Props) => {
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
        onClick={handleReset}>
        Reset
      </Button>
      <PopoverDelete what="this plan" handleDelete={handleDelete} />
    </>
  );
};
