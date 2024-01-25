"use client";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { MRRSPlan } from "@prisma/client";
import { useState } from "react";

type Props = {
  plan: MRRSPlan;
  modeAdmin: boolean;
};

type Currency = {
  name: string;
  sigle: string;
  // autres propriétés si nécessaire
};
export const PlanCard = ({ plan, modeAdmin }: Props) => {
  const [planState, setPlanState] = useState(plan);
  const { saasSettings } = useSaasSettingsStore()
  const [open, setOpen] = useState(false);
  const [comboCurrency, setComboCurrency] = useState("");

  const handleInputChange = (e: any, name: string) => {
    // Vérifiez si 'e.target' est défini
    let value: any;
    if (e && e.target && e.target.value !== undefined) {
      value = e.target.value;
    } else {
      value = e;
    }
    setPlanState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  if (modeAdmin && plan.name) {
    return (
      <div
        key={plan.id}
        className={`my-card ${
          planState.active && "active"
        } !border-2 admin-plan-display flex flex-col gap-5 justify-start items-center relative`}>
        {planState.active && (
          <Badge className="absolute dark:bg-emerald-900 dark:text-emerald-50  text-emerald-800 bg-emerald-400 !font-bold -mt-10 -left-2">
            <strong>Active</strong>
          </Badge>
        )}
        <Input
          name="name"
          value={planState.name ?? ""}
          onChange={(e) => handleInputChange(e, "name")}
        />
        <Textarea
          name="description"
          value={planState.description ?? ""}
          onChange={(e) => handleInputChange(e, "description")}
        />

        <Separator />
        <div className="switch">
          <Switch
            name="active"
            id={`${plan.id}active`}
            onCheckedChange={(e) => handleInputChange(e, "active")}
          />
          <Label htmlFor={`${plan.id}active`}>Is an active plan</Label>
        </div>
        <Separator />

        <div className="switch">
          <Switch
            name="isCustom"
            id={`${plan.id}isCustom`}
            onCheckedChange={(e) => handleInputChange(e, "isCustom")}
          />
          <Label className="col-span-10" htmlFor={`${plan.id}isCustom`}>
            Is a custom plan
          </Label>
        </div>
        <div className="switch">
          <Switch
            name="isPopular"
            id={`${plan.id}isPopular`}
            onCheckedChange={(e) => handleInputChange(e, "isPopular")}
          />
          <Label className="col-span-10" htmlFor={`${plan.id}isPopular`}>
            Is a popular plan
          </Label>
        </div>
        <div className="switch">
          <Switch
            name="isRecommended"
            id={`${plan.id}isRecommended`}
            onCheckedChange={(e) => handleInputChange(e, "isRecommended")}
          />
          <Label htmlFor={`${plan.id}isRecommended`}>
            Is a recommended plan
          </Label>
        </div>
        <div className="switch">
          <Switch
            name="isTrial"
            id={`${plan.id}isTrial`}
            onCheckedChange={(e) => handleInputChange(e, "isTrial")}
          />
          <Label htmlFor={`${plan.id}isTrial`}>Is a trial plan</Label>
        </div>
        <div className="switch">
          <Switch
            name="isMonthly"
            id={`${plan.id}isMonthly`}
            onCheckedChange={(e) => handleInputChange(e, "isMonthly")}
          />
          <Label htmlFor={`${plan.id}isMonthly`}>Is a monthly plan</Label>
        </div>
        <div className="switch">
          <Switch
            name="isYearly"
            id={`${plan.id}isYearly`}
            onCheckedChange={(e) => handleInputChange(e, "isYearly")}
          />
          <Label htmlFor={`${plan.id}isYearly`}>Is a yearly plan</Label>
        </div>
        <div className="switch">
          <Switch
            name="isCredit"
            id={`${plan.id}isCredit`}
            onCheckedChange={(e) => handleInputChange(e, "isCredit")}
          />
          <Label htmlFor={`${plan.id}isCredit`}>Is a credit plan</Label>
        </div>
        <Separator />

        <div className="inputs">
          <Label htmlFor={`${plan.id}trialDays`}>Trial days</Label>
          <Input
            type="number"
            name="trialDays"
            value={planState.trialDays ?? ""}
            onChange={(e) => handleInputChange(e, "trialDays")}
          />
          <p>days</p>
        </div>
        <div className="inputs">
          <Label htmlFor={`${plan.id}yearlyPrice`}>Yearly price</Label>
          <Input
            name="yearlyPrice"
            value={planState.yearlyPrice ?? ""}
            onChange={(e) => handleInputChange(e, "yearlyPrice")}
          />
          <p>{saasSettings.currency}</p>
        </div>
        <div className="inputs">
          <Label htmlFor={`${plan.id}monthlyPrice`}>Monthly price</Label>
          <Input
            id={`${plan.id}monthlyPrice`}
            name="monthlyPrice"
            value={planState.monthlyPrice ?? ""}
            onChange={(e) => handleInputChange(e, "monthlyPrice")}
          />
          <p>{saasSettings.currency}</p>
        </div>
        <div className="inputs">
          <Label htmlFor={`${plan.id}creditAllouedByMonth`}>
            Credit alloued by month
          </Label>
          <Input
            id={`${plan.id}creditAllouedByMonth`}
            name="creditAllouedByMonth"
            value={planState.creditAllouedByMonth ?? ""}
            onChange={(e) => handleInputChange(e, "creditAllouedByMonth")}
          />
          <p>credits</p>
        </div>
      </div>
    );
  } else {
    return (
      <div
        key={planState.id}
        className="my-card flex flex-col justify-center items-center">
        <h5>{planState.name}</h5>
      </div>
    );
  }
};
/* 
 id                   String              @id @default(cuid())
  name                 String?             @default("Plan name")
  description          String?             @default("Plan description")
  isCustom             Boolean?            @default(false) // Custom plan, contact us for...
  isPopular            Boolean?            @default(false) // Display popular plan on top
  isRecommended        Boolean?            @default(false) // Display recommended plan on top
  isTrial              Boolean?            @default(false) // Trial plan
  trialDays            Int?                @default(0) // Trial days
  isMonthly            Boolean?            @default(false) // Monthly plan
  monthlyPrice         Float?              @default(0) // Monthly price
  isYearly             Boolean?            @default(false) // Yearly plan
  yearlyPrice          Float?              @default(0) // Yearly price
  isCredit             Boolean?            @default(false) // Credit plan
  creditAllouedByMonth Int?                @default(0) // Monthly credit
  currency             String?             @default("usd")
  active               Boolean?            @default(false) // Active plan
  createdAt            DateTime?           @default(now())
  updatedAt            DateTime?           @updatedAt
  */
