import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';



export default function Abwheel() {
  const DATA = getItemById('abwheel');

  const darkGreen = '#1b3b22'; 
  const darkText = '#503214f2';

  return (
    <div 
      id="abwheel-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        padding: '80px 60px',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style>{`
        #abwheel-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <img
        src="/images/objets/abwheel.svg"
        alt="ab wheel"
        style={{
          width: '55%',
          opacity: 0.85,
          objectFit: 'contain',
          alignSelf: 'center',
          flexShrink: 0,
        }}
        draggable={false}
      />

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px', 
        flexShrink: 0, 
        paddingBottom: '80px'
      }}>
        
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '11cqw',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: darkText,
          margin: 0,
          lineHeight: 1,
        }}>
          {DATA.label}
        </h1>

        <ul style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          margin: 0,
          padding: '0 0 0 50px', 
          listStyleType: 'disc',
          color: darkGreen, 
        }}>
          
          <li style={{ paddingLeft: '15px' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '5cqw',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: darkGreen,
              margin: '0 0 15px 0',
              lineHeight: 1.2,
              textTransform: 'lowercase',
            }}>
              {DATA.details[0].titre}
            </h2>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '3.5cqw',
              fontWeight: 600,
              color: darkText,
              lineHeight: 1.5,
              margin: 0,
            }}>
              {DATA.details[0].texte}
            </p>
          </li>

          <li style={{ paddingLeft: '15px' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '5cqw',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: darkGreen,
              margin: '0 0 15px 0',
              lineHeight: 1.2,
              textTransform: 'lowercase',
            }}>
              {DATA.details[1].titre}
            </h2>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '3.5cqw',
              fontWeight: 600,
              color: darkText,
              lineHeight: 1.5,
              margin: 0,
            }}>
              {DATA.details[1].texte}
            </p>
          </li>

          <li style={{ paddingLeft: '15px' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '5cqw',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: darkGreen,
              margin: '0 0 15px 0',
              lineHeight: 1.2,
              textTransform: 'lowercase',
            }}>
              {DATA.details[2].titre}
            </h2>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '3.5cqw',
              fontWeight: 600,
              color: darkText,
              lineHeight: 1.5,
              margin: 0,
            }}>
              {DATA.details[2].texte}
            </p>
          </li>

        </ul>
      </div>
    </div>
  )
}