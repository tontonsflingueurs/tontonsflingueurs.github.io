import { defineConfig, defineDocs, frontmatterSchema, metaSchema } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { z } from 'zod';
import remarkFrenchTypography from './lib/remark-french-typography';

// Schema etendu pour le blog
const blogFrontmatterSchema = frontmatterSchema.extend({
  date: z.string().optional(),
  authors: z.array(z.string()).optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Schema etendu pour le wiki (avec image optionnelle)
const wikiFrontmatterSchema = frontmatterSchema.extend({
  image: z.string().optional(),
});

// Collection Wiki (docs)
export const docs = defineDocs({
  dir: 'content/wiki',
  docs: {
    schema: wikiFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

// Collection Blog
export const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: blogFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkFrenchTypography],
  },
  plugins: [lastModified()],
});
