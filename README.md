# Portfolio — Base de navigation

## Stack
**Next.js 14** → déploiement natif sur **Vercel**

## Installation locale

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Déploiement Vercel

1. Pousser sur GitHub
2. Importer le repo dans [vercel.com](https://vercel.com)
3. Framework détecté automatiquement : **Next.js**
4. Deploy 🚀

---

## Calibrer la position du saxophone

Dans `pages/index.js`, ligne ~17, ajuster `SAX_POSITION` :

```js
const SAX_POSITION = {
  x: 52,   // % depuis la gauche du SVG (0-100)
  y: 58,   // % depuis le haut du SVG (0-100)
  w: 5,    // largeur en % du SVG
  h: 8,    // hauteur en % du SVG
}
```

Le SVG `chambre_vide.svg` a un viewBox de **4000 × 2286**.  
Exemple : si le saxo est à x=2100px, y=1300px dans l'image → `x: 52.5, y: 56.9`

---

## Navigation

| Action | Effet |
|--------|-------|
| Souris vers les bords | Panning fluide de l'image |
| Hover sur le saxophone | Halo doré + texte "explorer" |
| Clic sur le saxophone | Transition animée chambre → plan large |
| Re-clic | Retour chambre (à ajouter selon besoins) |

## Structure

```
portfolio/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   └── index.js          ← page principale
├── public/
│   └── images/
│       ├── chambre_vide.svg
│       ├── chambre_vide_plan_large.svg
│       └── saxophone.svg
├── styles/
│   ├── globals.css
│   └── Home.module.css
├── next.config.js
└── package.json
```
