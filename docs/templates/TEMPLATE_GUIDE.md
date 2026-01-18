# Template pour un guide

Copiez ce fichier et renommez-le en `.mdx` (par exemple: `mon-guide.mdx`)

---

## Instructions

1. Copiez ce fichier dans le dossier `content/wiki/guides/`
2. Renommez-le avec l'extension `.mdx` (exemple: `mon-guide.mdx`)
3. Modifiez le contenu ci-dessous
4. Supprimez ces instructions

---

```mdx
---
title: Titre de votre guide
description: Une description courte de ce que couvre ce guide
icon: FileText
---

Ecrivez ici une introduction a votre guide.

## Section 1

Contenu de la premiere section.

## Section 2

Contenu de la deuxieme section.

### Sous-section

Vous pouvez creer des sous-sections avec ###

## Code

Vous pouvez ajouter des blocs de code :

\`\`\`javascript
// Exemple de code
console.log("Hello");
\`\`\`

## Images

Vous pouvez ajouter des images zoomables :

\`\`\`mdx

<ZoomableImage src='/wiki/mon-image.webp' alt='Description' variant='centered' />
\`\`\`

## Liens

Vous pouvez ajouter des liens vers d'autres pages :

- [Lien vers la page d'accueil](/wiki)
- [Lien vers le blog](/blog)

## Conclusion

Resumez ce que le lecteur a appris.
```

---

## Icones disponibles

Vous pouvez utiliser ces icones dans le frontmatter (icon:) :

- `FileText` - Document
- `BookOpen` - Livre ouvert
- `Lightbulb` - Ampoule (idee)
- `Wrench` - Outil
- `Settings` - Parametres
- `Users` - Utilisateurs
- `Star` - Etoile
- `Heart` - Coeur
- `Info` - Information
- `AlertTriangle` - Avertissement

Plus d'icones sur : https://lucide.dev/icons

---

## Localisation

Ce template est dans `docs/templates/` mais pour créer un nouveau guide :

1. Copiez le template
2. Placez-le dans `content/wiki/`
3. Renommez-le en `.mdx`
4. Commencez à écrire !
