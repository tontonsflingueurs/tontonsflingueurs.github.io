# Guide de rédaction — Guide wiki

Ce document regroupe les principes à respecter pour rédiger un guide wiki cohérent avec les autres.

---

## Création du fichier

1. Créez un fichier `.mdx` dans `content/wiki/` (ou un sous-dossier comme `content/wiki/guides/`)
2. Nommez-le avec un nom descriptif en minuscules et tirets (exemple : `systeme-pantheon.mdx`)

---

## Frontmatter

```yaml
---
title: Titre de votre guide
description: Une description courte de ce que couvre ce guide
icon: FileText
---
```

### Champs disponibles

| Champ         | Obligatoire | Description                          |
| ------------- | ----------- | ------------------------------------ |
| `title`       | Oui         | Titre du guide                       |
| `description` | Oui         | Description courte                   |
| `icon`        | Non         | Icône Lucide (voir liste ci-dessous) |

### Icônes disponibles

Vous pouvez utiliser ces icônes dans le frontmatter (`icon:`) :

- `FileText` - Document
- `BookOpen` - Livre ouvert
- `Lightbulb` - Ampoule (idée)
- `Wrench` - Outil
- `Settings` - Paramètres
- `Users` - Utilisateurs
- `Star` - Étoile
- `Heart` - Cœur
- `Info` - Information
- `AlertTriangle` - Avertissement

Plus d'icônes sur : [lucide.dev/icons](https://lucide.dev/icons)

---

## Structure du guide

### Introduction

Après le frontmatter, commencez par une courte introduction expliquant ce que le guide couvre. Utilisez le **gras** pour les éléments importants.

### Séparateurs

Utilisez `---` pour séparer visuellement chaque section de niveau 2 (`##`).

### Titres de niveau 2 (`##`)

Pour les grandes catégories du guide :

```mdx
---
## Fonctionnement
---

## Détails des éléments

---

## Conseils
```

### Titres de niveau 3 (`### 🔸`)

Pour chaque sous-élément, utilisez l'emoji 🔸 suivi du nom :

```mdx
### 🔸 Nom de l'élément

Description et détails de l'élément.

### 🔸 Autre élément

Description et détails.
```

---

## Mise en forme du contenu

### Valeurs et statistiques

Mettez les valeurs importantes en gras :

```mdx
Dégâts de base : **230**
Temps de recharge : **18 s**
```

### Listes de caractéristiques

Utilisez des listes à puces pour les détails multiples :

```mdx
- Dégâts de base : **230**
- Portée : **5 tuiles**
- Temps de recharge : **12 s**
```

---

## Images

1. Convertissez votre image en `.webp` ([convertio.co](https://convertio.co/fr/png-webp/))
2. Placez-la dans le dossier `public/wiki/`
3. Référencez-la avec le composant `ZoomableImage` :

```mdx
<ZoomableImage src="/wiki/mon-image.webp" alt="description" />
```

Variantes disponibles :

- `variant="centered"` : image centrée, max 70 % de largeur (par défaut)
- `variant="banner"` : pleine largeur

---

## Liens

Vous pouvez ajouter des liens vers d'autres pages :

```mdx
- [Lien vers une autre page wiki](/wiki/autre-page)
- [Lien vers le blog](/blog)
- [Lien externe](https://example.com)
```

---

## Exemple de structure complète

```mdx
---
title: Système du Panthéon
description: Guide complet du fonctionnement du Panthéon
icon: Star
---

Introduction expliquant le sujet du guide avec les **éléments clés** en gras.

<ZoomableImage src="/wiki/pantheon-overview.webp" alt="aperçu du panthéon" />

---

## Fonctionnement général

Explication du fonctionnement de base.

---

## Détails des bonus

### 🔸 Bonus du Panthéon

Description du bonus et de son effet : **15 % de dégâts supplémentaires**.

### 🔸 Bonus de Nouveauté

Description du bonus :

- Durée : **7 jours**
- Effet : **15 % de dégâts bonus**

---

## Conseils

- Conseil 1
- Conseil 2
```

---

## Conseils

- Les images doivent être en `.webp` (pas PNG/JPG)
- Utilisez le gras pour les valeurs numériques et éléments importants
- Séparez toujours les sections `##` avec des `---`
- Structurez avec des sous-titres pour faciliter la lecture
- Ajoutez des liens vers des pages connexes en conclusion
