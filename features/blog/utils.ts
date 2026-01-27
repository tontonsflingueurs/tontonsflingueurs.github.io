import type { StructuredData } from "fumadocs-core/mdx-plugins";

export function estimateReadingTime(structuredData: StructuredData): number {
  const wordsPerMinute = 200;

  // Extraire tout le texte du structuredData
  let text = "";

  // Contenu des headings
  if (structuredData.headings) {
    text += structuredData.headings.map((h) => h.content).join(" ");
  }

  // Contenu principal
  if (structuredData.contents) {
    text += " " + structuredData.contents.map((c) => c.content).join(" ");
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
