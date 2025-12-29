import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { blog, docs } from "fumadocs-mdx:collections/server";

// See https://fumadocs.dev/docs/headless/source-api for more info
// Source pour le Wiki (docs)
export const source = loader({
  baseUrl: "/wiki",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Source pour le Blog
export const blogSource = loader({
  baseUrl: "/blog",
  source: blog.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/wiki/${segments.join("/")}`,
  };
}

export function getBlogPageImage(page: InferPageType<typeof blogSource>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/blog/${segments.join("/")}`,
  };
}
