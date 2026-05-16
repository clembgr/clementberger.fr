import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap"
          rel="stylesheet"
        />

        <meta name="description" content="Portfolio de Clément Berger — Étudiant en BUT Informatique à Amiens, développeur informatique passionné de design, de musique et de sport. Venez explorer ma chambre interactive !" />
        <meta name="keywords" content="Clément Berger, portfolio, développeur web, BUT Informatique, Amiens, Next.js, React, stage EDF, Dieppe, Saint Nicolas d'Aliermont, Clément, BERGER, berger" />
        <meta name="author" content="Clément Berger" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://clementberger.fr" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://clementberger.fr" />
        <meta property="og:title" content="Portfolio — Clément Berger" />
        <meta property="og:description" content="Étudiant en BUT Informatique. Visitez mon portfolio immersif !" />
        <meta property="og:image" content="https://clementberger.fr/images/og-preview.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Portfolio Clément Berger" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio — Clément Berger" />
        <meta name="twitter:description" content="Étudiant en BUT Informatique. Visitez mon portfolio immersif !" />
        <meta name="twitter:image" content="https://clementberger.fr/images/og-preview.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Clément Berger",
            "url": "https://clementberger.fr",
            "jobTitle": "Étudiant BUT Informatique",
            "alumniOf": "IUT d'Amiens",
            "knowsAbout": ["Développement web", "React", "Next.js", "Design UI", "Musique", "Sport", "Informatique"],
            "sameAs": [
              "https://linkedin.com/in/clembgr/",
              "https://github.com/clembgr"
            ]
          })}}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}