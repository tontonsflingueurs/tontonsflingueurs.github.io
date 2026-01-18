# Template pour un article de blog

Copiez ce fichier et renommez-le en `.mdx` (par exemple: `mon-article.mdx`)

---

## Instructions

1. Copiez ce fichier dans le dossier `content/blog/`
2. Renommez-le avec l'extension `.mdx` (exemple: `mon-article.mdx`)
3. Modifiez le contenu ci-dessous
4. Supprimez ces instructions

---

```mdx
---
title: Titre de votre article
description: Une description courte de l'article (apparait dans les aperçus)
date: '2025-01-03'
author: Votre Nom
---

Ecrivez ici l'introduction de votre article.

## Section principale

Le contenu de votre article...

### Sous-titre

Plus de details...

## Images

Pour ajouter une image :

1. Placez l'image dans le dossier `public/blog/`
2. Referencez-la comme ceci : `<ZoomableImage src="/blog/<le-nom-de-mon-image>.png" alt="donner un descriptif rapide" />`

## Liens

- [Lien externe](https://example.com)
- [Lien vers le wiki](/wiki)

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

## Conseils

- Choisissez un titre accrocheur
- La description doit etre concise (1-2 phrases)
- N'oubliez pas de mettre votre nom dans `author`
- Utilisez des sous-titres pour structurer votre contenu
