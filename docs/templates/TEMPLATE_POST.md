# Template pour un article de blog

Copiez ce fichier et renommez-le en `.mdx` (par exemple: `2025-01-12-mon-article.mdx`)

---

## Instructions

1. Copiez ce fichier dans le dossier `content/blog/articles/`
2. Renommez-le avec l'extension `.mdx` et au format `YYYY-MM-DD-titre.mdx`
3. Modifiez le contenu ci-dessous
4. Supprimez ces instructions

---

```mdx
---
title: Titre de votre article
description: Une description courte de l'article (apparait dans les aperçus)
date: "2025-01-12"
authors: [votre_id]
image: "/blog/mon-image.webp"
tags: [tag1, tag2]
---

Ecrivez ici l'introduction de votre article.

## Section principale

Le contenu de votre article...

### Sous-titre

Plus de details...

## Images

Pour ajouter une image zoomable :

\`\`\`mdx
<ZoomableImage 
  src="/blog/mon-image.webp" 
  alt="Description rapide" 
  variant="centered"
/>
\`\`\`

## Liens

- [Lien externe](https://example.com)
- [Lien vers le wiki](/wiki)
- [Lien vers un article](/blog/articles/autre-article)

## Code

\`\`\`javascript
// Exemple de code
const message = "Hello!";
console.log(message);
\`\`\`

## Conclusion

Terminez votre article ici.
```

---

## Format de la date

La date doit etre au format : `"AAAA-MM-JJ"`

Exemples :

- `"2025-01-03"` pour le 3 janvier 2025
- `"2025-12-25"` pour le 25 decembre 2025

---

## Métadonnées requises

### title
Titre de l'article (affiché en haut et dans les listes)

### description
Courte description (1-2 phrases) - utilisée dans les aperçus et les réseaux sociaux

### date
Date de publication au format `"YYYY-MM-DD"`

### authors
Liste des ID d'auteurs (voir `utils/authors.ts`)
```yaml
authors: [iokee, mahzazel]
```

### image
Chemin vers l'image en WebP (utilisée comme couverture)
```yaml
image: "/blog/mon-image.webp"
```

### tags
Tags pour catégoriser l'article
```yaml
tags: [guide, stratégie, événement]
```

---

## Conseils

- Choisissez un titre accrocheur et clair
- La description doit etre concise et engageante
- Utilisez des sous-titres (##, ###) pour structurer votre contenu
- Les images doivent etre en WebP et bien redimensionnées
- Relisez votre article avant de le soumettre
- Utilisez les tags pour faciliter la découverte

---

## Nom du fichier

Format recommandé : `YYYY-MM-DD-titre-de-larticle.mdx`

Exemples :
- `2025-01-12-guide-arènes.mdx`
- `2025-01-10-annonce-mise-a-jour.mdx`

Cela facilite l'organisation chronologique des articles.
