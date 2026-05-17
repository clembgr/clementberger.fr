import { useState} from 'react';
import { getItemById } from '../../data/portfolio';

export default function QualiteValeur() {
  
  const DATA = getItemById('journal');
  
  const [showFaiblesse, setShowFaiblesse] = useState(false);

  const darkGreen = '#1b3b22';
  const darkText = '#503214f2';

  
  if (!DATA || !DATA.details) return null;

  const LIGNES_QUALITES = [
    { id: 1, top: 15, text: DATA.details[0].titre, isBold: true },
    { id: 2, top: 19.5, text: "Je veux toujours que mon travail soit parfait, quitte à", isBold: false },
    { id: 3, top: 24.5, text: "m'y investir plus que nécessaire. J'espère toujours pro-", isBold: false },
    { id: 4, top: 29.5, text: "-duire un travail de qualité, peu importe ma motivation.", isBold: false },
    { id: 6, top: 34, text: DATA.details[1].titre, isBold: true },
    { id: 7, top: 38.5, text: "Je sais m'adapter aux situations et adopter la bonne", isBold: false },
    { id: 8, top: 43, text: "posture face aux éventuels problèmes rencontrés dans", isBold: false },
    { id: 9, top: 48, text: "ma vie professionnelle et même personnelle.", isBold: false },
    { id: 10, top: 57, text: DATA.details[2].titre, isBold: true },
    { id: 11, top: 61.5, text: "J'accorde beaucoup d'importance au design et à", isBold: false },
    { id: 12, top: 66.5, text: "l'expérience utilisateur pour rendre la navigation agréa", isBold: false },
    { id: 13, top: 71, text: "ble sur un site internet", isBold: false },
    { id: 14, top: 76, text: DATA.details[3].titre, isBold: true },
    { id: 15, top: 80.5, text: "Je ne demande de l'aide que si besoin, et ne prends la", isBold: false },
    { id: 16, top: 85, text: "parole que de manière concise et à bon escient", isBold: false },
  ];

  const LIGNES_FAIBLESSE = [
    { id: 1, top: 15, text: "Ma faiblesse attachante :", isBold: false },
    { id: 2, top: 19.5, text: "Obstiné", isBold: true },
    { id: 3, top: 24.5, text: "Je suis parfois tellement absorbé par mes projets infor", isBold: false },
    { id: 4, top: 29.5, text: "matiques  que j'en oublie totalement la notion du temps.", isBold: false },
    { id: 5, top: 34, text: "Je suis parfois tellement motivé par quelque chose que", isBold: false },
    { id: 6, top: 38.5, text: `c'est "au détriment" d'autres priorités...`, isBold: false },
    { id: 7, top: 43, text: "Mais c'est ce qui fait ma détermination !", isBold: false },
  ];

  const currentLines = showFaiblesse ? LIGNES_FAIBLESSE : LIGNES_QUALITES;

  const toggleView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowFaiblesse(!showFaiblesse);
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        padding: '4cqw 6cqw 12vh 6cqw', 
        position: 'relative',
        pointerEvents: 'auto',
        overflow: 'hidden',
        alignItems: 'center',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap');
        .fade-text { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Titres fixes identiques des deux côtés */}
      <div style={{ textAlign: 'center', marginBottom: '2cqw', flexShrink: 0 }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '11cqw',
          fontWeight: 700,
          color: darkText,
          margin: 0
        }}>
          {DATA.label}
        </h1>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4cqw',
          fontWeight : '600',
          color: darkGreen,
          margin: 0
        }}>
          ce qui me définit au quotidien
        </p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1cqw', flexShrink: 0 }}>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4cqw',
          fontWeight: 600,
          color: 'rgba(80, 50, 20, 0.5)',
          letterSpacing: '0.1em',
          margin: 0
        }}>
          (Cliquez sur la page pour la tourner)
        </p>
      </div>

      {/* Wrapper de la feuille */}
      <div 
        onClick={toggleView}
        style={{
          position: 'relative',
          height: '100%',
          maxHeight: '100%',
          aspectRatio: '700 / 950', 
          containerType: 'inline-size',
          display: 'flex',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <img 
          src="/images/feuille-journal.svg" 
          alt="Feuille de journal"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill', 
            pointerEvents: 'none',
            filter: 'drop-shadow(0 15px 25px rgba(27, 59, 34, 0.15))' 
          }}
        />

        <div key={showFaiblesse} className="fade-text" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {currentLines.map((ligne) => (
            <span 
              key={ligne.id}
              style={{
                position: 'absolute',
                top: `${ligne.top}%`,
                left: '12%', 
                width: '82%', 
                fontFamily: "'Caveat', cursive",
                fontSize: '4.2cqi', 
                color: '#000000',
                fontWeight: ligne.isBold ? 700 : 500,
                letterSpacing: '0.02em',
                pointerEvents: 'none',
                zIndex: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {ligne.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}