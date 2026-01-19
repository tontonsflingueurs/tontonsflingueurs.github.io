import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { DEFAULT_WIKI_IMAGE } from "@/utils/constants";
import { devTitle } from "@/utils/dev-title";
import { Image } from "fumadocs-core/framework";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { DocsBody, DocsDescription, DocsPage, DocsTitle, PageLastUpdate } from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();
  const lastModifiedTime = page.data.lastModified;

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} tableOfContent={{ style: "clerk" }} full={page.data.full}>
      {page.data.image && (
        <Image
          src={page.data.image}
          alt={page.data.title}
          className="w-[calc(100%)] max-w-none h-auto object-contain mb-2"
          height={10}
          width={10}
        />
      )}
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>

      <div className="mt-12 pt-6 border-t border-fd-border inline-flex items-center justify-between w-full">
        {lastModifiedTime && <PageLastUpdate date={lastModifiedTime} />}
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const imageUrl = page.data.image || DEFAULT_WIKI_IMAGE;
  const title = devTitle(page.data.title);

  return {
    title,
    description: page.data.description,
    openGraph: {
      title,
      description: page.data.description,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.data.description,
      images: [imageUrl],
    },
  };
}
