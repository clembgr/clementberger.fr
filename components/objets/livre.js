import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


export default function Livre() {

  const DATA = getItemById('livres');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const [flamePos, setFlamePos] = useState({ x: 0.5, y: 0.5 });
  const [isPressing, setIsPressing] = useState(false);
  const [isHovering, setIsHovering] = useState(false); 
  
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isAllRevealed, setIsAllRevealed] = useState(false);
  
  const containerRef = useRef(null);
  const bookRef = useRef(null);

  const handlePointerEnter = () => setIsHovering(true);

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPressing(true);

    if (isAllRevealed) return;

    if (bookRef.current) {
      const rect = bookRef.current.getBoundingClientRect();
      const bx = (e.clientX - rect.left) / rect.width;
      const by = (e.clientY - rect.top) / rect.height;
      setCurrentPath([{ x: bx, y: by }]);
    }
  };

  const handlePointerMove = (e) => {
    if (containerRef.current) {
      const cRect = containerRef.current.getBoundingClientRect();
      setFlamePos({
        x: (e.clientX - cRect.left) / cRect.width,
        y: (e.clientY - cRect.top) / cRect.height
      });
    }

    if (isPressing && bookRef.current && !isAllRevealed) {
      const rect = bookRef.current.getBoundingClientRect();
      const bx = (e.clientX - rect.left) / rect.width;
      const by = (e.clientY - rect.top) / rect.height;
      setCurrentPath(prev => [...prev, { x: bx, y: by }]);
    }
  };

  const handlePointerUp = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isPressing) {
      setIsPressing(false);
      if (currentPath.length > 0) {
        setPaths(prev => [...prev, currentPath]);
        setCurrentPath([]);
      }
    }
  };

  const handlePointerLeave = (e) => {
    setIsHovering(false);
    handlePointerUp(e);
  };

  const handleRevealAll = (e) => {
    e.stopPropagation();
    setIsAllRevealed(true);
  };

  const handleEraseAll = (e) => {
    e.stopPropagation();
    setIsAllRevealed(false);
    setPaths([]);
    setCurrentPath([]);
  };

  return (
    <div 
      ref={containerRef}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
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
        cursor: 'none',
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
    >
      {isHovering && (
        <style>{`
          div[class*="cursor"], div[class*="ring"] {
            opacity: 0 !important;
            visibility: hidden !important;
          }
        `}</style>
      )}

      {/* Titres */}
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
          Brûlez pour dévoiler
        </p>
      </div>

      {/* Zone du Livre */}
      <div 
        ref={bookRef}
        style={{ 
          flex: 1, 
          position: 'relative', 
          width: '100%', 
          transform: 'scale(1.10)',
          transformOrigin: 'left center', 
          marginLeft: '-9cqw',            
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Image du livre de fond */}
        <img 
          src="/images/livre-mur.png" 
          alt="Livre ouvert"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
          draggable={false}
        />

        {/* Masque SVG persistant */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
          <defs>
            <mask id="ink-mask" maskContentUnits="objectBoundingBox">
              <rect x="0" y="0" width="1" height="1" fill="black" />
              
              {paths.map((path, i) => (
                <polyline 
                  key={`p-${i}`} 
                  points={path.map(p => `${p.x},${p.y}`).join(' ')} 
                  stroke="white" 
                  strokeWidth="0.14" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
              ))}
              
              {currentPath.length > 0 && (
                <polyline 
                  points={currentPath.map(p => `${p.x},${p.y}`).join(' ')} 
                  stroke="white" 
                  strokeWidth="0.14" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  fill="none" 
                />
              )}

              {paths.map((path, i) => (
                <circle key={`c-${i}`} cx={path[0]?.x} cy={path[0]?.y} r="0.07" fill="white" />
              ))}
              {currentPath.length > 0 && (
                <circle cx={currentPath[0]?.x} cy={currentPath[0]?.y} r="0.07" fill="white" />
              )}
            </mask>
          </defs>
          
          <foreignObject width="100%" height="100%" mask={isAllRevealed ? "none" : "url(#ink-mask)"}>
            <div style={{ 
              color: '#5d4037',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '3.2cqw',
              lineHeight: 1.6,
              textAlign: 'justify',
              padding: '10cqw 15cqw 10cqw 12cqw',
              width: '100%',
              height: '100%',
              boxSizing: 'border-box'
            }}>
              <p>
                {DATA.details[0].texte}
              </p>
              <p>
                {DATA.details[1].texte}
              </p>
              <p style={{ marginTop: '2cqw', fontWeight: 700, fontStyle: 'italic' }}>
                Clément Berger
              </p>
            </div>
          </foreignObject>
        </svg>

        {/* Boutons de contrôle */}
        <div style={{
          position: 'absolute',
          bottom: '12cqw', 
          right: '13cqw', 
          display: 'flex',
          gap: '1cqw',
          zIndex: 20,
          pointerEvents: 'auto'
        }}>
          <button 
            onClick={handleEraseAll}
            style={{
              padding: '1cqw 2cqw',
              background: 'transparent',
              color: darkGreen,
              border: `2px solid ${darkGreen}`,
              borderRadius: '6px',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.5cqw',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Tout effacer
          </button>
          
          <button 
            onClick={handleRevealAll}
            style={{
              padding: '1cqw 2cqw',
              background: darkGreen,
              color: '#FAD799',
              border: `2px solid ${darkGreen}`,
              borderRadius: '6px',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '2.5cqw',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(27, 59, 34, 0.2)',
              transition: 'transform 0.1s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Tout révéler
          </button>
        </div>
      </div>

      <div style={{ 
        position: 'absolute',
        width: '80px',
        height: '80px',
        left: `${flamePos.x * 100}%`,
        top: `${flamePos.y * 100}%`,
        transform: `translate(-50%, -50%) scale(${isPressing ? 1.3 : 1})`,
        pointerEvents: 'none',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isHovering ? 1 : 0,
        transition: 'transform 0.1s ease, opacity 0.2s ease'
      }}>
        <img 
          src="/images/curseur.png"
          alt="Curseur personnalisé"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.6))',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}