#!/usr/bin/env bun

/**
 * Script de normalisation des articles de blog selon le template
 *
 * Corrections appliquées :
 * - Remplace ** Titre ** par ### 🔸 Titre
 * - Ajoute des séparateurs --- entre les sections ##
 * - Normalise les emojis 🔸 dans les titres H3
 * - Supprime les espaces excessifs
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BLOG_DIR = join(process.cwd(), "content/blog/articles");

/**
 * Normalise le contenu d'un article selon le template
 */
function normalizeArticle(content: string): string {
  let normalized = content;

  // 1. Normaliser les titres en gras vers H3 avec 🔸
  // Patterns à remplacer : **Nom (Amélioré)**, **Nom (Affaibli)**, **Nom**
  normalized = normalized.replace(/^\*\*\s*([^*\n]+?)\s*\(Améliorée?\)\s*\*\*/gm, "### 🔸 $1 (Amélioré)");
  normalized = normalized.replace(/^\*\*\s*([^*\n]+?)\s*\(Affaiblie?\)\s*\*\*/gm, "### 🔸 $1 (Affaibli)");
  normalized = normalized.replace(/^\*\*\s*([^*\n]+?)\s*\(Ajusté\)\s*\*\*/gm, "### 🔸 $1 (Ajusté)");

  // 2. Normaliser les H3 existants avec emojis
  // Remplacer ### 🔸 **Nom** 🔸 par ### 🔸 Nom
  normalized = normalized.replace(/^###\s*🔸\s*\*\*\s*([^*\n]+?)\s*\*\*\s*🔸/gm, "### 🔸 $1");
  // Remplacer ### **Nom** par ### 🔸 Nom
  normalized = normalized.replace(/^###\s*\*\*\s*([^*\n]+?)\s*\*\*/gm, "### 🔸 $1");

  // 3. Ajouter 🔸 si manquant dans les H3
  normalized = normalized.replace(/^###\s+(?!🔸)([^\n]+)/gm, "### 🔸 $1");

  // 4. Corriger les "Pourquoi ?" cassés sur plusieurs lignes
  normalized = normalized.replace(
    /\*\*\s*([0-9]+\s*%\s*→\s*[0-9]+\s*%)\s*\n\s*Pourquoi\s*\?\s*\*\*/gm,
    "**$1**\n\n**Pourquoi ?**",
  );

  // 5. Ajouter des séparateurs --- avant les sections H2 (sauf si déjà présent)
  normalized = normalized.replace(/\n(##\s+[^\n]+)/g, (match, title) => {
    return `\n---\n${title}`;
  });

  // 6. Supprimer les doubles séparateurs
  normalized = normalized.replace(/---\n+---/g, "---");

  // 7. Supprimer les séparateurs juste après le frontmatter
  normalized = normalized.replace(/(---\n\n)---\n/g, "$1");

  // 8. Normaliser les espaces : max 2 lignes vides consécutives
  normalized = normalized.replace(/\n{4,}/g, "\n\n\n");

  // 9. Supprimer les espaces en fin de ligne
  normalized = normalized.replace(/ +$/gm, "");

  // 10. S'assurer qu'il y a une ligne vide avant chaque H3
  normalized = normalized.replace(/([^\n])\n(### 🔸)/g, "$1\n\n$2");

  // 11. Normaliser "Pourquoi ?" en italique coloré
  normalized = normalized.replace(/\*\*\s*Pourquoi\s*\?\s*\*\*/gi, "_Pourquoi ?_");
  // Corriger les "Pourquoi ?" en H4 italic
  normalized = normalized.replace(/^####\s*_Pourquoi\s*\?_$/gm, "\n_Pourquoi ?_");

  // 12. Supprimer les 🔸 des sections H3 qui sont en majuscules (ce sont des catégories)
  // Ces sections doivent rester en H3 mais sans 🔸
  normalized = normalized.replace(/^### 🔸 ([A-ZÉÈÊËÀÂÔÙÛÇ\s]+)$/gm, "### $1");

  // 13. Corriger les titres avec emoji alternatifs (▪️, ▫️, etc.)
  normalized = normalized.replace(/^▪️\s*\*\*\s*([^*\n]+?)\s*\*\*$/gm, "### 🔸 $1");

  // 14. Corriger les astérisques multiples orphelins
  normalized = normalized.replace(/\*\*\*\*/g, "**");

  // 15. Corriger les formatages cassés avec \*\* orphelins
  normalized = normalized.replace(/\\\*\\\*/g, "**");

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
