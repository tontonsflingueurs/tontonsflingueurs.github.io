import { PageActions } from "@/components/page-actions";
import { ZoomableImage } from "@/components/zoomable-image";
import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { DEFAULT_BLOG_IMAGE, GITHUB_REPO } from "@/utils/constants";
import { estimateReadingTime } from "@/utils/reading-time";
import { DocsBody, DocsDescription, DocsPage, DocsTitle, PageLastUpdate } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);
  if (!page) notFound();
  const lastModifiedTime = page.data.lastModified;

  const MDX = page.data.body;
  const imageUrl = page.data.image || DEFAULT_BLOG_IMAGE;
  const slugPath = page.slugs.length === 0 ? "index" : page.slugs.join("/");
  const githubEditUrl = `${GITHUB_REPO}/tree/main/content/blog/${slugPath}.mdx`;

  // Page d'index du blog (pas d'article)
  const isIndexPage = !params.slug || params.slug.length === 0;

  if (isIndexPage) {
    return (
      <DocsPage toc={page.data.toc} tableOfContent={{ style: "clerk" }} full={page.data.full}>
        <DocsBody>
          <MDX components={getMDXComponents({})} />
        </DocsBody>
      </DocsPage>
    );
  }

  // Page d'article
  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ style: "clerk" }}>
      <ZoomableImage src={imageUrl} alt={page.data.title} variant="banner" />

      <DocsTitle>{page.data.title}</DocsTitle>
      <div className="flex flex-col lg:flex-row lg:flex-wrap lg:items-center gap-2 text-sm text-fd-muted-foreground -mt-2">
        <div className="flex flex-wrap items-center gap-2">
          {page.data.date && (
            <time dateTime={page.data.date}>
              {new Date(page.data.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
          )}
          <span>•</span>
          <span>{estimateReadingTime(page.data.structuredData)} min de lecture</span>
          {page.data.authors && page.data.authors.length > 0 && (
            <>
              <span>•</span>
              <span>par {page.data.authors.join(", ")}</span>
            </>
          )}
        </div>
        <PageActions markdownUrl={`/api/raw${page.url}`} githubUrl={githubEditUrl} />
      </div>
      <DocsDescription className="-mb-1">{page.data.description}</DocsDescription>

      <DocsBody>
        <MDX components={getMDXComponents({})} />
      </DocsBody>

      <div className="mt-12 pt-6 border-t border-fd-border inline-flex items-center justify-between w-full">
        {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return blogSource.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);
  if (!page) notFound();

  const imageUrl = page.data.image || DEFAULT_BLOG_IMAGE;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: [imageUrl],
    },
  };
}
