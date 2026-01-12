import { readdir, readFile, writeFile } from "fs/promises";
import { join, relative } from "path";

const ROOT_DIR = process.cwd();

// Search patterns: directories and file extensions to scan
const searchPatterns = {
  dirs: ["content", "components", "utils", "app"],
  extensions: [".mdx", ".jsx", ".tsx", ".ts"],
};

async function findFilesWithPngReferences(): Promise<string[]> {
  const filesWithPng: string[] = [];

  async function scanDirectory(dir: string) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          // Skip node_modules and hidden directories
          if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
            await scanDirectory(fullPath);
          }
        } else if (entry.isFile()) {
          const ext = join("", entry.name).slice(join("", entry.name).lastIndexOf("."));
          if (searchPatterns.extensions.includes(ext)) {
            try {
              const content = await readFile(fullPath, "utf-8");
              if (content.includes(".png")) {
                filesWithPng.push(fullPath);
              }
            } catch {
              // Skip files that can't be read
            }
          }
        }
      }
    } catch {
      // Skip directories that can't be read
    }
  }

  // Scan all pattern directories
  for (const dir of searchPatterns.dirs) {
    const fullPath = join(ROOT_DIR, dir);
    try {
      await scanDirectory(fullPath);
    } catch {
      // Skip if directory doesn't exist
    }
  }

  return filesWithPng;
}

/**
 * Remove comments from content to avoid replacing .png in comments
 */
function removeComments(content: string): string {
  return (
    content
      // Remove single-line comments (// ...)
      .replace(/\/\/.*$/gm, "")
      // Remove multi-line comments (/* ... */)
      .replace(/\/\*[\s\S]*?\*\//g, "")
  );
}

async function updateReferences() {
  console.log("🔍 Scanning for .png references in MDX/JSX/TSX files...\n");

  const filesToUpdate = await findFilesWithPngReferences();

  if (filesToUpdate.length === 0) {
    console.log("✨ No .png references found!\n");
    return;
  }

  console.log(`📄 Found ${filesToUpdate.length} file(s) with .png references\n`);
  console.log("🔄 Updating image references from .png to .webp...\n");

  let filesUpdated = 0;
  let replacementsCount = 0;

  for (const fullPath of filesToUpdate) {
    const relPath = relative(ROOT_DIR, fullPath);

    try {
      let content = await readFile(fullPath, "utf-8");
      const originalContent = content;

      // Remove comments from content to check replacements
      const contentWithoutComments = removeComments(content);

      // Replace image paths with .png to .webp only if not in comments
      content = content.replace(/(["/']\/[^"'\s]*).png/g, (match, prefix, offset) => {
        // Check if this offset position exists in content without comments
        // by verifying the same match appears in the cleaned content
        const posInOriginal = originalContent.indexOf(match, offset - 100);
        const posInClean = contentWithoutComments.indexOf(match);
        if (posInClean === -1 && posInOriginal !== -1) {
          // Not found in clean content but found in original = it's in a comment
          return match;
        }
        return prefix + ".webp";
      });

      // Count how many replacements were made (only count non-comment matches)
      const matches = removeComments(originalContent).match(/(["/']\/[^"'\s]*).png/g) || [];
      const replacements = matches.length;

      if (replacements > 0) {
        await writeFile(fullPath, content, "utf-8");
        filesUpdated++;
        replacementsCount += replacements;
        console.log(`✅ ${relPath.padEnd(55)} (${replacements} reference${replacements > 1 ? "s" : ""})`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${relPath}:`, error instanceof Error ? error.message : error);
    }
  }

  console.log("\n📊 Update Summary:");
  console.log(`   Files updated: ${filesUpdated}`);
  console.log(`   Total references updated: ${replacementsCount}`);
  console.log(`\n✨ All .png references have been updated to .webp!\n`);
}

updateReferences().catch(console.error);
