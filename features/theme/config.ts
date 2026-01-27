import type { ColorTheme } from "./types";

// La seule source de verite pour les themes
// Pour ajouter un theme:
// 1. Ajouter l'entree ici (avec la couleur primary pour l'apercu)
// 2. Ajouter les variables CSS dans global.css avec [data-theme="nom"]
// 3. Mettre a jour validThemes dans app/layout.tsx (script inline)
export const themes = [
  { value: "red", label: "Rouge", preview: "hsl(0, 80%, 38%)" },
  { value: "orange", label: "Orange", preview: "hsl(25, 95%, 50%)" },
  { value: "green", label: "Vert", preview: "hsl(142, 71%, 35%)" },
  { value: "cyan", label: "Cyan", preview: "hsl(185, 80%, 40%)" },
  { value: "purple", label: "Violet", preview: "hsl(270, 70%, 50%)" },
  { value: "blue", label: "Bleu", preview: "hsl(230, 80%, 62%)" },
  { value: "black", label: "Noir", preview: "hsl(0, 0%, 20%)" },
] as const satisfies readonly { value: ColorTheme; label: string; preview: string }[];

export const STORAGE_KEY = "color-theme";
export const DEFAULT_THEME: ColorTheme = "red";
export const VALID_THEMES = themes.map((t) => t.value);
