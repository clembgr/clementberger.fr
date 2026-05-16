import { useState } from 'react';
import { getItemById } from '../../data/portfolio';

export default function Chaise() {
  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  
  const expEDF = getItemById('edf');
  const expEARL = getItemById('earl');
  const expMicro = getItemById('boutique-micro');

  
  const rawExperiences = [expEDF, expEARL, expMicro].filter(Boolean);

  
  const EXPERIENCES = rawExperiences.map((data, i) => ({
    id: i + 1,
    role: data.label,
    company: ['EDF - Centrale de Penly', 'EARL du Pavé Bio', 'La Boutique MICRO de Neufchâtel-en-Bray'][i] || 'Entreprise',
    date: ['Janv. – Mars 2026', 'Juin – Juillet 2025', 'Février 2021'][i] || 'Date',
    tasks: data.tasks || [],
    env: data.env ?? null,
    details: data.details?.at(-1)?.texte || "Aucun détail disponible."
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === EXPERIENCES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? EXPERIENCES.length - 1 : prev - 1));
  };

  
  if (EXPERIENCES.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
      containerType: 'inline-size',
      padding: '6cqw 6cqw 18vh 6cqw', 
      overflow: 'hidden',
    }}>
      
      <style>{`
        .chaise-card::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '11cqw',
        fontWeight: 700,
        color: darkText,
        margin: '0 0 4cqw 0',
        lineHeight: 1,
        textAlign: 'center',
        flexShrink: 0,
      }}>
        Mes expériences professionnelles
      </h1>

      <div style={{
        display: 'flex',
        alignItems: 'stretch', 
        justifyContent: 'center',
        flex: 1,
        position: 'relative',
        width: '100%',
        minHeight: 0,
      }}>
        
        <button 
          onClick={prevSlide}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            alignSelf: 'center',
            background: 'none',
            border: 'none',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '10cqw',
            color: darkGreen,
            cursor: 'pointer',
            padding: '2cqw',
            pointerEvents: 'auto',
            zIndex: 10,
            opacity: 0.8,
          }}
        >
          ‹
        </button>

        <div style={{
          flex: 1,
          overflow: 'hidden',
          margin: '0 2cqw',
          position: 'relative',
        }}>
          <div style={{
            display: 'flex',
            height: '100%', 
            transition: 'transform 0.4s ease-in-out',
            transform: `translateX(-${currentIndex * 100}%)`,
            width: '100%',
          }}>
            
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} style={{
                flex: '0 0 100%',
                height: '100%',
                boxSizing: 'border-box',
                padding: '1cqw',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div 
                  className="chaise-card" 
                  onWheel={(e) => e.stopPropagation()} 
                  onTouchMove={(e) => e.stopPropagation()} 
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    background: 'rgba(250, 215, 153, 0.4)',
                    border: `4px solid ${darkGreen}`,
                    borderRadius: '8px',
                    padding: '5cqw 4cqw',
                    boxShadow: '0 4px 12px rgba(27, 59, 34, 0.05)',
                    boxSizing: 'border-box',
                    pointerEvents: 'auto',
                    touchAction: 'pan-y', 
                  }}>
                  <h2 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '6cqw',
                    fontWeight: 700,
                    color: darkGreen,
                    margin: '0 0 1cqw 0',
                    lineHeight: 1.1,
                  }}>
                    {exp.role}
                  </h2>
                  <h3 style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '4.5cqw',
                    fontWeight: 600,
                    color: darkText,
                    margin: '0 0 0.5cqw 0',
                    lineHeight: 1.2,
                  }}>
                    {exp.company}
                  </h3>
                  <p style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '3.8cqw',
                    fontWeight: 500,
                    color: darkGreen,
                    margin: '0 0 3cqw 0',
                  }}>
                    {exp.date}
                  </p>

                  <ul style={{
                    margin: '0 0 3cqw 0',
                    paddingLeft: '5cqw',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5cqw',
                  }}>
                    {exp.tasks.map((task, i) => (
                      <li key={i} style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '3.6cqw',
                        fontWeight: 600,
                        color: darkText,
                        lineHeight: 1.4,
                      }}>
                        {task}
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: '3cqw' }}>
                    <h4 style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '4.2cqw',
                      fontWeight: 700,
                      color: darkGreen,
                      margin: '0 0 1cqw 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Ce que j'en retiens
                    </h4>
                    <p style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '3.8cqw',
                      fontWeight: 600,
                      color: darkText,
                      lineHeight: 1.5,
                      margin: 0,
                      textAlign: 'justify'
                    }}>
                      {exp.details}
                    </p>
                  </div>

                  {exp.env && (
                    <div style={{
                      marginTop: '3cqw',
                      paddingTop: '2cqw',
                      borderTop: `1px solid rgba(27, 59, 34, 0.2)`,
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '3.6cqw',
                      fontWeight: 700,
                      color: darkGreen,
                    }}>
                      Environnement : <span style={{ fontWeight: 600, color: darkText }}>{exp.env}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={nextSlide}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            alignSelf: 'center',
            background: 'none',
            border: 'none',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '10cqw',
            color: darkGreen,
            cursor: 'pointer',
            padding: '2cqw',
            pointerEvents: 'auto',
            zIndex: 10,
            opacity: 0.8,
          }}
        >
          ›
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2cqw',
        marginTop: '2cqw',
        flexShrink: 0,
      }}>
        {EXPERIENCES.map((_, index) => (
          <div 
            key={index} 
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              width: '2cqw',
              height: '2cqw',
              borderRadius: '50%',
              background: currentIndex === index ? darkGreen : 'rgba(27, 59, 34, 0.2)',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          />
        ))}
      </div>

    </div>
  );
}