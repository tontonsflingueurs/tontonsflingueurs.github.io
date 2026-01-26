# Guide de rédaction — Article de blog

Ce document regroupe les principes à respecter pour rédiger un article de blog cohérent avec les autres.

---

## Création du fichier

1. Créez un fichier `.mdx` dans `content/blog/articles/`
2. Nommez-le au format `YYYY-MM-DD-titre.mdx` (exemple : `2026-01-22-equilibrage-saison-67.mdx`)

---

## Frontmatter

```yaml
---
title: "Titre de votre article"
description: "Description courte (1-2 phrases, apparaît dans les aperçus)"
date: "2026-01-22"
tags: [équilibrage]
---
```

### Champs disponibles

| Champ         | Obligatoire | Description                                             |
| ------------- | ----------- | ------------------------------------------------------- |
| `title`       | Oui         | Titre de l'article (entre guillemets)                   |
| `description` | Oui         | Description courte (1-2 phrases)                        |
| `date`        | Oui         | Date au format `"YYYY-MM-DD"`                           |
| `tags`        | Non         | Catégories (voir liste ci-dessous)                      |
| `authors`     | Non         | Tableau d'IDs auteurs (ex: `[mahzazel]`)                |
| `image`       | Non         | Chemin vers la bannière (défaut : `/blog/default.webp`) |

### Tags courants

`équilibrage`, `mise-à-jour`, `pass-gratuit`, `pass-premium`, `système`, `objets`, `pvp`, `panthéon`, `compte`, `unité`

### Auteurs

Par simplicité, il est recommandé de ne pas renseigner le champ `authors`. L'avatar par défaut sera utilisé.

Si vous souhaitez tout de même associer un auteur, ajoutez-le d'abord dans le fichier `utils/authors.ts` avec le format suivant :

```typescript
votre_id: {
  name: "Votre Nom",
  github: "votre-github",
  role: "Votre rôle",
},
```

Puis référencez-le dans le frontmatter : `authors: [votre_id]`

---

## Structure de l'article

### Introduction

Après le frontmatter, commencez par une courte introduction en texte libre. Utilisez le **gras** pour mettre en avant les éléments importants.

### Image principale

Placez une image juste après l'introduction si pertinent :

```mdx
<ZoomableImage src="/blog/mon-image.webp" alt="description de l'image" />
```

### Séparateurs

Utilisez `---` pour séparer visuellement chaque section de niveau 2 (`##`).

### Titres de niveau 2 (`##`)

Pour les grandes catégories de contenu :

```mdx
---
## Sorts
---

## Artefacts

---

## Unités
```

### Titres de niveau 3 (`### 🔸`)

Pour chaque sous-élément, utilisez l'emoji 🔸 suivi du nom :

```mdx
### 🔸 Nom de l'élément

### 🔸 Nom de l'élément (Amélioré)

### 🔸 Nom de l'élément (Affaibli)
```

---

## Mise en forme du contenu

### Changements de valeurs

Mettez les valeurs en gras avec une flèche `→` :

```mdx
Dégâts de base augmentés : **230 → 276**
(au niveau max : **1823 → 2187**)
```

### Changements multiples

Utilisez des listes à puces :

```mdx
- Chance de base augmentée : **27,5 % → 33,5 %**
- Chance bonus par niveau augmentée : **2,5 % → 3,5 %**
- Chances finales : **27,5 % – 50 % → 33,5 % – 65 %**
```

### Explications (optionnel)

Pour expliquer un changement, ajoutez un bloc `_Pourquoi ?_` en italique coloré :

```mdx
_Pourquoi ?_

Explication du changement et de son impact sur le jeu.
```

---

## Images

1. Convertissez votre image en `.webp` ([convertio.co](https://convertio.co/fr/png-webp/))
2. Placez-la dans le dossier `public/blog/`
3. Référencez-la avec le composant `ZoomableImage` :

```mdx
<ZoomableImage src="/blog/mon-image.webp" alt="description" />
```

Variantes disponibles :

- `variant="centered"` : image centrée, max 70 % de largeur (par défaut)
- `variant="banner"` : pleine largeur

---

## Exemple de structure complète

```mdx
---
title: "Équilibrages de la Saison 67"
description: "Saison 67 : ajustements d'équilibrage, sorts, artefacts et unités"
date: "2026-01-22"
tags: [équilibrage]
---

Introduction courte avec les **éléments importants** en gras.

<ZoomableImage src="/blog/equilibrage-saison-67.webp" alt="équilibrage saison 67" />

---

## Catégorie 1

### 🔸 Élément A

Changement décrit : **ancienne valeur → nouvelle valeur**

### 🔸 Élément B (Amélioré)

Dégâts augmentés : **100 → 150**
(au niveau max : **500 → 750**)

_Pourquoi ?_

Explication du changement.

---

## Catégorie 2

### 🔸 Élément C

- Stat 1 augmentée : **10 → 15**
- Stat 2 réduite : **50 → 40**
```

---

## Conseils

- Les images doivent être en `.webp` (pas PNG/JPG)
- Utilisez le gras pour les valeurs numériques et éléments importants
- Séparez toujours les sections `##` avec des `---`
- Restez concis dans les descriptions
