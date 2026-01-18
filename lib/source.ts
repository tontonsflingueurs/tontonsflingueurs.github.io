import { loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { blog, docs } from 'fumadocs-mdx:collections/server';

// See https://fumadocs.dev/docs/headless/source-api for more info
// Source pour le Wiki (docs)
export const source = loader({
  baseUrl: '/wiki',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

// Source pour le Blog
export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});
