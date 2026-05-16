import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


export default function Course() {
  const DATA = getItemById('basket');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      boxSizing: 'border-box',
      containerType: 'inline-size',
      padding: '4cqw 4cqw 9.5vh 0', 
    }}>
      
      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '12cqw',
        fontWeight: 700,
        color: darkText,
        textAlign: 'center',
        margin: '0 0 3cqw 4cqw', 
        lineHeight: 1,
        flexShrink: 0,
      }}>
        {DATA.label}
      </h1>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        minHeight: 0,
        gap: '4cqw',
      }}>
        
        {/* Container de l'image */}
        <div style={{
          flex: 1, 
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          height: '100%',
        }}>
          <img
            src="/images/objets/course.png"
            alt="Clément Berger en pleine course"
            style={{
              height: '100%',
              width: '125%',
              maxWidth: 'none',
              objectFit: 'contain',
              objectPosition: 'bottom left',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </div>

        {/* Colonne de droite */}
        <div 
          id="course-content-column"
          style={{
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            paddingRight: '2cqw',
          }}
        >
          <div 
            id="course-text-container"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingBottom: '2cqw',
            }}
          >
            <style>{`
              #course-text-container::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Div pour épouser la forme */}
            <div style={{
              float: 'left',
              width: '28cqw', 
              height: '100%', 
              shapeOutside: 'url(/images/silhouette.png)', 
              shapeMargin: '2cqw',
            }} />

            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '4.5cqw',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: darkGreen,
              margin: '0 0 1.5cqw 0',
              lineHeight: 1.2,
            }}>
              {DATA.details[0].titre}
            </h2>

            <div style={{
              width: '12cqw',
              height: '2px',
              background: darkGreen,
              marginBottom: '3cqw',
              flexShrink: 0,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3cqw' }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '3.5cqw',
                fontWeight: 600,
                color: darkText,
                lineHeight: 1.45,
                margin: 0,
                textAlign: 'justify',
              }}>
                {DATA.details[0].texte}
              </p>

              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '3.5cqw',
                fontWeight: 600,
                color: darkText,
                lineHeight: 1.45,
                margin: 0,
                textAlign: 'justify',
              }}>
                {DATA.details[1].texte}
              </p>
            </div>
          </div>

          <div style={{
            marginTop: 'auto',
            borderTop: `1px solid ${darkGreen}`,
            paddingTop: '3cqw',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2cqw',
            flexShrink: 0,
            paddingBottom: '2cqw',
          }}>
            <p style={{ 
                fontFamily: 'Cormorant Garamond, serif', 
                fontSize: '3.2cqw', 
                color: darkText, 
                margin: 0 
            }}>
                Mes activités sur Garmin : 
                <a 
                    href="https://connect.garmin.com/app/profile/d30e2dfe-dced-4af0-9718-d147b529e6a6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    style={{ pointerEvents: 'all', color: darkGreen, marginLeft: '1.5cqw', fontWeight: 700, textDecoration: 'underline' }}
                >
                    cliquez ici
                </a>
            </p>
            <p style={{ 
                fontFamily: 'Cormorant Garamond, serif', 
                fontSize: '3.2cqw', 
                color: darkText, 
                margin: 0 
            }}>
                Mes activités sur Strava : 
                <a 
                    href="https://strava.app.link/vyIMftjo02b" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    style={{ pointerEvents: 'all', color: '#FC4C02', marginLeft: '1.5cqw', fontWeight: 700, textDecoration: 'underline' }}
                >
                    cliquez ici
                </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}