import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


export default function Avenir() {
  const DATA = getItemById('fenetre');

  const darkGreen = '#1b3b22';
  const darkText = '#503214f2';

const VISIONS_NORMALES = [
  { date: "Aujourd'hui", titre: DATA.details[0].titre, desc: DATA.details[0].texte },
  { date: "2027", titre: DATA.details[1].titre, desc: DATA.details[1].texte },
  { date: "2029", titre: DATA.details[2].titre, desc: DATA.details[2].texte },
  { date: "2030+", titre: DATA.details[3].titre, desc: DATA.details[3].texte }
];

  const VISIONS_RARES = [
    { date: "???", titre: "Berger", desc: "Tout plaquer pour élever des moutons pour vivre en corrélation avec mon nom de famille." },
    { date: "2042", titre: "Remplacé par l'IA", desc: "On s'y approche de plus en plus..." }
  ];

  const [rubbingAmount, setRubbingAmount] = useState(0); 
  const [visionsDecouvertes, setVisionsDecouvertes] = useState([]); 
  const [etapeCourante, setEtapeCourante] = useState(0);
  
  const lastMousePos = useRef({ x: 0, y: 0 });
  const rubbingAccumulator = useRef(0);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null); 

  const blockPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [visionsDecouvertes]);

  const handlePointerMove = (e) => {
    if (etapeCourante >= VISIONS_NORMALES.length) return;

    if (!lastMousePos.current.x) {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const dx = Math.abs(e.clientX - lastMousePos.current.x);
    const dy = Math.abs(e.clientY - lastMousePos.current.y);
    const distance = dx + dy;
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (distance > 0) {
      rubbingAccumulator.current += distance * 0.25;
      
      if (rubbingAccumulator.current >= 100) {
        rubbingAccumulator.current = 0;
        setRubbingAmount(0);
        declencherVision();
      } else {
        setRubbingAmount(rubbingAccumulator.current);
      }
    }
  };

  const handlePointerLeave = () => {
    lastMousePos.current = { x: 0, y: 0 };
    rubbingAccumulator.current = Math.max(0, rubbingAccumulator.current - 10);
    setRubbingAmount(rubbingAccumulator.current);
  };

  const declencherVision = () => {
    const isRare = Math.random() < 0.15;
    let nouvelleVision;

    if (isRare) {
      const rareIndex = Math.floor(Math.random() * VISIONS_RARES.length);
      nouvelleVision = { ...VISIONS_RARES[rareIndex], isRare: true, id: Date.now() };
    } else {
      nouvelleVision = { ...VISIONS_NORMALES[etapeCourante], isRare: false, id: Date.now() };
      setEtapeCourante(prev => prev + 1);
    }

    setVisionsDecouvertes(prev => [...prev, nouvelleVision]);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setVisionsDecouvertes([]);
    setEtapeCourante(0);
    rubbingAccumulator.current = 0;
    setRubbingAmount(0);
  };

  return (
    <div 
      onClick={blockPropagation}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        padding: '4cqw 6cqw 12vh 6cqw', 
        position: 'relative',
        pointerEvents: 'auto',
        overflow: 'hidden'
      }}
    >
      <style>{`
        .visions-scroll::-webkit-scrollbar { display: none; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* BOUTON RECACHER */}
      {visionsDecouvertes.length > 0 && (
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            bottom: '14vh', 
            right: '6cqw',
            padding: '1cqw 2cqw',
            backgroundColor: 'transparent',
            color: darkGreen,
            border: `2px solid ${darkGreen}`,
            borderRadius: '6px',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '2.5cqw',
            fontWeight: 700,
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = darkGreen; e.currentTarget.style.color = '#FAD799'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = darkGreen; }}
        >
          Recacher
        </button>
      )}

      {/* EN-TÊTE FIXE */}
      <div style={{ textAlign: 'center', flexShrink: 0, zIndex: 10, marginBottom: '2cqw' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '11cqw',
          fontWeight: 700,
          color: darkText,
          margin: 0
        }}>
          {DATA.label}
        </h1>
      </div>

      {/* ZONE D'AFFICHAGE */}
      <div 
        ref={scrollContainerRef}
        className="visions-scroll"
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '3cqw',
          overflowY: 'auto',
          paddingBottom: '2cqw', 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {visionsDecouvertes.length === 0 && (
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '4cqw',
            fontWeight: 600,
            color: darkGreen,
            margin: 'auto 0',
            textAlign: 'center'
          }}>
            Caressez la boule de cristal pour voir l'avenir
          </p>
        )}

        {visionsDecouvertes.map((vision) => (
          <div 
            key={vision.id}
            style={{
              textAlign: 'center',
              width: '80%',
              backgroundColor: 'rgba(250, 215, 153, 0.95)',
              padding: '3cqw',
              borderRadius: '12px',
              border: `4px solid ${vision.isRare ? '#d9534f' : darkGreen}`, 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              animation: 'slideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '3.6cqw', 
              fontWeight: 700,
              color: vision.isRare ? '#d9534f' : darkGreen,
              letterSpacing: '0.1em'
            }}>
              {vision.date}
            </div>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '5.5cqw', 
              fontWeight: 700,
              color: darkText,
              margin: '0.5cqw 0',
              textTransform: 'lowercase',
              lineHeight: 1
            }}>
              {vision.titre}
            </h2>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '4cqw', 
              fontWeight: 600,
              color: 'rgba(80, 50, 20, 0.8)', 
              lineHeight: 1.4,
              margin: 0
            }}>
              {vision.desc}
            </p>
          </div>
        ))}
      </div>

      {/* LA BOULE DE CRISTAL */}
      <div style={{ 
        flexShrink: 0, 
        display: 'flex', 
        justifyContent: 'center', 
        paddingTop: '2cqw' 
      }}>
        <div 
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            position: 'relative',
            width: '35cqw',
            height: '35cqw',
            borderRadius: '50%',
            cursor: etapeCourante >= VISIONS_NORMALES.length ? 'default' : 'crosshair',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: `1px solid rgba(255, 255, 255, 0.3)`,
            boxShadow: `
              inset 0 0 30px rgba(0,0,0,0.1), 
              0 15px 30px rgba(0,0,0,0.1),
              0 0 ${rubbingAmount}px rgba(27, 59, 34, ${rubbingAmount / 100})
            `,
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 40%)',
            pointerEvents: 'none'
          }} />

          {etapeCourante < VISIONS_NORMALES.length && (
            <div style={{
              position: 'absolute',
              inset: '10%',
              borderRadius: '50%',
              backgroundColor: darkGreen,
              opacity: (rubbingAmount / 100) * 0.8,
              filter: 'blur(10px)',
              transform: `scale(${0.5 + (rubbingAmount / 100) * 0.5})`,
              transition: 'all 0.1s ease-out',
              pointerEvents: 'none'
            }} />
          )}

          {etapeCourante >= VISIONS_NORMALES.length && (
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '3cqw',
              fontWeight: 700,
              color: darkGreen,
              textAlign: 'center',
              zIndex: 10
            }}>
              Le futur n'a<br/>plus de secrets.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}