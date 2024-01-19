"use client";
import { Button } from "@/src/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useEffectOnce } from 'react-use';

export const ThemeToggle  = () => {
  const { setTheme, theme } = useTheme();
  const [colorTheme, setColorTheme] = useState<string>("");
  const fetchTheme = async () =>  {
    const res = await fetch(process.env.NEXT_PUBLIC_URI + "/api/getCssTheme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setColorTheme(data);
  };
  useEffectOnce(() => {
    if (colorTheme === "") {
      fetchTheme();
    }
  });
  useEffect(() => {
    if (colorTheme !== "" && typeof window !== "undefined") {
      const html = document.getElementsByTagName("html")[0].classList;
      html.remove("pink2", "grayscale")
      html.add(colorTheme);
    }
  }, [colorTheme]);
  
  
  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}>
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};
