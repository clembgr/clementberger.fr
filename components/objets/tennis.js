import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';

export default function Tennis() {
  const DATA = getItemById('raquette-tennis');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const containerRef = useRef(null);
  const ballRef = useRef(null);
  const rafRef = useRef(null);

  const ballPos = useRef({ x: 30, y: 70 });
  const ballVel = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const loop = () => {
      if (!isDragging.current) {
        ballVel.current.y += 0.20;
        
        ballVel.current.x *= 0.985;
        ballVel.current.y *= 0.985;

        ballPos.current.x += ballVel.current.x;
        ballPos.current.y += ballVel.current.y;

        if (ballPos.current.y > 94) {
          ballPos.current.y = 94;
          ballVel.current.y *= -0.80; 
        }
        if (ballPos.current.y < 3) {
          ballPos.current.y = 3;
          ballVel.current.y *= -0.7;
        }
        if (ballPos.current.x < 3) {
          ballPos.current.x = 3;
          ballVel.current.x *= -0.7;
        }
        if (ballPos.current.x > 97) {
          ballPos.current.x = 97;
          ballVel.current.x *= -0.7;
        }
      }

      if (ballRef.current) {
        ballRef.current.style.left = `${ballPos.current.x}%`;
        ballRef.current.style.top = `${ballPos.current.y}%`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = 'default';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  const handlePointerMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newX = ((e.clientX - rect.left) / rect.width) * 100;
    const newY = ((e.clientY - rect.top) / rect.height) * 100;

    ballVel.current = {
      x: (newX - ballPos.current.x) * 0.8,
      y: (newY - ballPos.current.y) * 0.8
    };

    ballPos.current = { x: newX, y: newY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
    if (ballRef.current) ballRef.current.style.cursor = 'grab';
    
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);

    const preventClick = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      window.removeEventListener('click', preventClick, true);
    };
    window.addEventListener('click', preventClick, true);
    setTimeout(() => window.removeEventListener('click', preventClick, true), 50);
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    ballVel.current = { x: 0, y: 0 };
    document.body.style.cursor = 'grabbing';
    if (ballRef.current) ballRef.current.style.cursor = 'grabbing';
    
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  return (
    <div 
      ref={containerRef}
      id="tennis-container"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        padding: '4cqw 6cqw 9vh 6cqw', 
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'auto',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    >
      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '11cqw',
        fontWeight: 700,
        color: darkText,
        margin: '0 0 2cqw 0',
        textAlign: 'center',
        flexShrink: 0,
        pointerEvents: 'none'
      }}>
        {DATA.label}
      </h1>

      <div style={{ flex: 1, position: 'relative', width: '100%', pointerEvents: 'none' }}>
        
        <img 
          src="/images/raquette-tennis.svg" 
          alt="Raquette de tennis"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            right: -115,
            bottom: 0,
            width: '110%',
            height: '110%',
            objectFit: 'cover',
            opacity: 0.85,
            objectPosition: 'rightbottom',
          }}
        />

        <div style={{
          position: 'absolute',
          top: '12%',
          left: '42%',
          transform: 'translateX(-50%)',
          width: '50cqw',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5cqw'
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '5cqw',
            fontWeight: 700,
            color: darkGreen,
            letterSpacing: '0.05em',
            margin: 0
          }}>
            {DATA.details[0].titre}
          </h2>
          <div style={{ width: '12cqw', height: '3px', background: darkGreen }} />
        </div>

        <p style={{
          position: 'absolute',
          top: '33.5%',
          left: '45%',
          transform: 'translate(-50%, -50%)',
          width: '55cqw',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4cqw',
          fontWeight: 600,
          color: darkText,
          lineHeight: 1.4,
          margin: 0,
          textAlign: 'center'
        }}>
          {DATA.details[0].texte}
        </p>

        <p style={{
          position: 'absolute',
          top: '55%',
          left: '57%',
          transform: 'translate(-50%, -50%)',
          width: '42cqw',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4cqw',
          fontWeight: 600,
          color: darkText,
          lineHeight: 1.4,
          margin: 0,
          textAlign: 'center'
        }}>
          {DATA.details[1].texte}
        </p>

      </div>

      <img 
        ref={ballRef}
        src="/images/objets/balle-tennis.svg"
        alt="Balle de tennis"
        onPointerDown={handlePointerDown}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{
          position: 'absolute',
          width: '8cqw',
          height: 'auto',
          cursor: 'grab',
          transform: 'translate(-50%, -50%)',
          touchAction: 'none',
          zIndex: 20,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
          pointerEvents: 'auto'
        }}
      />
    </div>
  );
}