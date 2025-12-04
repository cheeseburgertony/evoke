"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: IThemeToggleProps) {
  const { resolvedTheme, systemTheme, setTheme } = useTheme();

  const handleChangeTheme = () => {
    let nextTheme = "system";
    if (resolvedTheme === "light" && resolvedTheme === systemTheme) {
      nextTheme = "dark";
    } else if (resolvedTheme === "dark" && resolvedTheme === systemTheme) {
      nextTheme = "light";
    } else {
      nextTheme = "system";
    }
    setTheme(nextTheme);
  };

  return (
    <Button
      className={cn(className, "rounded-full")}
      variant="ghost"
      size="icon"
      onClick={handleChangeTheme}
    >
      {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
