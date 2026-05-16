import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';



export default function Football() {
  const DATA = getItemById('ballon');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  return (
    <div 
      id="football-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        padding: '4cqw 6cqw 16vh 6cqw', 
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style>{`
        #football-container::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Titre principal */}
      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '12cqw',
        fontWeight: 700,
        color: darkText,
        margin: '0 0 2cqw 0',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        {DATA.label}
      </h1>

      {/* Conteneur principal (Terrain + Textes) */}
      <div style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        
        {/* Le terrain */}
        <img
          src="/images/objets/football.svg"
          alt="Terrain de football"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain', 
            opacity: 0.85,
            pointerEvents: 'none',
          }}
          draggable={false}
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}>

          {/* Titre Haut */}
          <h2 style={{
            position: 'absolute',
            top: '8%', 
            left: '50%',
            transform: 'translateX(-50%)',
            width: '92%',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '5cqw',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: darkGreen,
            margin: 0,
            textAlign: 'center',
          }}>
            {DATA.details[0].titre}
          </h2>

          {/* Paragraphe Haut */}
          <p style={{
            position: 'absolute',
            top: '22%', 
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3.6cqw',
            fontWeight: 600,
            color: darkText,
            lineHeight: 1.45,
            margin: 0,
            textAlign: 'justify',
          }}>
            {DATA.details[0].texte}
          </p>

          {/* Paragraphe Bas - Remonté au centre du demi-terrain */}
          <p style={{
            position: 'absolute',
            bottom: '16.5%', 
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3.6cqw',
            fontWeight: 600,
            color: darkText,
            lineHeight: 1.45,
            margin: 0,
            textAlign: 'justify',
          }}>
            {DATA.details[1].texte}
          </p>

          {/* Titre Bas */}
          <h2 style={{
            position: 'absolute',
            bottom: '8%', 
            left: '50%',
            transform: 'translateX(-50%)',
            width: '92%',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '5cqw',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: darkGreen,
            margin: 0,
            textAlign: 'center',
          }}>
            {DATA.details[1].titre}
          </h2>

        </div>
      </div>
    </div>
  );
}