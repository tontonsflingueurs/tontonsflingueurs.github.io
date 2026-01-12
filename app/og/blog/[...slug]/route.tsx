import { blogSource } from "@/lib/source";
import { DEFAULT_IMAGE } from "@/utils/constants";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Requis pour static export
export const dynamic = "force-static";

/**
 * Convertit une image locale en data URL base64
 */
function getLocalImageAsDataUrl(imagePath: string): string {
  const fullPath = join(process.cwd(), "public", imagePath);
  try {
    const imageBuffer = readFileSync(fullPath);
    const ext = imagePath.split(".").pop()?.toLowerCase() || "png";
    let mimeType = `image/${ext}`;
    if (ext === "jpg" || ext === "jpeg") {
      mimeType = "image/jpeg";
    } else if (ext === "webp") {
      mimeType = "image/webp";
    }
    return `data:${mimeType};base64,${imageBuffer.toString("base64")}`;
  } catch {
    // Fallback si l'image n'existe pas
    return "";
  }
}

/**
 * Route API pour generer les images Open Graph (OG) des articles de blog.
 *
 * Genere une image OG (1200x630px) pour un article de blog
 * Si l'article a une image dans son frontmatter, elle sera utilisee.
 * Sinon, une image par defaut avec le titre sera generee.
 */
export async function GET(req: Request, { params }: RouteContext<"/og/blog/[...slug]">) {
  const { slug } = await params;
  const page = blogSource.getPage(slug.slice(0, -1));
  if (!page) notFound();

  const imagePath = page.data.image || DEFAULT_IMAGE;
  // Skip WebP images due to ImageResponse limitations with WebP data URLs
  const isWebP = imagePath.endsWith(".webp");
  const imageDataUrl = !isWebP ? getLocalImageAsDataUrl(imagePath) : "";

  // Si l'article a une image, on l'affiche avec un overlay pour le titre
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Image de fond */}
      {imageDataUrl && (
        <img
          src={imageDataUrl}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      {/* Overlay gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}
      />
      {/* Contenu texte */}
      <div
        style={{
          position: "relative",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ color: "#fff", fontSize: 48, fontWeight: 700 }}>{page.data.title}</div>
        {page.data.description && (
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 24 }}>{page.data.description}</div>
        )}
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 20 }}>Tontons Flingueurs</div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}

// Pre-genere les images OG au build pour tous les articles
export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: [...page.slugs, "image.webp"],
  }));
}
