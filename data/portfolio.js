/**
 * data/portfolio.js
 * SOURCE UNIQUE DE VERITE du portfolio.
 *
 * Chaque item contient :
 *   id       → id SVG de l'objet cliquable
 *   label    → titre court
 *   svgId    → chemin image déco (ou null)
 *   summary  → texte court affiché sur la card du mur de droite
 *   details  → texte long (description complète, affiché au clic "en savoir plus")
 *   bullets  → (optionnel) liste de points affichés sous le details
 *
 * REGLE : toutes les strings utilisent des backticks pour eviter les
 * conflits avec les apostrophes francaises.
 */

export const PORTFOLIO_CATEGORIES = [

  // ── PROFIL ──────────────────────────────────────────────────
  {
    categorie: `Profil`,
    items: [
      {
        id: `miroir`,
        label: `Ma personnalité`,
        svgId: `/images/objets/miroir.png`,
        summary: `Curieux, motivé et créatif, je m'investis énormément dans ce qui me plaît et n'hésite jamais à sortir de l'ordinaire.`,
        details: [
          {titre: `Vous ratez 100 % des tirs que vous ne tentez pas. » Wayne Gretzky`, texte: `Cette citation résume bien ma philosophie de vie. Je suis quelqu'un de curieux et qui aime essayer de nouvelles choses. Je n'ai pas peur de me lancer, même si je ne maîtrise pas encore tout parfaitement. Je traduis cela par mes centres d'intérêt et mes projets informatiques.`},
          {titre : `Qui suis-je ?`, texte : `Je suis quelqu'un de curieux, cela s'explique par ma soif d'apprendre de nouvelles choses mais surtout les comprendre. Pour le développement informatique, c'est le résultat que j'obtiens à la fin et la satisfaction que cela apporte qui me plaît. Je suis donc toujours très motivé pour arriver à mes fins, même si cela me demande du temps et de l'énergie.`},
          {titre : `Comment je travaille ?`, texte : `Le juste milieu entre autonomie et collaboration est l'idéal pour moi. J'aime travailler en équipe, échanger les idées et l'entraide entre collègues, mais j'aime aussi avoir la liberté de travailler seul à mon rythme pour mieux me concentrer.`},
          {titre : `Ce qui me motive`, texte : `J'aime créer, en reprenant un projet existant pour l'améliorer ou en partant de zéro. J'accorde beaucoup d'importance à l'analyse du besoin, à l'élaboration de cahiers des charges ou encore de maquettes avant de s'attaquer au vif du sujet.`},
          {titre : `Ce que l'on dit de moi`, texte : `"Nous avons eu le plaisir d'accueillir Clément pour son stage de 2ème année en BUT informatique au sein de notre équipe MOA-SI, et nous tenons à souligner une attitude sérieuse et exemplaire.
                Dès son arrivée, Clément a fait preuve de curiosité quant à son environnement de travail, notamment en cherchant à comprendre les enjeux sécuritaires liées à une mission en centrale nucléaire.
                Il a rapidement fait preuve d'une réelle motivation à s'intégrer et à apprendre. Il a su s'adapter à nos outils et contraintes organisationnelles, et a abordé chaque tâche avec sérieux.
                Nous avons particulièrement apprécié sa disponibilité et sa facilité d'intégration au sein de notre collectif. Son attitude positive et son enthousiasme sont salués par l'ensemble de l'équipe.
                Ce stage a donc été une réussite tant pour Clément que pour notre service. Nous sommes convaincus qu'il possède toutes les qualités pour réussir dans le domaine de l'informatique." Ma tutrice de stage à EDF.`},
        ],
        bullets: [`Curieux`, `Équilibre autonomie/collaboration`, `Création`],
      },
      {
        id: `journal`,
        label: `Valeurs & qualités`,
        svgId: `/images/objets/journal.png`,
        summary: `Persévérant, résilient, créatif et pondéré : quatre qualités qui me définissent relativement bien.`,
        details: [
          {titre: `Persévérant`, texte: `Je veux toujours que mon travail soit parfait, quitte à m'y investir plus que nécessaire. J'espère toujours produire un travail de qualité peu importe mon niveau de motivation`},
          {titre: `Résilient`, texte: `je sais m'adapter aux situations et adopter la bonne posture face aux éventuels problèmes rencontrés dans ma vie professionnelle, voire personnelle.`},
          {titre: `Créatif`, texte: `j'accorde beaucoup d'importance au design et à l'expérience utilisateur pour rendre la navigation agréable sur un site internet`},
          {titre: `Pondéré`, texte: `je ne demande de l'aide que si besoin, et ne prends la parole que de manière concise et à bon escient.`},
          {titre: `Ma faiblesse : Obstiné`, texte: `Je suis parfois tellement absorbé par mes projets informatique que j'en oublie totalement la notion du temps. Je suis parfois tellement motivé par quelque chose que c'est "au détriment" d'autres priorités... Mais c'est ce qui fait ma détermination !`},
        ],
        bullets: [`Persévérant`, `Résilient`, `Créatif`, `Pondéré`, `Obstiné`],
      },
            {
        id: `fenetre`,
        label: `Perspectives d'avenir`,
        svgId: `/images/objets/fenetre.png`,
        summary: `BUT Informatique en cours, puis Master ou école d'ingénieur, avec l'ambition d'encadrer une équipe technique.`,
        details: [
          {titre: `Consolidation`, texte: `Fin du BUT Informatique. Je consolide mes bases en développement informatiques pour ressortir avec un bac+3 solide.`},
          {titre: `Spécialisation`, texte: `Entrée en Master ou en École d'ingénieur. L'objectif est d'approfondir mes connaissances en informatique ou d'en développer dans un nouveau domaine.`},
          {titre: `Découverte`, texte: `Visiter le monde, apprendre de nouvelles langues, mais aussi découvrir le monde du travail à temps plein et m'épanouir dans ma carrière.`},
          {titre: `Direction`, texte: `Encadrer une équipe, faire les bons choix technologiques, stratégiques et managériaux.`},
        ],
        bullets: [
          `Aujourd'hui — BUT Informatique (bac+3)`,
          `2027 — Master ou école d'ingénieur`,
          `2029 — Découverte du monde du travail`,
          `2030+ — Encadrement d'équipe`,
        ],
      },

      {
        id: `recul`,
        label: `Réflexion et prise de recul`,
        svgId: `/images/objets/recul.png`,
        summary: `Ce que j'ai appris de mes expériences passées et comment cela influence ma vision de l'avenir, tant professionnel que personnel.`,
        details: [
          {titre: `Posture professionnelle adoptée`, texte: `Je suis jeune, je n'ai pas tant d'expérience que ça, mais je pense que le stage effectué à EDF m'a réellement permis d'adopter la bonne posture face au monde professionnel, que ce soit en termes de communication, de travail en équipe ou encore de gestion de projet. J'ai pu clairement comprendre ce que l'on attendait de moi, ce qui m'a permis de me préparer au mieux pour mes futures expériences professionnelles.`},
          {titre: `Compétences acquises`, texte: `Je me suis rendu compte que la plupart des compétences techniques que j'ai pu travailler durant mes études m'ont tout de même été très utiles pour mon stage à EDF : programmer efficacement, lisiblement et en optimisant le code, versionner avec Git, mais également mettre en application les notions de communication et de design/ergonomie.`},
          {titre: `Avenir envisagé`, texte: `Je suis quasiment certain de vouloir travailler dans l'informatique. Pas forcément développer tout ma vie, mais pouvoir lier l'informatique et la créativité en passant par le design, la musique, l'audiovisuel, ou même le sport est quelque chose qui m'attire grandement. L'idée de me tourner également vers le management est aussi un domaine qui m'intéresse et que j'aimerais explorer à l'avenir.`},
        ],
        bullets: [
          `Posture professionnelle adoptée`,
          `Compétences acquises`,
          `Avenir envisagé`,
        ],
      },  
    ],
  },

  // ── FORMATION ───────────────────────────────────────────────
  {
    categorie: `Formation`,
    items: [
      {
        id: `classeurs`,
        label: `Mon parcours`,
        svgId: `/images/objets/classeurs.png`,
        summary: `Actuellement en 3ᵉ année de BUT Informatique à l'IUT d'Amiens, après un Bac général mention Bien au lycée Pablo Neruda de Dieppe.`,
        details: [
          {titre: `Lycée & Avant-Bac`, texte: `Mes années lycée à Dieppe. D'abord au lycée Ango en seconde, j'ai ensuite intégré le lycée Pablo Neruda pour la spécialité NSI (Numérique et Sciences Informatiques) en première et terminale, en plus de la spécialité Mathématiques. J'ai eu mon BAC général avec la mention Bien, option Euro et Maths Expertes ainsi que la certification Cambridge anglais niveau B1 et le BIA (Brevet d'Initiation Aéronautique).`},
          {titre: `Mes Racines`, texte: `Saint Nicolas d'Aliermont est la ville dans laquelle j'ai grandi. J'y ai passé toute mon enfance et mon adolescence. L'école élémentaire et le collège étaient tous deux dans cette commune.`},
          {titre: `BUT Informatique`, texte: `Actuellement étudiant à l'IUT d'Amiens. J'y perfectionne mes compétences en développement, en mathématiques, en communication et en gestion de projets informatiques. Je passe en troisième année de BUT (Bac+3) à la rentrée 2026.`}
        ],
        bullets: [
          `BUT Informatique — IUT d'Amiens (bac+3, promo 2026)`,
          `Lycée Pablo Neruda — Dieppe (NSI, Maths, option Euro et Maths Expertes, bac général mention Bien)`,
        ],
      },
    ],
  },

  // ── EXPERIENCES ─────────────────────────────────────────────
  {
    categorie: `Expériences`,
    items: [
      {
        id: `edf`,
        label: `Stage développeur SI`,
        svgId: `/images/experience/cnpe.png`,
        summary: `8 semaines à EDF Centrale de Penly — maintenance d'une application de gestion d'accès aux locaux.`,
        details: [
          { titre: `Le contexte`, texte: `On ne peut naturellement pas entrer dans n'importe quel local dans une centrale nucléaire, il faut pour cela faire une demande d'accès sur une certaine application interne. Or, à mon arrivée, cette application rencontrait plusieurs bugs et problèmes d'ergonomie, ce qui rendait son utilisation délicate, voire quasi impossible. Elle a donc été mise en arrêt avant mon arrivée.` },
          { titre: `Comment je m'en suis sorti`, texte: `J'ai dans un premier temps analysé en détail l'application pour recenser les problèmes dans un document texte. Ensuite, après m'être approprié le code source, je me suis attaqué à la résolution de ces bugs un par un, tout en optimisant et améliorant le code et l'interface par la mise en place de tests. L'application a ensuite été rétablie en service. Elle s'accompagne désormais d'un guide d'utilisation et d'une documentation technique que j'ai élaborés.` },
          { titre: `Les difficultés rencontrées`, texte: `Mon principal frein était de comprendre le code source. En effet, il avait été écrit par un ancien alternant et ne possédait quasi aucun commentaire. Le nom des variables et des fonctions était souvent peu descriptif, ce qui rendait la lecture et la compréhension du code beaucoup plus fastidieuse. Cela m'a donc pris beaucoup de temps, mais m'a aussi permis de davantage maîtriser le code, ce qui m'a probablement fait gagner du temps sur ma phase de "nettoyage" finale.` },
          { titre: `Ce que j'en retire`, texte: `Cette expérience m'a appris à pratiquer de l'informatique dans un milieu professionnel exigeant. Il était donc essentiel de respecter les bonnes procédures et mesures de sécurité, à la fois sur le plan technique et organisationnel. Elle m'a également permis d'adopter une posture professionnelle adaptée, notamment côté relationnel.` },
        ],
        media: [
          { 
            src: `/images/pdf/edf-app.png`, 
            caption: `L'interface de l'application`,
            link: `/images/pdf/edf-app.png`
          },
          { 
            src: `/images/pdf/edf-affiche.png`, 
            caption: `Affiche explicative`,
            link: `/images/pdf/edf-affiche.pdf`
          },
        ],
        env: `Python, Flask, HTML/CSS, MySQL`,
        tasks: [
          `Maintenance corrective : résolution de bugs sur l'application de gestion d'accès.`,
          `Optimisation du workflow de gestion des accès.`,
          `Rédaction de modes opératoires et supports techniques.`,
        ],
      },
      {
        id: `earl`,
        label: `Ouvrier agricole saisonnier`,
        svgId: `/images/experience/champ.png`,
        summary: `Été 2025 — désherbage manuel de champs de carottes et betteraves à la ferme du Pavé Bio.`,
        details: [
          { titre: `Le concept`, texte: `Le concept est assez original : Nous étions 9, allongés derrière un tracteur qui suivait les lignes de champs, et nous avions pour unique objectif de désherber les cultures de carottes/betteraves. Le tracteur ne s'arrêtait pas, nous devions donc parfois sélectionner les mauvaises herbes et les retirer promptement plutôt que d'en retirer davantage mais en laissant les racines.` },
          { titre: `Ce que j'en retire`, texte: `Cette expérience était une vraie mise à l'épreuve de ma motivation, surtout dans un environnement physique tel que celui-ci, face aux conditions météorologiques parfois rudes. Cette expérience était positive, dans le sens ou j'ai pu contribuer au domaine vital qu'est l'agriculture, domaine qui m'intéresse et que je pourrais explorer de nouveau dans le futur.` },
        ],
        media: [],
        tasks: [
          `Désherbage manuel de champs de carottes et betteraves.`,
          `Motivation et endurance physique face aux conditions météorologiques et à la nature du travail.`,
        ],
      },
      {
        id: `boutique-micro`,
        label: `Stage d'observation (3ème)`,
        svgId: `/images/experience/boutique.png`,
        summary: `Février 2021 — premier contact avec le monde professionnel dans une boutique informatique.`,
        details: [
          { titre: `La découverte`, texte: `Mon premier contact avec le monde professionnel s'est déroulé dans une boutique de réparation informatique pour mon stage de 3ème. Il m'a permis de découvrir ce qu'est un "petit commerce" dans le domaine de l'informatique.` },
          { titre: `Ce que j'en retire`, texte: `Cette expérience m'a confirmé que je voulais réellement travailler dans le domaine de l'informatique, mais pas la réparation matérielle, puisque ce n'est pas une branche qui m'intéresse.` },
        ],
        media: [],
        tasks: [
          `Participation au diagnostic des pannes matérielles et logicielles.`,
          `Assistance aux réparations et à la maintenance.`,
        ],
      },
    ],
},

  // ── COMPETENCES ─────────────────────────────────────────────
  {
    categorie: `Compétences`,
    items: [
      {
        id: `tiroir`,
        label: `Mes compétences`,
        svgId: `/images/tiroir-ouvert.svg`,
        summary: `L'ensemble des compétences techniques et bureautiques que j'ai pu acquérir durant ma formation et mon stage.`,
        details: [{titre: null, texte: null}],
        bullets: [
          `Back-end : Python/Flask, PHP/Laravel, Java, C/C++/C#, Node.js`,
          `Front-end : HTML/CSS, JS, React, Bootstrap, Tailwind`,
          `BDD : MySQL, NoSQL (Mongo, Elastic)`,
          `Outils : Git, Linux, Figma, Canva, Office`,
        ],
      },
    ],
  },

  // ── IA ──────────────────────────────────────────────────────
  {
    categorie: `IA`,
    items: [
      {
        id: `gemini`,
        label: `L'intelligence artificielle`,
        svgId: null,
        summary: `Mon lien avec l'IA et la façon dont elle m'aide pour mes projets informatiques ou divers.`,
        details: [{titre: `Posez une question sur mon rapport à l'ia`, texte: `Clément s'est énormément intéressé à l'intelligence artificielle et ce qu'elle permet de faire d'incroyable. Concrètement dans ce projet, cela lui a servi pour générer cette chambre à partir de rien. Comme tout développeur moderne, Clément se sert de l'ia comme outil pour l'assister dans ses différents projets et gagner un temps considérable qu'il a pu réinvestir dans la créativité et les détails qui font la différence. Ce qu'il aime avec l'ia, c'est de partir d'une idée et de pouvoir la concrétiser très rapidement même sans en avoir les compétences techniques.`}],
        bullets: [`Génération d'images`, `Assistance au développement`],
      },
    ],
  },

  // ── MUSIQUE ─────────────────────────────────────────────────
  {
    categorie: `Musique`,
    items: [
      {
        id: `saxophone`,
        label: `Jouer de la musique`,
        svgId: `/images/objets/saxophone.png`,
        summary: `1 an de trombone, 9 ans de saxophone (alto & ténor) dont 4 ans en harmonie municipale.`,
        details: [
        {
          titre: `Le parcours`,
          texte: `Ayant commencé par un an de trombone, j'ai ensuite enchainé avec 9 ans de saxophone et 4 ans en harmonie municipale.`
        },
        {
          titre: `Les instruments`,
          texte: `J'ai un saxophone personnel (alto) mais j'ai eu l'opportunité de jouer avec un ténor pour l'harmonie.`
        },
        {
          titre: `Le style`,
          texte: `J'aime beaucoup jouer des musiques très célèbres, peu importe le style.`
        },
      ],
      },
      {
        id: `platine`,
        label: `Mixer la musique`,
        svgId: `/images/objets/platine.png`,
        summary: `Maîtriser les bases du mixage avec une platine DJ est ma future passion musicale à explorer.`,
        details: [{titre: `l'art de la transition`, texte: `On m'a offert une platine DJ pour mon anniversaire. Malheureusement, je n'ai pas encore eu l'occasion de vraiment l'expérimenter car j'ai du mal à trouver un logiciel qui utilise Deezer en tant que source et les performances de mon ordinateur portable ne sont pas suffisantes. Mais le mixage est un domaine qui m'intéresse et que je vais manipuler à l'avenir.`}],
      },
      {
        id: `piano`,
        label: `Créer de la musique`,
        svgId: `/images/objets/piano.png`,
        summary: `J'utilise FL Studio et un clavier MIDI pour composer des mélodies et lier l'informatique à la musique.`,
        details: [{titre: `lier l'informatique et la musique`, texte: `La composition musicale est un moyen d'exprimer ma créativité par le biais de l'informatique. J'utilise FL Studio pour composer des mélodies, en me servant d'un clavier MIDI que je branche à mon ordinateur. Mon rêve : créer le hit de l'année pour un artiste !`}],
      },
    ],
  },

  // ── SPORT ───────────────────────────────────────────────────
  {
    categorie: `Sport`,
    items: [
      {
        id: `basket`,
        label: `La course à pied`,
        svgId: `/images/objets/basket.png`,
        summary: `Je participe à des trails et courses locales régulièrement, tout en courant de façon hebdomadaire.`,
        details: [
          {titre: `Ma nouvelle passion`, texte: `Le cross du collège/lycée était pour moi un supplice, je n'aimais pas du tout. Mais depuis quelques années, à force de courir avec régulièrement pour me maintenir en forme, je prends désormais réellement du plaisir pour ce sport.`},
          {titre: null, texte: `J'ai couru le XTrail de l'association Macadam à Saint Nicolas d'Aliermont cette année + l'année dernière, le trail de la forêt d'Eu mais aussi la Course du château à Troissereux. Je cours souvent seul des 5km, mais aussi plus d'une dizaine de kilomètres avec mes amis ou ma famille.`},
        ],
        bullets: [
          `5-10km hebdomadaires`,
          `Courses locales : XTrail Macadam, Trail de la forêt d'Eu, course du château à Troissereux`,
        ],
      },
      {
        id: `raquette-tennis`,
        label: `Le tennis`,
        svgId: `/images/objets/raquette-tennis.png`,
        summary: `Mon premier sport, que j'ai pratiqué pendant 7 ans. J'ai visité Roland-Garros plusieurs fois.`,
        details: [
          {titre: `Mon premier sport`, texte: `L'ayant pratiqué pendant 7 ans, je me suis ensuite tourné vers le tennis de table. Ce sport m'a donné goût aux sports de raquette, bien qu'étant très jeune je n'ai jamais fait de compétition.`},
          {titre: null, texte: `J'ai eu l'occasion d'aller plusieurs fois a Rolland Garros, ou j'ai pu croiser moult célébrités.`}
        ],
      },
      {
        id: `raquette-pingpong`,
        label: `Le tennis de table`,
        svgId: `/images/objets/raquette-pingpong.png`,
        summary: `3 ans de tennis de table avec quelques compétitions amicales en équipe.`,
        details: [{titre: `Compétition`, texte: `J'ai pratiqué du tennis de table pendant 3 ans pour donner un renouveau à la lassitude éprouvée par le tennis. J'ai eu l'occasion de faire quelques compétitions amicales majoritairement en équipe avec des matchs simples et doubles.`}],
      },
      {
        id: `ballon`,
        label: `Le football`,
        svgId: `/images/objets/ballon.png`,
        summary: `Fan de l'équipe de France et du PSG, je suis tous les matchs internationaux et joue souvent pour le plaisir.`,
        details: [
          {titre: `Jouer au football`, texte: `Non, je n'ai jamais joué au football dans un club. Mais j'ai toujours adoré ce sport et joue très souvent avec mon frère dans le jardin, mes amis au city ou même contre ma famille sur le jeu vidéo FIFA.`},
          {titre: `Le regarder`, texte: `Je ne manque aucun match de l'équipe de France masculine. Je suis supporter du PSG, bien que je supporte également le HAC (Le Havre), et même plus largement toutes les équipes françaises lors des compétitions internationales. Cela procure des sensations d'adrénaline que je ne rencontre nulle part ailleurs.`},
        ],
      },
      {
        id: `abwheel`,
        label: `Musculation`,
        svgId: `/images/objets/abwheel.png`,
        summary: `Gainage quotidien, ~30 pompes et 15 tractions par jour pour me maintenir en forme.`,
        details: [
          {titre: `Abdominaux`, texte: `Que ce soit par du gainage ou par des exercices variés, j'accorde une grande importance à l'entraînement de mes abdominaux.`},
          {titre: `Pompes`, texte: `Un exercice qui travaille un très grand nombre de muscles avec une multitude de variantes. Il suffit d'un tapis de sol pour en enchaîner un peu moins d'une trentaine.`},
          {titre: `Tractions`, texte: `J'effectue 15 tractions d'affilée chaque jour en variant les prises pour ainsi travailler les différents muscles du dos et des bras. C'est d'ailleurs l'un de mes exercices préférés.`},
        ],
        bullets: [
          `Abdominaux (planche, abwheel, lever de jambes)`,
          `Pompes (~30, variantes multiples)`,
          `Tractions (15/jour, prises variées)`,
        ],
      },
    ],
  },

  // ── LOISIRS ─────────────────────────────────────────────────
  {
    categorie: `Loisirs`,
    items: [
      {
        id: `livres`,
        label: `Lecture & écriture`,
        svgId: `/images/objets/livres.png`,
        summary: `De la BD d'enfance à Harry Potter et Monte-Cristo, avec un futur intérêt pour l'écriture`,
        details: [
          {titre: `Brûlez pour dévoiler`, texte: `Étant plus jeune et pour occuper l'intervalle entre mes deux cours de musique, je passais ce temps à la bibliothèque municipale, où je lisais et empruntais des bandes dessinées (Tintin, Astérix, Lucky Luke, Seuls, et bien plus). Ensuite s'est développée une passion pour les magazines Sciences&Vie Junior, qui m'ont permis de découvrir le monde de la science et de la technologie. Maintenant, après avoir lu quelques classiques par le lycée, j'ai décidé de lire l'intégralité des livres Harry Potter, pour ensuite enchainer avec les deux tomes du Comte de Monte-Cristo.`},
          {titre: null, texte: `J'aimerais maintenant explorer l'écriture, majoritairement pour moi, ou peut-être écrire des chansons, de la poésie, ou même des histoires. Je n'ai jamais essayé, mais je pense que cela pourrait me plaire et m'occuper de manière créative.`},
        ],
      },

    ],
  },

]

// ─── Helper : accès rapide par id ────────────────────────────
export function getItemById(id) {
  for (const cat of PORTFOLIO_CATEGORIES) {
    const found = cat.items.find(item => item.id === id)
    if (found) return found
  }
  return null
}