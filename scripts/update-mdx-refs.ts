import { readdir, readFile, writeFile } from 'fs/promises';
import { join, relative } from 'path';
import { generateFilePathRegex, SUPPORTED_IMAGE_EXTENSIONS } from '../utils/image-extensions';

const ROOT_DIR = process.cwd();
const FILE_PATH_REGEX = generateFilePathRegex(SUPPORTED_IMAGE_EXTENSIONS);

// Search patterns: directories and file extensions to scan
const searchPatterns = {
  dirs: ['content', 'components', 'utils', 'app'],
  extensions: ['.mdx', '.jsx', '.tsx', '.ts'],
};

async function findFilesWithImageReferences(): Promise<string[]> {
  const filesWithImages: string[] = [];

  async function scanDirectory(dir: string) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          // Ignore node_modules et les répertoires cachés
          if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
            await scanDirectory(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = join('', entry.name).slice(join('', entry.name).lastIndexOf('.'));
          if (searchPatterns.extensions.includes(ext)) {
            try {
              const content = await readFile(fullPath, 'utf-8');
              if (SUPPORTED_IMAGE_EXTENSIONS.some((ext) => content.includes(ext))) {
                filesWithImages.push(fullPath);
              }
            } catch {
              // Ignore les fichiers qui ne peuvent pas être lus
            }
          }
        }
      }
    } catch {
      // Ignore les répertoires qui ne peuvent pas être lus
    }
  }

  // Scanne tous les répertoires du pattern
  for (const dir of searchPatterns.dirs) {
    const fullPath = join(ROOT_DIR, dir);
    try {
      await scanDirectory(fullPath);
    } catch {
      // Ignore si le répertoire n'existe pas
    }
  }

  return filesWithImages;
}

/**
 * Supprime les commentaires du contenu pour éviter de remplacer les extensions dans les commentaires
 */
function removeComments(content: string): string {
  return (
    content
      // Supprime les commentaires d'une ligne (// ...)
      .replace(/\/\/.*$/gm, '')
      // Supprime les commentaires multi-lignes (/* ... */)
      .replace(/\/\*[\s\S]*?\*\//g, '')
  );
}

async function updateReferences() {
  console.log('🔍 Scanning for image references (.png, .jpg, .jpeg) in MDX/JSX/TSX files...\n');

  const filesToUpdate = await findFilesWithImageReferences();

  if (filesToUpdate.length === 0) {
    console.log('✨ No image references found!\n');
    return;
  }

  console.log(`📄 Found ${filesToUpdate.length} file(s) with image references\n`);
  console.log('🔄 Updating image references to .webp...\n');

  let filesUpdated = 0;
  let replacementsCount = 0;

  for (const fullPath of filesToUpdate) {
    const relPath = relative(ROOT_DIR, fullPath);

    try {
      let content = await readFile(fullPath, 'utf-8');
      const originalContent = content;

      // Supprime les commentaires du contenu pour vérifier les remplacements
      const contentWithoutComments = removeComments(content);

      // Remplace les chemins d'images avec tous les formats en .webp seulement s'ils ne sont pas dans les commentaires
      content = content.replace(FILE_PATH_REGEX, (match, prefix, ext, offset) => {
        // Vérifie si cette position de décalage existe dans le contenu sans commentaires
        // en vérifiant que la même correspondance apparaît dans le contenu nettoyé
        const posInOriginal = originalContent.indexOf(match, offset - 100);
        const posInClean = contentWithoutComments.indexOf(match);
        if (posInClean === -1 && posInOriginal !== -1) {
          // Non trouvé dans le contenu nettoyé mais trouvé dans l'original = c'est dans un commentaire
          return match;
        }
        return prefix + '.webp';
      });

      // Compte combien de remplacements ont été faits (ne compte que les correspondances hors commentaires)
      const matches = removeComments(originalContent).match(FILE_PATH_REGEX) || [];
      const replacements = matches.length;

      if (replacements > 0) {
        await writeFile(fullPath, content, 'utf-8');
        filesUpdated++;
        replacementsCount += replacements;
        console.log(`✅ ${relPath.padEnd(55)} (${replacements} reference${replacements > 1 ? 's' : ''})`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${relPath}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log('\n📊 Update Summary:');
  console.log(`   Files updated: ${filesUpdated}`);
  console.log(`   Total references updated: ${replacementsCount}`);
  console.log(`\n✨ All image references have been updated to .webp!\n`);
}

updateReferences().catch(console.error);
