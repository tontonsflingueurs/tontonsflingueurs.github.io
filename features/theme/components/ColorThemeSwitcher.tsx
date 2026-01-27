"use client";

import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { themes } from "../config";
import { useColorTheme } from "../hooks/useColorTheme";

export function ColorThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const [open, setOpen] = useState(false);

  // Fermer le popover au scroll pour éviter le "sautillement"
  useEffect(() => {
    if (!open) return;

    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="Choisir le thème de couleur"
        className="inline-flex items-center justify-center rounded-md p-1.5 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4.5"
      >
        <Palette className="size-4.5" />
      </PopoverTrigger>
      <PopoverContent className="w-36 p-1" align="end">
        <div className="flex flex-col gap-0.5">
          {themes.map((theme) => (
            <button
              key={theme.value}
              type="button"
              onClick={() => setColorTheme(theme.value)}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-fd-accent ${
                colorTheme === theme.value ? "bg-fd-accent text-fd-accent-foreground" : "text-fd-muted-foreground"
              }`}
            >
              <span className="size-4 rounded-full border border-fd-border" style={{ backgroundColor: theme.value }} />
              <span>{theme.label}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
