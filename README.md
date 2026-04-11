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
