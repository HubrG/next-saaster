"use client";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import currencies from "@/src/jsons/currencies.json";
import { cn } from "@/src/lib/utils";
import { useSaasSettingsStore } from "@/src/stores/saasSettingsStore";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
type Props = {
  set: (value: string) => void;
};
export const SetCurrency = ({ set }: Props) => {
  const { saasSettings, setSaasSettings } = useSaasSettingsStore();
  const [open, setOpen] = useState(false);
  const [comboCurrency, setComboCurrency] = useState("");

  useEffect(() => {
    set(saasSettings.currency ?? "usd");
  }, [saasSettings, set]);

  useEffect(() => {
    setComboCurrency(saasSettings.currency ?? "usd");
  }, [saasSettings]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {saasSettings.currency ? comboCurrency : "Select currency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search currencie..." />
          <CommandEmpty>No currencie found.</CommandEmpty>
          <CommandGroup>
            {Object.entries(currencies).map(([currencyKey, name]) => (
              <CommandItem
                key={currencyKey}
                value={currencyKey}
                onSelect={(currentValue) => {
                  set(currentValue);
                  setComboCurrency(currencyKey);
                  setOpen(false);
                }}>
                <Check className={cn("mr-2 h-4 w-4")} />
                {name.name} ({name.sigle})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
