# Portfolio — Clément Berger

Portfolio immersif sous forme de chambre interactive, développé avec Next.js et déployé sur Vercel.

## Stack

**Next.js 14** → déploiement natif sur **Vercel**

## Installation locale

```bash
npm install
npm run dev
# → http://localhost:3000
```

> Nécessite une résolution ≥ 900px en mode paysage. Le site affiche un écran de redirection sur mobile et écrans verticaux.


## Navigation

| Action | Effet |
|--------|-------|
| Souris vers les bords | Panning fluide de la chambre |
| Hover sur un objet | Curseur agrandi + tooltip doré |
| Clic sur un objet | Zoom + affichage du contenu sur le mur gauche |
| Clic dans le vide | Retour vue chambre |
| Bouton vue centralisée | Panneau droit avec tout le contenu |
| Bouton contact | Zoom sur le téléphone |
| Clic sur l'ordinateur | Transition vers la scène ordi / projets |

## Scènes

| Scène | Description |
|-------|-------------|
| `entree` | Porte d'entrée (fermée → ouverte → transition chambre) |
| `chambre` | Chambre principale interactive avec panning |
| `ordi` | Zoom sur l'écran d'ordinateur avec iframe projets |

## Structure

```
portfolio/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   └── index.js              ← page principale, logique de navigation et animations
├── components/
│   ├── MurGauche.jsx         ← panneau gauche (affiche le composant objet actif)
│   ├── MurDroite.jsx         ← panneau droit (vue d'ensemble / onglets)
│   └── objets/               ← 18 composants, un par objet cliquable
│       ├── abwheel.js
│       ├── amelioration.js
│       ├── avenir.js
│       ├── chaise.js
│       ├── course.js
│       ├── football.js
│       ├── formation.js
│       ├── ia.js
│       ├── livre.js
│       ├── mapersonnalite.js
│       ├── piano.js
│       ├── pingpong.js
│       ├── platine.js
│       ├── qualitevaleur.js
│       ├── saxophone.js
│       ├── telephone.js
│       ├── tennis.js
│       └── tiroir.js
├── data/
│   └── portfolio.js          ← source unique de vérité (labels, textes, bullets)
├── lib/
│   └── svgAnimations.js      ← animations ambiantes injectées dans le SVG chambre
├── public/
│   ├── images/
│   │   ├── chambre.svg       ← SVG principal de la chambre (9956×2271)
│   │   ├── entree-fermee.svg
│   │   ├── entree-ouverte.svg
│   │   ├── zoom-ordi.svg
│   │   ├── objets/           ← illustrations des objets (png/svg)
│   │   ├── taskbar/          ← icônes de la barre de navigation
│   │   ├── experience/       ← visuels des expériences pro
│   │   └── pdf/              ← documents PDF et aperçus
│   ├── videos/
│   │   ├── paysage.webm      ← vidéo fenêtre (boucle ambiante)
│   │   └── video.webm        ← vidéo écran ordinateur
│   └── audios/
│       ├── musique.mp3
│       ├── musique1.mp3
│       └── musique2.mp3
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── next.config.js
└── package.json
```

## Architecture technique

- **Rendu SVG chambre** : fetché en `text`, parsé via `DOMParser`, injecté dans le DOM pour permettre les `pointer-events` sur les éléments SVG individuels
- **Animations** : boucles RAF cancelables via `animRafRef`, easing custom `easeDive` pour les transitions de zoom
- **Panning** : LERP 60fps avec détection de bords souris + drag tactile
- **MurGauche** : conserve le dernier composant affiché pendant l'animation de retour (pas de flash blanc)
- **Chargement** : preloader qui précache toutes les ressources statiques avant d'afficher l'entrée