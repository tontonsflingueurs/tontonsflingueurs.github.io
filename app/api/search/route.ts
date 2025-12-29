import { blogSource, source } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";

export const revalidate = false;

/**
 * API de recherche avancée avec Orama en indexant les sources du wiki et du blog
 */
export const { staticGET: GET } = createSearchAPI("advanced", {
  language: "french",
  indexes: [
    // Index des docs
    ...source.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: "wiki",
    })),
    // Index du blog
    ...blogSource.getPages().map((page) => ({
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      id: page.url,
      structuredData: page.data.structuredData,
      tag: "blog",
    })),
  ],
});
