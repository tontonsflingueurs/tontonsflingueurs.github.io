// Utilitaire pour identifier l'environnement local vs production
export const isDev = process.env.NODE_ENV === "development";

// Prefixe le titre avec [DEV] en mode dev pour identifier l'environnement
export function devTitle(title: string): string {
  return isDev ? `🚧 ${title} 🚧` : title;
}
