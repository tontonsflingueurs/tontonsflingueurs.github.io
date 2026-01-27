#!/usr/bin/env bun

/**
 * Script de normalisation des articles de blog selon le template
 *
 * Corrections appliquées :
 * - Supprime les ** dans les descriptions du frontmatter
 * - Supprime les doublons titre/description après l'image
 * - Convertit les titres en gras MAJUSCULES en H2
 * - Convertit les catégories connues en H2
 * - Convertit les éléments (niveaux, unités, sorts) en H3 🔸
 * - Ajoute des séparateurs --- entre les sections H2
 * - Normalise les espaces et "Pourquoi ?"
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BLOG_DIR = join(process.cwd(), "content/blog/articles");

/**
 * Catégories typiques d'articles d'équilibrage (pour conversion en H2)
 */
const CATEGORY_PATTERNS = [
  /^bonus$/i,
  /^sorts?$/i,
  /^artefacts?$/i,
  /^unités?$/i,
  /^perks?\s*(\(.+\))?$/i,
  /^atouts?$/i,
  /^héros$/i,
  /^talents?\s+(de\s+)?/i,
  /^caractéristiques/i,
  /^nouvelle\s+unité/i,
  /^nouveaux?\s+/i,
  /^changements?/i,
];

/**
 * Vérifie si un titre est une catégorie (devrait être H2)
 */
function isCategory(title: string): boolean {
  const cleanTitle = title.trim();
  return CATEGORY_PATTERNS.some((pattern) => pattern.test(cleanTitle));
}

/**
 * Convertit un titre MAJUSCULES en Title Case
 */
function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(^|\s|[–-])\p{L}/gu, (char) => char.toUpperCase());
}

/**
 * Extrait la description du frontmatter
 */
function extractDescription(content: string): string | null {
  const match = content.match(/^description:\s*"([^"]+)"/m);
  if (match) {
    // Retirer les ** si présents
    return match[1].replace(/^\*\*/, "").replace(/\*\*$/, "").trim();
  }
  return null;
}

/**
 * Normalise le contenu d'un article selon le template
 */
