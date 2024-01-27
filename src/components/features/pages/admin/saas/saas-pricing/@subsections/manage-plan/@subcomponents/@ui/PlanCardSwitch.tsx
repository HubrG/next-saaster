import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { MRRSPlan } from '@prisma/client';
type Props = {
  plan: MRRSPlan;
  planState: boolean | null;
  name: string
  label: string;
  disabled?: boolean;
  handleInputChange: (e: boolean, name: string) => void;
    };
export const PlanCardSwitch = ({plan, planState, label, name, handleInputChange} : Props) => {
  return (
    <div className="switch">
      <Switch
        name={name}
        checked={planState ?? false}
        id={`${plan.id}${name}`}
        onCheckedChange={(e) => handleInputChange(e, name)}
      />
      <Label className="col-span-10" htmlFor={`${plan.id}isFree`}>
        {label}
      </Label>
    </div>
  );
}
