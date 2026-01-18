# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TTF Wiki - A Next.js 16 community wiki and blog for "Tontons Flingueurs" using Fumadocs MDX for content management.

## Commands

```bash
bun dev          # Start dev server (localhost:3000)
bun bundle       # Production build
bun types:check  # Type check (runs fumadocs-mdx first)
bun lint         # Lint with Oxlint
bun lint:fix     # Auto-fix lint issues
bun format       # Format with Oxfmt
```

ALWAYS use bun for commands. NEVER use npm/yarn/pnpm.

## Code Style

- **Comments**: ALWAYS write comments in French only. NEVER write comments in English.
- Code should be self-explanatory when possible, with French comments for complex logic.

## Architecture

### Two Content Collections (source.config.ts)

1. **Wiki** (`content/wiki/`) → `/wiki` routes
   - Standard frontmatter: title, description, icon (Lucide name)

2. **Blog** (`content/blog/`) → `/blog` routes
   - Extended frontmatter: title, description, date, authors[], image, tags[]
   - Authors map to `utils/authors.ts`

Both loaded via `lib/source.ts` which exports `source` and `blogSource`.

### Theme System

7 color themes (red default, orange, green, cyan, purple, blue, black) with light/dark variants.

**To add a theme:**

1. Add entry to `lib/themes.ts`
2. Add CSS variables in `global.css` under `[data-theme="name"]`
3. Update `validThemes` in `app/layout.tsx` inline script

Theme uses CSS variables: `--color-fd-primary`, `--color-fd-accent`, `--color-fd-ring`, etc.

### MDX Components (mdx-components.tsx)

Custom components available in MDX:

- `<BlogCards limit={n} />` - Grid of blog posts
- `<ZoomableImage src="" alt="" variant="centered|banner" />` - Zoomable image with variants
  - `variant="centered"` (default) - Centered, max 70% width
  - `variant="banner"` - Full width, aspect-video
- `<strong>` - Styled with theme color (text-fd-primary)
- All fumadocs-ui components (Cards, Card, Callout, etc.)

### Remark Plugins (source.config.ts)

- `remark-french-typography` - Auto-adds non-breaking spaces before `: ; ! ?` and around `« »`

### Key Files

- `source.config.ts` - Collection schemas, MDX plugins
- `lib/source.ts` - Fumadocs loaders
- `lib/themes.ts` - Theme definitions (single source of truth)
- `utils/authors.ts` - Author registry with GitHub avatars
- `components/layout-shared.tsx` - Shared navbar config

## Content Management

Add `.mdx` files to `content/blog/articles/` or `content/wiki/` - routes auto-generated.

Blog frontmatter example:

```yaml
title: 'Article Title'
description: 'Short description'
date: '2025-01-03'
authors: [mathias]
image: /blog/image.webp
tags: [tag1, tag2]
```

Navigation structure defined by `meta.json` files in content directories.
