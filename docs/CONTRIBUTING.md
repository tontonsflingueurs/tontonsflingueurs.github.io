# Guide de Contribution

Merci de votre intérêt pour contribuer au wiki TTF ! Les contributions sont les bienvenues, que vous soyez rédacteur, graphiste ou développeur.

## ✨ Deux façons de contribuer

### 1️⃣ Via GitHub Web (Recommandé pour les non-techniciens)

**Avantages :**

- Aucun logiciel à installer
- Interface simple et visuelle
- Aperçu en temps réel

**Étape par étape :**

#### Étape 1 : Fork le repository

1. Cliquez sur le bouton **Fork** en haut à droite de [github.com/tontonsflingueurs/wiki](https://github.com/tontonsflingueurs/wiki)
2. Cela crée une copie du projet dans votre compte GitHub

#### Étape 2 : Créer ou modifier du contenu

1. Naviguez dans votre fork (`https://github.com/VOTRE_USERNAME/wiki`)
2. Allez dans le dossier pertinent :
   - `content/wiki/` pour les guides
   - `content/blog/articles/` pour les articles
3. Cliquez sur **Add file** ou éditer un fichier existant
4. Modifiez le contenu

##### Exemple : Créer un guide wiki

```
Dossier : content/wiki/
Nom du fichier : mon-guide.mdx

---
title: Titre de votre guide
description: Une description courte
icon: BookOpen
---

## Introduction

Votre contenu ici...
```

#### Étape 3 : ⚠️ Gérer les images (IMPORTANT)

**Avant de mettre à jour une image, convertissez-la en WebP !**

Les images doivent être en WebP pour optimiser les performances (60-70% de réduction de taille).

##### Convertir une image

**Option A : Outils en ligne** (gratuit, simple)

- [CloudConvert](https://cloudconvert.com/png-to-webp)
- [Convertio](https://convertio.co/png-webp/)
- [Online-Convert](https://image.online-convert.com/convert-to-webp)

Étapes :

1. Uploader votre image PNG/JPG
2. Sélectionner "WebP" comme format
3. Cliquer "Convert"
4. Télécharger le fichier `.webp`

**Option B : Ligne de commande** (si vous avez `imagemagick`)

```bash
convert mon-image.png -quality 90 mon-image.webp
```

#### Étape 4 : Upload l'image

1. Dans votre fork GitHub, allez dans `public/blog/` ou `public/wiki/`
2. Cliquez **Add file** → **Upload files**
3. Téléchargez votre `.webp`
4. Cliquez **Commit changes**

#### Étape 5 : Référencer l'image dans le contenu

Dans votre fichier `.mdx`, utilisez :

```mdx
<ZoomableImage src="/blog/mon-image.webp" alt="Description de l'image" variant="centered" />
```

Variantes :

- `centered` : Centrée (par défaut)
- `banner` : Pleine largeur

**Vérifier l'image s'affiche bien :**

- Cliquez sur le fichier image dans GitHub
- Cliquez sur **Display the rich diff** pour voir un aperçu

#### Étape 6 : Créer une Pull Request (PR)

1. Allez sur votre fork
2. Cliquez sur **Contribute** → **Open pull request**
3. Remplissez :
   - **Titre** : Description courte
   - **Description** : Expliquer ce que vous avez ajouté/modifié
4. Cliquez **Create pull request**

#### Étape 7 : Attendre la validation

- Un mainteneur révise votre PR
- Des questions/suggestions peuvent être posées
- Une fois approuvée, elle est fusionnée automatiquement
- Votre contribution apparaît sur le wiki !

---

### 2️⃣ En Développement Local (Pour les développeurs)

**Avantages :**

- Plus de contrôle et de flexibilité
- Aperçu en temps réel localement
- Optimisation automatique des images
- Meilleure expérience de dev

#### Prérequis

- **Bun** ([installer](https://bun.sh))
- **Git**
- Un éditeur de code (VS Code, etc.)

#### Mise en place

```bash
# 1. Fork le repo et cloner VOTRE fork
git clone https://github.com/VOTRE_USERNAME/wiki.git
cd wiki

# 2. Ajouter le repo original comme upstream
git remote add upstream https://github.com/tontonsflingueurs/wiki.git

# 3. Installer les dépendances
bun install

# 4. Démarrer le serveur de développement
bun dev
# Ouvrir http://localhost:3000
```

#### Workflow de contribution

##### Créer une branche

```bash
# Synchroniser avec le repo principal
git fetch upstream
git checkout -b feat/mon-guide upstream/main

# Ou pour un article
git checkout -b article/titre-article upstream/main
```

Conventions de noms de branche :

- `feat/description` - Nouvelle fonctionnalité ou guide
- `article/titre` - Nouvel article de blog
- `fix/description` - Correction
- `docs/description` - Documentation

##### Créer/modifier le contenu

Créer des fichiers dans :

- `content/wiki/` - Guides
- `content/blog/articles/` - Articles (format : `YYYY-MM-DD-titre.mdx`)

##### Optimiser les images

```bash
# Placer vos images PNG/JPG dans public/blog/ ou public/wiki/
# Puis exécuter :
bun run img:optimize

# Cela va :
# 1. Convertir PNG → WebP
# 2. Mettre à jour automatiquement les références dans les fichiers
```

Alternativement :

```bash
# Juste convertir les images
bun run img:convert

# Ou juste mettre à jour les chemins
bun run img:update-refs
```

##### Vérifier localement

```bash
# Le serveur recharge automatiquement
# Ouvrir http://localhost:3000 et naviguer

# Pour vérifier les types TypeScript
bun types:check

# Linter le code
bun lint
```

##### Commit et Push

```bash
# Ajouter les fichiers
git add .

# Commit (utiliser un message clair)
git commit -m "feat(wiki): ajouter guide sur les cartes"

# Push vers votre fork
git push origin feat/mon-guide
```

**Conventions de commits :**

- `feat:` - Nouvelle fonctionnalité ou contenu
- `fix:` - Correction
- `docs:` - Documentation
- `perf(performance):` - Optimisations
- Exemple : `feat(wiki): ajouter guide stratégie arènes`

##### Créer une Pull Request

1. Allez sur votre fork GitHub
2. Cliquez **Create pull request**
3. Complétez :
   - **Titre** : `feat(wiki): ajouter guide...`
   - **Description** : Expliquer les changements
4. Cliquez **Create pull request**

#### Scripts utiles

| Commande           | Utilité                              |
| ------------------ | ------------------------------------ |
| `bun dev`          | Serveur de développement             |
| `bun bundle`       | Build production complet             |
| `bun types:check`  | Vérifier les types                   |
| `bun lint`         | Vérifier la qualité du code          |
| `bun format`       | Formater le code                     |
| `bun img:optimize` | Convertir + mettre à jour les images |

---

## 📝 Templates

Utilisez les templates pour démarrer :

### Guide Wiki

Consultez [templates/TEMPLATE_GUIDE.md](./templates/TEMPLATE_GUIDE.md)

Structure recommandée :

- Introduction courte
- Sections principales (###)
- Conclusion
- Liens vers pages connexes

Icônes disponibles :
`FileText`, `BookOpen`, `Lightbulb`, `Wrench`, `Settings`, `Users`, `Star`, `Heart`, `Info`, `AlertTriangle`

Plus : https://lucide.dev/icons

### Article de Blog

Consultez [templates/TEMPLATE_POST.md](./templates/TEMPLATE_POST.md)

Frontmatter requis :

```yaml
title: "Titre"
description: "Courte description"
date: "2025-01-12"
authors: [iokee, mahzazel] # IDs des auteurs (voir utils/authors.ts)
image: "/blog/mon-image.webp"
tags: [tag1, tag2]
```

---

## ✅ Checklist avant de Soumettre

Avant de créer une PR, vérifiez :

- [ ] **Contenu** : Le texte est clair et bien structuré
- [ ] **Images** : Sont en WebP et bien référencées
- [ ] **Liens** : Pointent vers les bonnes pages
- [ ] **Aperçu** : Testé localement (ou via GitHub Web)
- [ ] **Pas de typos** : Relecture rapide
- [ ] **Métadonnées** : Le frontmatter est complet
- [ ] **Originalité** : Pas de contenu dupliqué

---

## 🚫 Ce qu'il ne faut PAS faire

- ❌ Publier des images PNG/JPG non converties en WebP
- ❌ Modifier les fichiers de configuration sans demander
- ❌ Ajouter du contenu off-topic
- ❌ Commercialiser ou modifier le projet sans validation
- ❌ Modifier les fichiers d'autres contributeurs sans accord

---

## ❓ Questions ?

- Consultez le [guide de développement](./DEVELOPMENT.md) pour les détails techniques
- Ouvrez une [issue](https://github.com/tontonsflingueurs/wiki/issues) pour poser une question
- Proposez une discussion avant une grosse modification

---

## 🙏 Remerciements

Merci de contribuer au wiki ! Votre travail aide toute la communauté.

**Note** : Toutes les contributions sont validées avant intégration. C'est une étape importante pour maintenir la qualité du contenu.