function normalizeArticle(content: string): string {
  let normalized = content;

  // ============================================================
  // ÉTAPE 0 : Nettoyer le frontmatter
  // ============================================================

  // 0a. Supprimer tous les ** dans la description (gras non supporté dans frontmatter)
  normalized = normalized.replace(/^(description:\s*")([^"]*)(")$/m, (_match, start, desc, end) => {
    return start + desc.replace(/\*\*/g, "") + end;
  });

  // 0b. Supprimer les doublons après l'image (texte qui répète la description)
  const description = extractDescription(normalized);
  if (description) {
    // Pattern : après ZoomableImage, supprimer la ligne qui répète la description
    // Avec ou sans ** autour
    const escapedDesc = description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const duplicatePattern = new RegExp(`(<ZoomableImage[^>]*/>\\s*\\n\\n?)\\*\\*${escapedDesc}\\*\\*\\n*`, "i");
    normalized = normalized.replace(duplicatePattern, "$1");

    // Aussi sans les **
    const duplicatePatternNoStars = new RegExp(`(<ZoomableImage[^>]*/>\\s*\\n\\n?)${escapedDesc}\\n*`, "i");
    normalized = normalized.replace(duplicatePatternNoStars, "$1");
  }

  // ============================================================
  // ÉTAPE 1 : Convertir les titres MAJUSCULES en gras → H2
  // ============================================================

  // Titres entièrement en MAJUSCULES entre ** → H2 (Title Case)
  normalized = normalized.replace(/^\*\*([A-ZÉÈÊËÀÂÔÙÛÇÏ\s–\-—:]+)\*\*$/gm, (_match, title) => {
    const cleanTitle = title.trim();
    // Si c'est tout en majuscules, convertir en Title Case
    if (cleanTitle === cleanTitle.toUpperCase()) {
      return `## ${toTitleCase(cleanTitle)}`;
    }
    return `## ${cleanTitle}`;
  });

  // ============================================================
  // ÉTAPE 2 : Convertir les H3 qui sont des catégories → H2
  // ============================================================

  // ### 🔸 Talents de la Valkyrie → ## Talents de la Valkyrie
  normalized = normalized.replace(/^###\s*🔸?\s*(.+)$/gm, (_match, title) => {
    const cleanTitle = title.trim().replace(/:$/, ""); // Enlever : final
    if (isCategory(cleanTitle)) {
      return `## ${cleanTitle}`;
    }
    // Garder comme H3 avec 🔸
    return `### 🔸 ${cleanTitle}`;
  });

  // ============================================================
  // ÉTAPE 3 : Convertir les patterns d'éléments en gras → H3 🔸
  // ============================================================

  // **Niveau 9.** ou **Niveau 9** → ### 🔸 Niveau 9
  normalized = normalized.replace(/^\*\*Niveau\s+(\d+)\.?\*\*$/gm, "### 🔸 Niveau $1");

  // **Nom (Amélioré)** → ### 🔸 Nom (Amélioré)
  normalized = normalized.replace(
    /^\*\*\s*([^*\n]+?)\s*\((Améliorée?|Affaiblie?|Ajusté)\)\s*\*\*$/gm,
    (_match, name, status) => {
      // Normaliser le statut
      let normalizedStatus = status;
      if (status.match(/Améliorée?/i)) normalizedStatus = "Amélioré";
      if (status.match(/Affaiblie?/i)) normalizedStatus = "Affaibli";
      return `### 🔸 ${name.trim()} (${normalizedStatus})`;
    },
  );

  // **Nom d'élément** en début de ligne (potentiel H3)
  // Ne pas convertir si c'est une catégorie
  normalized = normalized.replace(/^\*\*([^*\n]+)\*\*$/gm, (_match, title) => {
    const cleanTitle = title.trim();

    // Si c'est une catégorie, convertir en H2
    if (isCategory(cleanTitle)) {
      return `## ${cleanTitle}`;
    }

    // Si c'est "Pourquoi ?", ne pas convertir
    if (cleanTitle.toLowerCase().includes("pourquoi")) {
      return `_${cleanTitle}_`;
    }

    // Sinon, vérifier si c'est un nom d'élément (unité, sort, etc.)
    // Les éléments sont généralement suivis de stats ou descriptions
    return `### 🔸 ${cleanTitle}`;
  });

  // ============================================================
  // ÉTAPE 4 : Nettoyage des H3
  // ============================================================

  // Assurer que tous les H3 ont 🔸 (sauf ceux convertis en H2)
  normalized = normalized.replace(/^###\s+(?!🔸)([^\n]+)/gm, "### 🔸 $1");

  // Supprimer les 🔸 doubles
  normalized = normalized.replace(/🔸\s*🔸/g, "🔸");

  // Supprimer les : à la fin des titres H3
  normalized = normalized.replace(/^(### 🔸 [^\n]+):$/gm, "$1");

  // ============================================================
  // ÉTAPE 5 : Séparateurs entre sections H2
  // ============================================================

  // Ajouter --- avant chaque H2 (sauf si déjà présent)
  normalized = normalized.replace(/\n(?!---\n)(## [^\n]+)/g, "\n---\n$1");

  // Supprimer les doubles séparateurs
  normalized = normalized.replace(/---\n+---/g, "---");

  // Supprimer le séparateur juste après le frontmatter
  normalized = normalized.replace(/(---\n\n)---\n/g, "$1");

  // ============================================================
  // ÉTAPE 6 : Normalisation finale
  // ============================================================

  // Normaliser "Pourquoi ?" en italique
  normalized = normalized.replace(/\*\*\s*Pourquoi\s*\?\s*\*\*/gi, "_Pourquoi ?_");
  normalized = normalized.replace(/^####\s*_Pourquoi\s*\?_$/gm, "\n_Pourquoi ?_");

  // Normaliser les espaces : max 2 lignes vides consécutives
  normalized = normalized.replace(/\n{4,}/g, "\n\n\n");

  // Supprimer les espaces en fin de ligne
  normalized = normalized.replace(/ +$/gm, "");

  // S'assurer qu'il y a une ligne vide avant chaque H2 et H3
  normalized = normalized.replace(/([^\n])\n(##\s)/g, "$1\n\n$2");
  normalized = normalized.replace(/([^\n])\n(### 🔸)/g, "$1\n\n$2");

  // Corriger les titres avec emoji alternatifs (▪️, ▫️, etc.)
  normalized = normalized.replace(/^▪️\s*\*\*\s*([^*\n]+?)\s*\*\*$/gm, "### 🔸 $1");

  // Corriger les astérisques multiples orphelins
  normalized = normalized.replace(/\*\*\*\*/g, "**");

  return normalized;
}

/**
 * Parcourt récursivement les dossiers pour trouver les fichiers .mdx
 */
async function findMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMdxFiles(fullPath)));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  console.log("🔍 Recherche des articles à normaliser...\n");

  const mdxFiles = await findMdxFiles(BLOG_DIR);
  console.log(`📄 ${mdxFiles.length} articles trouvés\n`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const filePath of mdxFiles) {
    try {
      const original = await readFile(filePath, "utf-8");
      const normalized = normalizeArticle(original);

      // Ne mettre à jour que si le contenu a changé
      if (original !== normalized) {
        await writeFile(filePath, normalized, "utf-8");
        console.log(`✅ Normalisé : ${filePath.replace(BLOG_DIR, "")}`);
        updatedCount++;
      }
    } catch (error) {
      console.error(`❌ Erreur sur ${filePath}:`, error);
      errorCount++;
    }
  }

  console.log(`\n✨ Terminé !`);
  console.log(`   ${updatedCount} articles mis à jour`);
  console.log(`   ${mdxFiles.length - updatedCount} articles déjà conformes`);
  if (errorCount > 0) {
    console.log(`   ${errorCount} erreurs`);
  }
}

main().catch(console.error);
