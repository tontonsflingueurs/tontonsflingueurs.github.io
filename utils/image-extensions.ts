/**
 * Extensions d'image supportées pour la conversion en WebP
 * Utilisé par les scripts de conversion et de mise à jour de références
 */
export const SUPPORTED_IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"] as const;

/**
 * Génère un pattern regex à partir des extensions
 * Convertit ['.png', '.jpg', '.jpeg'] en pattern comme (png|jpe?g)
 */
export function generateExtensionPattern(extensions: readonly string[]): string {
  const cleanedExts = extensions.map((ext) => ext.replace(/^\./, ""));
  return `(${cleanedExts.join("|").replace(/jpe?g/, "jpe?g")})`;
}

/**
 * Génère une regex de correspondance de fichier pour les chemins
 * Pattern: /(["/']\/[^"'\s]*)\.EXTENSION_PATTERN/gi
 */
export function generateFilePathRegex(extensions: readonly string[]): RegExp {
  const pattern = generateExtensionPattern(extensions);
  return new RegExp(`(["/']\/[^"'\\s]*)\\.${pattern}`, "gi");
}

/**
 * Génère une regex de remplacement de fichier pour les chemins
 * Pattern: /\.EXTENSION_PATTERN$/i
 */
export function generateFileReplacementRegex(extensions: readonly string[]): RegExp {
  const pattern = generateExtensionPattern(extensions);
  return new RegExp(`\\.${pattern}$`, "i");
}
