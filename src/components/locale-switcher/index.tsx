"use client";

import { useEffect, useState, useTransition } from "react";
import { type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { setUserLocale } from "@/i18n/locale";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CheckIcon, LanguagesIcon } from "lucide-react";

interface ILocaleSwitcherProps {
  defaultValue: Locale;
  items: Array<{ value: Locale; label: string }>;
  className?: string;
}

export const LocaleSwitcher = ({
  defaultValue,
  items,
  className,
}: ILocaleSwitcherProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (value: Locale) => {
    startTransition(async () => {
      try {
        await setUserLocale(value);
        setSelectedValue(value);
      } catch (error) {
        console.error("Failed to update locale:", error);
      }
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Switch language"
          className={cn(
            className,
            isPending && "opacity-50",
            "p-2 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 opacity-100"
          )}
        >
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-20">
        <DropdownMenuGroup>
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleChange(item.value)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{item.label}</span>
              {selectedValue === item.value && <CheckIcon className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
