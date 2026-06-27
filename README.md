# Portfolio — Léo Farhi

[![Portfolio](https://img.shields.io/badge/Portfolio-en%20ligne-f5c84b?style=for-the-badge)](https://leofarhi.github.io/Portfolio/)
[![GitHub Pages](https://img.shields.io/badge/H%C3%A9berg%C3%A9%20sur-GitHub%20Pages-222222?style=for-the-badge&logo=github)](https://pages.github.com/)
[![Made with](https://img.shields.io/badge/Made%20with-HTML%20%2B%20CSS%20%2B%20JS-2b7bb9?style=for-the-badge)](#stack-technique)

Portfolio personnel de **Léo Farhi**, pensé pour présenter mon parcours, mes projets techniques, mes expériences et mes liens externes dans un format simple, rapide et maintenable.

Le site est hébergé gratuitement avec **GitHub Pages** et fonctionne sans backend. Les projets sont chargés depuis un fichier de données central, ce qui permet d’ajouter ou modifier une page projet sans toucher à toute l’interface.

👉 **Site en ligne : [leofarhi.github.io/Portfolio](https://leofarhi.github.io/Portfolio/)**

## Aperçu

Ce portfolio met surtout en avant des projets liés au game development, aux moteurs 3D, à l’IA, aux outils créatifs et aux projets sur calculatrices Casio.

Il contient notamment :

- une page d’accueil avec profil, parcours et liens externes ;
- une grille de projets filtrable par catégories ;
- des pages projet détaillées avec description, date, durée, sections, images et vidéos ;
- un système de liens internes entre projets ;
- un éditeur local en Python pour modifier plus confortablement les données ;
- un suivi d’audience léger avec Cloudflare Web Analytics.

## Projets actuellement présentés

| Projet | Catégories |
| --- | --- |
| Moderaworld | Narration, AI |
| MyMocap | AI, Tools |
| UniversalMP | Game Development |
| Zelda TOTK Multiplayer Mod | Game Development, AI |
| ProjectorAI | AI, Tools |
| Neural Rendering | AI |
| Regain The World | Game Development, Epita |
| Particule Engine | Game Development, Tools |
| Underworld | AI, Epita |
| Thermorph | Game Development |
| Frontiers Of Legends | Game Development |
| 3D Engines | Game Development |
| Arboris | Casio, Game development |
| Zelda TOTN | Casio, Game development |
| Mario 3D | Casio, Game development |
| RPG Maker | Casio, Game development |
| Temple Warriors | Casio, Game development |

## Stack technique

Le site est volontairement simple :

- **HTML** pour la structure ;
- **CSS** pour l’interface, le responsive et les animations ;
- **JavaScript vanilla** pour la navigation, les filtres, les pages projet et la galerie média ;
- **Python** pour le serveur local du mode édition ;
- **GitHub Pages** pour l’hébergement ;
- **Git LFS** pour certains gros fichiers vidéo ;
- **Cloudflare Web Analytics** pour les statistiques d’audience.

Il n’y a pas de framework frontend, pas de build step obligatoire et pas de serveur à maintenir.

## Structure du dépôt

```txt
Portfolio/
├── index.html
├── README.md
├── .gitattributes
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── data/
│   │   └── projects-data.js
│   ├── images/
│   └── projects/
├── editor/
│   └── server.py
└── launch-local.bat
```

### Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure globale du site et chargement des scripts |
| `assets/css/style.css` | Design, responsive, cartes projet, pages détaillées |
| `assets/js/script.js` | Navigation, filtres, rendu des projets, modales média |
| `assets/data/projects-data.js` | Données de tous les projets |
| `assets/projects/` | Images, vidéos et médias des projets |
| `editor/server.py` | Serveur local du mode édition web |
| `launch-local.bat` | Lance le portfolio en local, en mode normal ou éditeur |

## Fonctionnement des projets

Les projets sont décrits dans :

```txt
assets/data/projects-data.js
```

Le fichier expose une variable globale :

```js
window.PROJECTS_DATA = {
  "projects": [
    {
      "id": "project-id",
      "title": "Nom du projet",
      "date": "Janvier 2026",
      "duration": "2 semaines",
      "category": ["AI", "Tools"],
      "icon": "assets/projects/Project/icon.jpg",
      "media": "assets/projects/Project/main.mp4",
      "description": "Description courte du projet.",
      "pages": [
        {
          "name": "Contexte",
          "sections": []
        }
      ],
      "medias": []
    }
  ]
};
```

### Champs importants

| Champ | Description |
| --- | --- |
| `id` | Identifiant unique du projet, utilisé dans l’URL et les liens internes |
| `title` | Titre affiché sur la carte et la page projet |
| `date` | Période ou date du projet |
| `duration` | Durée du projet |
| `category` | Liste des tags affichés dans le portfolio |
| `icon` | Visuel de la carte projet |
| `media` | Média principal affiché en haut de la page projet |
| `description` | Texte d’introduction |
| `pages` | Onglets internes du projet, chacun contenant ses propres sections |
| `medias` | Galerie générale du projet |

Si aucune icône n’est renseignée, le portfolio affiche un placeholder “Visuel en préparation”, afin d’éviter les cartes vides ou cassées.

## Balises de texte supportées

Les descriptions acceptent quelques balises simples.

### Mise en forme

```txt
[b]Texte en gras[/b]
[i]Texte en italique[/i]
[u]Texte souligné[/u]
[s]Texte barré[/s]
```

### Lien vers un autre projet

```txt
[projet=neural-rendering]Neural Rendering[/projet]
```

Ce lien ouvre directement la page du projet correspondant.

### Lien externe

```txt
[url=https://github.com/leofarhi]Mon GitHub[/url]
```

### Bouton

```txt
[button=https://github.com/leofarhi]Voir mon GitHub[/button]
[button-projet=neural-rendering]Voir Neural Rendering[/button-projet]
```

### Liste à puces

```txt
[enum=1]Premier point[/enum]
[enum=1]Deuxième point[/enum]
[enum=2]Sous-point[/enum]
```

Le niveau indiqué dans `enum` permet de créer des listes imbriquées.

## Ajouter ou modifier un projet

Deux méthodes sont possibles.

### Méthode rapide : modifier le fichier de données

1. Ouvrir `assets/data/projects-data.js`.
2. Ajouter un objet dans le tableau `projects`.
3. Placer les médias dans `assets/projects/NomDuProjet/`.
4. Vérifier que les chemins commencent bien par `assets/...`.
5. Tester localement le portfolio.

### Méthode web locale : éditer depuis le portfolio

Un mode édition local existe aussi directement dans le site.

Lancement :

```bash
python editor/server.py
```

Puis ouvrir :

```txt
http://127.0.0.1:8000/?edit=1#portfolio
```

Ce mode ajoute des boutons d’édition uniquement en local :

- création d’un nouveau projet ;
- suppression d’un projet depuis sa carte ;
- édition du titre, de la date, de la durée, de la description, des tags, des pages, des sections, de l’icône et des médias depuis la page projet.

Les modifications sont envoyées au serveur Python local, qui réécrit `assets/data/projects-data.js`.

La sélection de médias passe aussi par ce serveur local : il ouvre l’explorateur de fichiers et refuse les fichiers qui ne se trouvent pas dans le dossier du portfolio.

Sur la version GitHub Pages publiée, ce mode ne s’active pas.

## Tester localement

Depuis la racine du dépôt :

```bash
python -m http.server 8000
```

Puis ouvrir :

```txt
http://localhost:8000
```

Utiliser un petit serveur local est préférable à une ouverture directe du fichier `index.html`, surtout pour tester les médias, les liens et le comportement proche de GitHub Pages.

## Médias et gros fichiers

Les images et vidéos sont rangées dans :

```txt
assets/projects/
```

Certains fichiers vidéo sont suivis avec **Git LFS**, notamment les gros `.mp4` de projets comme UniversalMP ou Zelda TOTK Multiplayer Mod.

Les règles LFS sont définies dans :

```txt
.gitattributes
```

Avant de cloner ou pousser des médias lourds, vérifier que Git LFS est installé :

```bash
git lfs install
```

## Déploiement

Le site est publié avec **GitHub Pages**.

Workflow habituel :

```bash
git add .
git commit -m "Mise à jour du portfolio"
git push
```

Après le push, GitHub Pages met généralement quelques minutes à publier la nouvelle version.

## Analytics

Le portfolio utilise **Cloudflare Web Analytics** pour suivre les statistiques globales du site :

- visites ;
- pages vues ;
- pays ;
- sites référents ;
- navigateurs ;
- systèmes ;
- performances de chargement.

Le script est placé dans `index.html`, juste avant `</body>`.

Les données ne permettent pas d’identifier précisément une personne. Elles servent surtout à comprendre si le portfolio est consulté, depuis quels liens, et sur quels types d’appareils.

À noter : certains bloqueurs de publicité ou protections navigateur peuvent bloquer le script Cloudflare, ce qui peut rendre les statistiques incomplètes.

## Liens

- Portfolio : [leofarhi.github.io/Portfolio](https://leofarhi.github.io/Portfolio/)
- GitHub : [github.com/leofarhi](https://github.com/leofarhi)
- itch.io : [farhi.itch.io](https://farhi.itch.io/)
- Planet Casio : [profil Farhi](https://www.planet-casio.com/Fr/compte/voir_profil.php?membre=farhi)
- LinkedIn : [linkedin.com/in/leofarhi](https://www.linkedin.com/in/leofarhi/)

## Note

Ce dépôt n’est pas seulement une vitrine statique. Il sert aussi de carnet technique : chaque page projet essaye d’expliquer le problème de départ, les choix faits, les limites rencontrées et ce que le projet m’a appris.

Le portfolio évolue donc en même temps que mes projets.

## Crédits

La base visuelle du portfolio vient de [codewithsadee/vcard-personal-portfolio](https://github.com/codewithsadee/vcard-personal-portfolio).

Le projet a ensuite été énormément modifié côté fonctionnement : chargement des projets depuis un fichier de données, pages projet détaillées, galeries média, liens internes, éditeur Python, etc...

En pratique, seule la base visuelle et une partie du style d’origine ont été conservées.
