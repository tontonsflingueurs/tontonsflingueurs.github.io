import { getPageImage, source } from "@/lib/source";
import { generate as DefaultImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

/**
 * Route API pour generer les images Open Graph (OG) des pages de documentation.
 *
 * Ces images sont utilisees comme preview lors du partage de liens sur Discord,
 * Twitter/X, Facebook, LinkedIn, etc.
 *
 * Exemple: partager https://tonsite.com/wiki/guides/premier-guide
 * affichera une image generee par /og/wiki/guides/premier-guide.webp
 * avec le titre et la description de la page.
 *
 * Pour personnaliser l'apparence, remplacer DefaultImage par un composant custom.
 */

// Requis pour static export
export const dynamic = "force-static";

// Genere une image OG (1200x630px) pour une page de docs
export async function GET(_req: Request, { params }: RouteContext<"/og/wiki/[...slug]">) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site="Tontons Flingueurs" />,
    {
      width: 1200,
      height: 630,
    },
  );
}

/**
 * Pre-genere les images OG au build pour toutes les pages de docs.
 */
export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments,
  }));
}
