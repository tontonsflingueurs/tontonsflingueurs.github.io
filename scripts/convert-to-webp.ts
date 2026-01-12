import { readdir, readFile, writeFile } from "fs/promises";
import { extname, join } from "path";
import sharp from "sharp";

const PUBLIC_DIR = join(process.cwd(), "public");

async function convertPngsToWebp() {
  console.log("🖼️  Starting PNG to WebP conversion...\n");

  const stats = {
    converted: 0,
    skipped: 0,
    errors: 0,
    totalOriginalSize: 0,
    totalWebpSize: 0,
  };

  async function processDirectory(dir: string) {
    try {
      const files = await readdir(dir, { withFileTypes: true });

      for (const file of files) {
        const fullPath = join(dir, file.name);

        if (file.isDirectory()) {
          await processDirectory(fullPath);
        } else if (extname(file.name).toLowerCase() === ".png") {
          try {
            const originalBuffer = await readFile(fullPath);
            const originalSize = originalBuffer.length;

            const webpBuffer = await sharp(originalBuffer)
              .webp({ quality: 90 })
              .toBuffer();

            const webpSize = webpBuffer.length;
            const webpPath = fullPath.replace(/\.png$/i, ".webp");

            await writeFile(webpPath, webpBuffer);

            const reduction = (
              ((originalSize - webpSize) / originalSize) *
              100
            ).toFixed(1);

            console.log(
              `✅ ${file.name.padEnd(40)} ${(originalSize / 1024).toFixed(1).padStart(8)}KB → ${(webpSize / 1024).toFixed(1).padStart(8)}KB (${reduction}% reduction)`
            );

            stats.converted++;
            stats.totalOriginalSize += originalSize;
            stats.totalWebpSize += webpSize;
          } catch (error) {
            console.error(
              `❌ Error converting ${file.name}:`,
              error instanceof Error ? error.message : error
            );
            stats.errors++;
          }
        }
      }
    } catch (error) {
      console.error(
        `Error reading directory ${dir}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  await processDirectory(PUBLIC_DIR);

  console.log("\n📊 Conversion Summary:");
  console.log(`   Converted: ${stats.converted} files`);
  console.log(`   Errors: ${stats.errors}`);
  console.log(
    `   Total original size: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(
    `   Total WebP size: ${(stats.totalWebpSize / 1024 / 1024).toFixed(2)}MB`
  );
  console.log(
    `   Overall reduction: ${(((stats.totalOriginalSize - stats.totalWebpSize) / stats.totalOriginalSize) * 100).toFixed(1)}%`
  );
  console.log(
    `   Space saved: ${((stats.totalOriginalSize - stats.totalWebpSize) / 1024 / 1024).toFixed(2)}MB\n`
  );
}

convertPngsToWebp().catch(console.error);
