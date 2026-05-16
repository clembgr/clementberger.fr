import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


export default function Formation() {
  const DATA = getItemById('classeurs');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const VILLES = {
    dieppe: {
      id: 'dieppe',
      nom: 'Dieppe',
      svgX: 34.36,
      svgY: 26.76,
      lineLength: 6,       
      lineAngle: -140,     
      textPos: 'left',     
      titre: DATA.details[0].titre,
      description: DATA.details[0].texte
    },
    sna: {
      id: 'sna',
      nom: "St-Nicolas-d'Aliermont",
      svgX: 38.61,
      svgY: 29.15,
      lineLength: 8,       
      lineAngle: 30,       
      textPos: 'right',    
      titre: DATA.details[1].titre,
      description: DATA.details[1].texte
    },
    amiens: {
      id: 'amiens',
      nom: 'Amiens',
      svgX: 71.52,
      svgY: 28.79,
      lineLength: 7,
      lineAngle: -35,      
      textPos: 'right',
      titre: DATA.details[2].titre,
      description: DATA.details[2].texte
    }
  };

  const [villeActive, setVilleActive] = useState('amiens');

  const blockPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const MAP_SCALE   = 105;   
  const MAP_OFFSET_X = 0;  
  const MAP_OFFSET_Y = 0;   
  
  const SVG_RATIO = 1712 / 1681;

  return (
    <div
      onClick={blockPropagation}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      <div style={{
        position: 'absolute',
        top: `${MAP_OFFSET_Y}cqw`,
        left: `${MAP_OFFSET_X}cqw`,
        width: `${MAP_SCALE}cqw`,
        height: `${MAP_SCALE * SVG_RATIO}cqw`,
        zIndex: 1,
      }}>
        <img
          src="/images/carte.svg"
          alt="Carte des formations"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {Object.values(VILLES).map((ville) => {
          const isActive = villeActive === ville.id;
          return (
            <div
              key={ville.id}
              style={{
                position: 'absolute',
                left: `${ville.svgX}%`,
                top: `${ville.svgY}%`,
                zIndex: isActive ? 20 : 10,
                pointerEvents: 'none', 
              }}
            >
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${ville.lineLength}cqw`,
                height: '2px',
                backgroundColor: isActive ? darkGreen : 'rgba(27,59,34,0.4)',
                transformOrigin: '0 50%',
                transform: `translate(0, -1px) rotate(${ville.lineAngle}deg)`,
                transition: 'all 0.3s ease',
                zIndex: 1,
              }}>
                <div style={{
                  position: 'absolute',
                  left: '100%',
                  top: '1px',
                  transformOrigin: '0 0',
                  transform: `rotate(${-ville.lineAngle}deg)`,
                  width: 0,
                  height: 0,
                }}>
                  <span
                    onClick={(e) => { blockPropagation(e); setVilleActive(ville.id); }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: ville.textPos === 'left' ? '-0.5cqw' : '0.5cqw',
                      transform: `translate(${ville.textPos === 'left' ? '-100%' : '0'}, -50%)`,
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: isActive ? '4.5cqw' : '3.5cqw',
                      fontWeight: isActive ? 800 : 700,
                      color: isActive ? darkGreen : 'rgba(80, 50, 20, 0.75)',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {ville.nom}
                  </span>
                </div>
              </div>

              <div
                onClick={(e) => { blockPropagation(e); setVilleActive(ville.id); }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: 'translate(-50%, -50%)', 
                  width: isActive ? '3.2cqw' : '2.2cqw',
                  height: isActive ? '3.2cqw' : '2.2cqw',
                  backgroundColor: isActive ? '#1b3b22' : '#FAD799',
                  border: `3px solid ${darkGreen}`,
                  borderRadius: '50%',
                  boxShadow: isActive ? '0 0 15px rgba(27,59,34,0.6)' : '0 0 5px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'all 0.3s ease',
                  zIndex: 2,
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute',
        top: '5cqw',
        left: '5cqw',
        zIndex: 10,
        pointerEvents: 'none',
        maxWidth: '45%',
      }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '8cqw',
          fontWeight: 700,
          color: darkText,
          margin: 0,
          lineHeight: 1,
        }}>
          {DATA.label}
        </h1>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '3.5cqw',
          fontWeight: 600,
          color: darkGreen,
          margin: '1cqw 0 0 0',
        }}>
          Trois lieux, trois histoires
        </p>
      </div>

      {villeActive && (
        <div 
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '15vh', 
            right: '5cqw',
            top: '80cqw',
            width: '60%', 
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingBottom: '2cqw',
            zIndex: 10,
            pointerEvents: 'auto',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '6cqw',
            fontWeight: 700,
            color: darkGreen,
            margin: '0 0 1.5cqw 0',
            textTransform: 'lowercase',
            lineHeight: 1.1,
          }}>
            {VILLES[villeActive].titre}
          </h2>
          <div style={{
            width: '5cqw',
            height: '1.5px',
            background: darkGreen,
            marginBottom: '1.5cqw',
            flexShrink: 0,
          }} />
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3.4cqw',
            fontWeight: 600,
            color: darkText,
            lineHeight: 1.5,
            margin: 0,
            textAlign: 'justify',
          }}>
            {VILLES[villeActive].description}
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}