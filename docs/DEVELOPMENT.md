# Guide de Développement

Ce document fournit les informations techniques pour développer et maintenir le wiki TTF.

## Architecture

Le wiki est construit avec :

- **[Next.js 16](https://nextjs.org/)** - Framework React moderne
- **[Fumadocs](https://fumadocs.dev/)** - Système de documentation avec support MDX
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS
- **[Bun](https://bun.sh/)** - Runtime JavaScript/package manager

### Deux Collections de Contenu

1. **Wiki** (`content/wiki/`) → Routes `/wiki`
   - Documentation statique
   - Frontmatter : `title`, `description`, `icon` (Lucide)

2. **Blog** (`content/blog/`) → Routes `/blog`
   - Articles avec date et auteurs
   - Frontmatter étendu : `title`, `description`, `date`, `authors[]`, `image`, `tags[]`

## Structure du Projet

```
.
├── app/                      # Routes Next.js et layouts
│   ├── (home)/              # Page d'accueil et pages statiques
│   ├── wiki/[[...slug]]/    # Routes documentation wiki
│   ├── blog/[[...slug]]/    # Routes blog
│   ├── og/                  # Génération images Open Graph
│   └── api/search/          # API de recherche
├── content/                 # Contenu MDX
│   ├── wiki/                # Pages wiki (guides, références)
│   └── blog/articles/       # Articles de blog
├── components/              # Composants React réutilisables
│   ├── zoomable-image.tsx   # Images zoomables personnalisées
│   └── layout-shared.tsx    # Navigation partagée
├── lib/                     # Utilitaires et configuration
│   ├── source.ts            # Loaders Fumadocs
│   ├── themes.ts            # Configuration des thèmes
│   └── ...
├── public/                  # Ressources statiques
│   ├── blog/                # Images des articles (WebP)
│   ├── wiki/                # Images du wiki (WebP)
│   └── ...
├── scripts/                 # Scripts d'optimisation
│   ├── convert-to-webp.ts   # Conversion PNG → WebP
│   └── update-mdx-refs.ts   # Mise à jour automatique des chemins
├── docs/                    # Documentation pour le projet
│   ├── DEVELOPMENT.md       # Ce fichier
│   ├── CONTRIBUTING.md      # Guide de contribution
│   └── templates/           # Templates pour créer du contenu
└── package.json             # Configuration du projet
```

## Installation

### Prérequis

- **Bun** 1.0+ ([installer](https://bun.sh))

### Mise en place

```bash
# 1. Cloner le repo
git clone https://github.com/tontonsflingueurs/wiki.git
cd wiki

# 2. Installer les dépendances
bun install

# 3. Démarrer le serveur de développement
bun dev

# 4. Ouvrir http://localhost:3000 dans le navigateur
```

## Scripts Disponibles

| Commande              | Description                                  |
| --------------------- | -------------------------------------------- |
| `bun dev`             | Démarrer le serveur de développement         |
| `bun bundle`          | Build production                             |
| `bun start`           | Démarrer le serveur en production            |
| `bun types:check`     | Vérifier les types TypeScript                |
| `bun lint`            | Linter le code (Oxlint)                      |
| `bun lint:fix`        | Corriger les erreurs de lint                 |
| `bun format`          | Formater le code (Oxfmt)                     |
| `bun img:convert`     | Convertir PNG → WebP                         |
| `bun img:update-refs` | Mettre à jour les chemins d'images           |
| `bun img:optimize`    | Optimiser les images (convert + update-refs) |

## Configuration

### Fichier Principal : `source.config.ts`

Contient la configuration des collections de contenu :

```typescript
// Schéma des métadonnées
// Pages wiki : title, description, icon
// Articles blog : + date, authors[], image, tags[]

// Plugins MDX
// - remark-french-typography : ajoute automatiquement les espaces insécables (FR)
```

### Thèmes

Les thèmes sont définis dans `lib/themes.ts`. Actuellement disponibles :

- Red (défaut)
- Orange
- Green
- Cyan
- Purple
- Blue
- Black

Chaque thème inclut les variantes light/dark.

**Pour ajouter un thème :**

1. Ajouter une entrée dans `lib/themes.ts`
2. Ajouter les variables CSS dans `global.css` sous `[data-theme="name"]`
3. Ajouter le thème dans `validThemes` dans `app/layout.tsx`

### Composants MDX Personnalisés

Disponibles dans tous les fichiers MDX :

#### `<BlogCards limit={n} />`

Affiche une grille des N derniers articles de blog.

```mdx
<BlogCards limit={3} />
```

#### `<ZoomableImage />`

Image avec zoom au clic, personnalisée pour le wiki.

```mdx
<ZoomableImage src='/wiki/screenshot.webp' alt='Description' variant='centered' />

<ZoomableImage src='/blog/banner.webp' alt='Banner' variant='banner' />
```

Variantes :

- `centered` (défaut) : Centrée, max 70% de largeur
- `banner` : Pleine largeur, aspect 16:9

#### Composants Fumadocs

Tous les composants de fumadocs-ui sont disponibles :

```mdx
<Card title='Titre'>Contenu</Card>

<Callout type='warning'>Attention !</Callout>
```

## Images et Optimisation

### Format WebP

Toutes les images doivent être en **WebP** pour optimiser les performances.

- Réduction de taille : **60-70%** par rapport à PNG
- Support navigateur : Excellent (99%+)

### Ajouter des images

1. **Convertir en WebP** (si nécessaire)

   ```bash
   bun run img:convert
   ```

2. **Placer dans** `public/blog/` ou `public/wiki/`

3. **Référencer dans MDX**
   ```mdx
   <ZoomableImage src='/blog/mon-image.webp' alt='...' />
   ```

### Script d'optimisation

`scripts/convert-to-webp.ts` :

- Scanne récursivement `public/`
- Convertit PNG → WebP (qualité 90)
- Reporte les gains de taille

`scripts/update-mdx-refs.ts` :

- Scanne automatiquement `.mdx`, `.tsx`, `.ts`
- Remplace les références `.png` → `.webp`
- Ignore les commentaires

Utilisation :

```bash
# Option 1 : Convertir les images
bun run img:convert

# Option 2 : Mettre à jour les références
bun run img:update-refs

# Option 3 : Tout d'un coup
bun run img:optimize
```

## Créer du Contenu

### Guide Wiki

```bash
# Utiliser le template
cp docs/templates/TEMPLATE_GUIDE.md content/wiki/mon-guide.mdx
```

Ouvrir le fichier et suivre les instructions.

Structure recommandée :

- Introduction
- Sections principales
- Conclusion/Résumé
- Liens vers pages connexes

### Article de Blog

```bash
# Utiliser le template
cp docs/templates/TEMPLATE_POST.md content/blog/articles/YYYY-MM-DD-mon-article.mdx
```

Dates recommandées pour les noms de fichiers.

Frontmatter requis :

- `title`
- `description`
- `date` (format `YYYY-MM-DD`)
- `authors` (tableau des IDs d'auteurs)
- `image` (chemin dans `/blog/`)
- `tags` (tableau de tags)

### Auteurs de Blog

Les auteurs sont définis dans `utils/authors.ts` :

```typescript
export const authors = {
  iokee: { name: "Iokee", ... },
  // ...
}
```

Ajouter un auteur avant de l'utiliser dans le frontmatter.

## Navigation

Définie dans les fichiers `meta.json` de chaque dossier :

```json
{
  "Guides": {
    "icon": "BookOpen",
    "children": {
      "premier-guide": "Premier Guide"
    }
  }
}
```

- Modifiez `meta.json` pour changer l'ordre et la structure
- Les icônes utilisent Lucide

## Build & Déploiement

### Build Local

```bash
bun bundle
```

Génère un dossier `out/` avec le site prêt pour production.

### GitHub Pages

Le déploiement est automatique via GitHub Actions (.github/workflows/deploy.yml) :

1. Push sur la branche `main`
2. GitHub Actions déclenche le build
3. Déploiement automatique sur https://tontonsflingueurs.github.io/

### Vérifier avant de pusher

```bash
# Vérifier les types
bun types:check

# Linter
bun lint

# Build complet
bun bundle
```

## Troubleshooting

### Images ne s'affichent pas

1. Vérifier que le fichier est en WebP
2. Vérifier le chemin : `/blog/...` ou `/wiki/...`
3. Relancer `bun dev`

### Build échoue

```bash
# Nettoyer les caches
rm -rf .next out node_modules
bun install
bun bundle
```

### Types TypeScript

```bash
# Vérifier les types
bun types:check

# Résoudre automatiquement
bun types:check --fix
```

## En savoir plus

- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs Docs](https://fumadocs.dev/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
