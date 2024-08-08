"use client";
import { toaster } from "@/src/components/ui/@blitzinit/toaster/ToastConfig";
import { Button } from "@/src/components/ui/@shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/@shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/@shadcn/popover";
import { updateAppSettings } from "@/src/helpers/db/appSettings.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import languages from "@/src/lib/intl/languages.json";
import { useAppSettingsStore } from "@/src/stores/appSettingsStore";
import { ChevronsUpDown, Flag } from "lucide-react";
import { useEffect, useState } from "react";

export const DefaultLocale = () => {
  const { appSettings, setAppSettings } = useAppSettingsStore();
  const [open, setOpen] = useState(false);
  const [comboLanguage, setComboLanguage] = useState(
    appSettings.defaultLocale ?? "en"
  );

  useEffect(() => {
    setComboLanguage(appSettings.defaultLocale ?? "en");
  }, [appSettings.defaultLocale]);

  const handleChange = async (currentValue: string) => {
    const dataToSet = await updateAppSettings({
      data: {
        defaultLocale: currentValue,
      },
      secret: chosenSecret(),
    });
    if (dataToSet.data?.success) {
      setAppSettings({ ...appSettings, defaultLocale: currentValue });
      toaster({
        title: "DefaultLocale",
        icon: <Flag className="icon" />,
        description: `DefaultLocale updated to ${currentValue}`,
        type: "success",
      });
    } else {
      toaster({
        type: "error",
        description: "Failed to update DefaultLocale",
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between">
          {comboLanguage}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput placeholder="Search language..." />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.code}
                  value={language.code}
                  onSelect={(currentValue) => {
                    setAppSettings({ defaultLocale: currentValue });
                    setComboLanguage(language.code);
                    handleChange(currentValue);
                    setOpen(false);
                  }}>
                  {language.name_native} ({language.code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
