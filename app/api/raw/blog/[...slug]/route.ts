import { blogSource } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (match) {
    return content.slice(match[0].length).trimStart();
  }
  return content;
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = blogSource.getPage(slug);
  if (!page) notFound();

  const raw = await page.data.getText('raw');
  return new Response(stripFrontmatter(raw), {
    headers: { 'Content-Type': 'text/markdown' },
  });
}

export function generateStaticParams() {
  // Filtrer les pages sans slug (index) car [...slug] est obligatoire
  return blogSource.generateParams().filter((p) => p.slug && p.slug.length > 0);
}
