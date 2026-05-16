import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


export default function PingPong() {
  const DATA = getItemById('raquette-pingpong');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ ai: 0, player: 0 });

  const gameAreaRef = useRef(null);
  const ballRef = useRef(null);
  const aiRef = useRef(null);
  const playerRef = useRef(null);
  const rafRef = useRef(null);

  const ball = useRef({ x: 90, y: 75, dx: 0.6, dy: 0.4 });
  const aiY = useRef(65);
  const playerY = useRef(30);
  const keys = useRef({ up: false, down: false });

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') keys.current.up = true;
      if (e.key === 'ArrowDown') keys.current.down = true;
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') keys.current.up = false;
      if (e.key === 'ArrowDown') keys.current.down = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      if (keys.current.up) playerY.current = Math.max(9, playerY.current - 1.5);
      if (keys.current.down) playerY.current = Math.min(91, playerY.current + 1.5);

      if (aiY.current < ball.current.y - 2) aiY.current += 0.5;
      if (aiY.current > ball.current.y + 2) aiY.current -= 0.5;
      aiY.current = Math.max(9, Math.min(91, aiY.current));

      ball.current.x += ball.current.dx;
      ball.current.y += ball.current.dy;

      if (ball.current.y <= 2.5 || ball.current.y >= 97.5) {
        ball.current.dy *= -1;
      }

      
      
      if (ball.current.x <= 5 && ball.current.dx < 0) {
        if (Math.abs(ball.current.y - aiY.current) < 12) {
          ball.current.dx *= -1.05;
          ball.current.dy += (ball.current.y - aiY.current) * 0.05;
        }
      }
      if (ball.current.x >= 95 && ball.current.dx > 0) {
        if (Math.abs(ball.current.y - playerY.current) < 12) {
          ball.current.dx *= -1.05;
          ball.current.dy += (ball.current.y - playerY.current) * 0.05;
        }
      }

      if (ball.current.x < -2) {
        setScore(s => ({ ...s, player: s.player + 1 }));
        resetBall(1);
      }
      if (ball.current.x > 102) {
        setScore(s => ({ ...s, ai: s.ai + 1 }));
        resetBall(-1);
      }

      if (ballRef.current) {
        ballRef.current.style.left = `${ball.current.x}%`;
        ballRef.current.style.top = `${ball.current.y}%`;
      }
      if (aiRef.current) aiRef.current.style.top = `${aiY.current}%`;
      if (playerRef.current) playerRef.current.style.top = `${playerY.current}%`;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  const resetBall = (direction) => {
    ball.current = { x: 50, y: 50, dx: 0.6 * direction, dy: (Math.random() - 0.5) };
  };

  const resetGame = () => {
    ball.current = { x: 90, y: 75, dx: 0.6, dy: 0.4 };
    aiY.current = 65;
    playerY.current = 30;
    if (ballRef.current) {
      ballRef.current.style.left = '90%';
      ballRef.current.style.top = '75%';
    }
    if (aiRef.current) aiRef.current.style.top = '65%';
    if (playerRef.current) playerRef.current.style.top = '30%';
  };

  const handlePointerMove = (e) => {
    if (!isPlaying || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    playerY.current = Math.max(9, Math.min(91, y));
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setScore({ ai: 0, player: 0 });
      resetGame();
    } else {
      setIsPlaying(true);
      ball.current = { x: 50, y: 50, dx: 0.6, dy: (Math.random() - 0.5) };
      aiY.current = 50;
      playerY.current = 50;
    }
  };

  return (
    <div 
      id="pingpong-container"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onPointerMove={handlePointerMove}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        padding: '4cqw 6cqw 9.5vh 6cqw',
        position: 'relative',
        pointerEvents: 'auto', 
        cursor: isPlaying ? 'none' : 'default',
        overflow: 'hidden',
      }}
    >
      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '11cqw',
        fontWeight: 700,
        color: darkText,
        margin: '0 0 2cqw 0',
        textAlign: 'center',
        zIndex: 5,
        pointerEvents: 'none',
        flexShrink: 0,
      }}>
        {DATA.label}
      </h1>

      <div 
        ref={gameAreaRef} 
        style={{ 
          flex: 1, 
          position: 'relative', 
          width: '100%' 
        }}
      >
        <img 
          src="/images/raquette-pingpong-mur.svg" 
          alt="Raquette de ping pong"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: 0.9,
            pointerEvents: 'none',
          }}
          draggable={false}
        />

        <div style={{
          position: 'absolute',
          top: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60cqw',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '2cqw',
          zIndex: 5,
          pointerEvents: 'none',
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '5cqw',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: darkGreen,
            margin: 0,
          }}>
            {DATA.details[0].titre}
          </h2>
          <div style={{ width: '8cqw', height: '2px', background: darkGreen, margin: '0 auto' }} />
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '4.2cqw',
            fontWeight: 600,
            color: darkText,
            lineHeight: 1.45,
            margin: 0,
          }}>
            {DATA.details[0].texte}
          </p>
        </div>

        <img
          ref={aiRef}
          src="/images/objets/pong1.svg"
          alt="Raquette IA"
          style={{
            position: 'absolute',
            left: '2%', 
            top: `${aiY.current}%`,
            height: '18%',
            width: 'auto',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
          draggable={false}
        />

        <img
          ref={playerRef}
          src="/images/objets/pong2.svg"
          alt="Raquette Joueur"
          style={{
            position: 'absolute',
            right: '0%', 
            top: `${playerY.current}%`,
            height: '18%',
            width: 'auto',
            transform: 'translate(50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
          draggable={false}
        />

        <img
          ref={ballRef}
          src="/images/objets/balle.svg"
          alt="Balle"
          style={{
            position: 'absolute',
            left: `${ball.current.x}%`,
            top: `${ball.current.y}%`,
            height: '5%',
            width: 'auto',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
          draggable={false}
        />

        {isPlaying && (
          <div style={{
            position: 'absolute',
            bottom: '1cqw',
            left: '1cqw',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '4cqw',
            fontWeight: 700,
            color: darkGreen,
            zIndex: 10,
            pointerEvents: 'none',
          }}>
            {score.ai} - {score.player}
          </div>
        )}

        <button 
          onClick={togglePlay}
          style={{
            position: 'absolute',
            bottom: '2cqw', 
            right: 0,
            padding: '1.5cqw 3cqw',
            background: isPlaying ? 'transparent' : darkGreen,
            color: isPlaying ? darkGreen : '#FAD799',
            border: `2px solid ${darkGreen}`,
            borderRadius: '6px',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3.5cqw',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isPlaying ? 'none' : '0 4px 12px rgba(27, 59, 34, 0.2)',
            transition: 'transform 0.1s ease',
            zIndex: 20,
            pointerEvents: 'auto',
          }}
          onMouseOver={(e) => !isPlaying && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => !isPlaying && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isPlaying ? 'Quitter le jeu' : 'Jouer au Pong'}
        </button>
      </div>
    </div>
  );
}