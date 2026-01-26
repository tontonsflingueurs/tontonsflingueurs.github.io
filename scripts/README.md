# Scripts de gestion du contenu

Ce dossier contient des scripts utilitaires pour gérer et maintenir le contenu du wiki TTF.

## 📝 normalize-blog-articles.ts

Script de normalisation automatique des articles de blog selon le template défini dans `templates/TEMPLATE_POST.md`.

### Utilisation

```bash
bun run scripts/normalize-blog-articles.ts
```

### Corrections appliquées

1. **Conversion des titres en gras vers H3 avec emoji**
   - `**Nom (Amélioré)**` → `### 🔸 Nom (Amélioré)`
   - `**Nom (Affaibli)**` → `### 🔸 Nom (Affaibli)`
   - `**Nom (Ajusté)**` → `### 🔸 Nom (Ajusté)`

2. **Normalisation des titres H3 existants**
   - `### 🔸 **Nom** 🔸` → `### 🔸 Nom`
   - `### **Nom**` → `### 🔸 Nom`
   - Ajout de `🔸` si manquant dans les H3

3. **Gestion des sections de catégorie**
   - Suppression de `🔸` pour les titres H3 en MAJUSCULES (UNITÉS, HÉROS, etc.)

4. **Séparateurs**
   - Ajout de `---` avant chaque section H2 (`##`)
   - Suppression des séparateurs en double

5. **Formatage**
   - Normalisation de `**Pourquoi ?**`
   - Correction des "Pourquoi ?" cassés sur plusieurs lignes
   - Suppression des espaces en fin de ligne
   - Limitation à 2 lignes vides consécutives maximum
   - Ajout d'une ligne vide avant chaque H3

### Sécurité

- Le script ne modifie que les fichiers `.mdx` dans `content/blog/articles/`
- Les fichiers sont mis à jour uniquement si le contenu a changé
- Affiche un rapport détaillé des modifications

### Exemple de sortie

```
🔍 Recherche des articles à normaliser...

📄 194 articles trouvés

✅ Normalisé : \(2025)\2025-11-26-equilibrage-saison-65.mdx
✅ Normalisé : \(2025)\2025-12-24-equilibrage-saison-66.mdx

✨ Terminé !
   2 articles mis à jour
   192 articles déjà conformes
```

## Autres scripts

_(À documenter au fur et à mesure)_
