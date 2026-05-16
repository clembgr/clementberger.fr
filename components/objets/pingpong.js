import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';

export default function PingPong({ isActive }) {
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
  const timeoutRef = useRef(null);

  const BASE_BALL_SPEED = 0.8;
  const PADDLE_SPEED = 1.2;

  const game = useRef({
    ball: { x: 90, y: 75, dx: 0, dy: 0, width: 3, height: 5, resetting: false },
    player: { x: 98, y: 30, dy: 0, width: 3, height: 18 },
    ai: { x: 2, y: 65, dy: 0, width: 3, height: 18 },
    keys: { up: false, down: false }
  });

  const collides = (obj1, obj2) => {
    return (
      obj1.x - obj1.width / 2 < obj2.x + obj2.width / 2 &&
      obj1.x + obj1.width / 2 > obj2.x - obj2.width / 2 &&
      obj1.y - obj1.height / 2 < obj2.y + obj2.height / 2 &&
      obj1.y + obj1.height / 2 > obj2.y - obj2.height / 2
    );
  };

  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
      setScore({ ai: 0, player: 0 });
      const { ball, ai, player } = game.current;
      ball.x = 90; ball.y = 75; ball.dx = 0; ball.dy = 0;
      ai.y = 65; player.y = 30;
      ball.resetting = false;
      clearTimeout(timeoutRef.current);

      if (ballRef.current) {
        ballRef.current.style.left = `${ball.x}%`;
        ballRef.current.style.top = `${ball.y}%`;
      }
      if (aiRef.current) aiRef.current.style.top = `${ai.y}%`;
      if (playerRef.current) playerRef.current.style.top = `${player.y}%`;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') game.current.keys.up = true;
      if (e.key === 'ArrowDown') game.current.keys.down = true;
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
    };

    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') game.current.keys.up = false;
      if (e.key === 'ArrowDown') game.current.keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const loop = () => {
      const { ball, player, ai, keys } = game.current;

      if (keys.up) player.dy = -PADDLE_SPEED;
      else if (keys.down) player.dy = PADDLE_SPEED;
      else player.dy = 0;

      player.y += player.dy;
      player.y = Math.max(player.height / 2, Math.min(100 - player.height / 2, player.y));

      if (ball.dx < 0) { 
        if (ai.y < ball.y - 2) ai.dy = PADDLE_SPEED * 0.85; 
        else if (ai.y > ball.y + 2) ai.dy = -PADDLE_SPEED * 0.85;
        else ai.dy = 0;
      } else { 
        if (ai.y < 49) ai.dy = PADDLE_SPEED * 0.4;
        else if (ai.y > 51) ai.dy = -PADDLE_SPEED * 0.4;
        else ai.dy = 0;
      }

      ai.y += ai.dy;
      ai.y = Math.max(ai.height / 2, Math.min(100 - ai.height / 2, ai.y));

      if (!ball.resetting) {
        ball.x += ball.dx;
        ball.y += ball.dy;
      }

      if (ball.y - ball.height / 2 < 0) {
        ball.y = ball.height / 2;
        ball.dy *= -1;
      } else if (ball.y + ball.height / 2 > 100) {
        ball.y = 100 - ball.height / 2;
        ball.dy *= -1;
      }

      if (collides(ball, ai) && ball.dx < 0) {
        ball.dx *= -1.05; 
        ball.dy += (ball.y - ai.y) * 0.05; 
        ball.x = ai.x + ai.width / 2 + ball.width / 2;
      } else if (collides(ball, player) && ball.dx > 0) {
        ball.dx *= -1.05;
        ball.dy += (ball.y - player.y) * 0.05;
        ball.x = player.x - player.width / 2 - ball.width / 2;
      }

      ball.dx = Math.max(-2, Math.min(2, ball.dx));
      ball.dy = Math.max(-1.5, Math.min(1.5, ball.dy));

      if ((ball.x < 0 || ball.x > 100) && !ball.resetting) {
        ball.resetting = true;
        
        if (ball.x < 0) setScore(s => ({ ...s, player: s.player + 1 }));
        if (ball.x > 100) setScore(s => ({ ...s, ai: s.ai + 1 }));

        timeoutRef.current = setTimeout(() => {
          ball.resetting = false;
          ball.x = 50;
          ball.y = 50;
          ball.dx = BASE_BALL_SPEED * (ball.x < 0 ? 1 : -1);
          ball.dy = BASE_BALL_SPEED * (Math.random() * 2 - 1);
        }, 400);
      }

      if (ballRef.current) {
        ballRef.current.style.left = `${ball.x}%`;
        ballRef.current.style.top = `${ball.y}%`;
      }
      if (aiRef.current) aiRef.current.style.top = `${ai.y}%`;
      if (playerRef.current) playerRef.current.style.top = `${player.y}%`;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeoutRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  const handlePointerMove = (e) => {
    if (!isPlaying || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const { player } = game.current;
    player.y = Math.max(player.height / 2, Math.min(100 - player.height / 2, y));
  };

  const togglePlay = () => {
    const { ball, ai, player } = game.current;
    
    if (isPlaying) {
      setIsPlaying(false);
      setScore({ ai: 0, player: 0 });
      ball.x = 90; ball.y = 75; ball.dx = 0; ball.dy = 0;
      ai.y = 65; player.y = 30;
      ball.resetting = false;
      clearTimeout(timeoutRef.current);
    } else {
      setIsPlaying(true);
      ball.x = 50; ball.y = 50; 
      ball.dx = BASE_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1); 
      ball.dy = BASE_BALL_SPEED * (Math.random() * 2 - 1);
      ai.y = 50; player.y = 50;
    }

    if (ballRef.current) {
      ballRef.current.style.left = `${ball.x}%`;
      ballRef.current.style.top = `${ball.y}%`;
    }
    if (aiRef.current) aiRef.current.style.top = `${ai.y}%`;
    if (playerRef.current) playerRef.current.style.top = `${player.y}%`;
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
        contain: 'strict',
        transform: 'translateZ(0)',
      }}
    >
      {isPlaying && (
        <style>{`
          div[class*="paysageFrame"] {
            display: none !important;
          }
          div[class*="svgInline"] * {
            animation-play-state: paused !important;
          }
        `}</style>
      )}

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
        style={{ flex: 1, position: 'relative', width: '100%' }}
      >
        <img 
          src="/images/raquette-pingpong-mur.svg" 
          alt="Raquette de ping pong"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', opacity: 0.9, pointerEvents: 'none',
          }}
          draggable={false}
        />

        <div style={{
          position: 'absolute', top: '14%', left: '50%', transform: 'translateX(-50%)',
          width: '60cqw', textAlign: 'center', display: 'flex', flexDirection: 'column',
          gap: '2cqw', zIndex: 5, pointerEvents: 'none',
          opacity: isPlaying ? 0 : 1,
          transition: 'opacity 0.2s ease'
        }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '5cqw', fontWeight: 700, letterSpacing: '0.1em', color: darkGreen, margin: 0 }}>
            {DATA.details[0].titre}
          </h2>
          <div style={{ width: '8cqw', height: '2px', background: darkGreen, margin: '0 auto' }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4.2cqw', fontWeight: 600, color: darkText, lineHeight: 1.45, margin: 0 }}>
            {DATA.details[0].texte}
          </p>
        </div>

        <img
          ref={aiRef}
          src="/images/objets/pong1.svg"
          alt="Raquette IA"
          style={{
            position: 'absolute', left: '2%', top: `${game.current.ai.y}%`,
            height: '18%', width: 'auto', transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 10,
            willChange: 'left, top'
          }}
          draggable={false}
        />

        <img
          ref={playerRef}
          src="/images/objets/pong2.svg"
          alt="Raquette Joueur"
          style={{
            position: 'absolute', left: '98%', top: `${game.current.player.y}%`,
            height: '18%', width: 'auto', transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 10,
            willChange: 'left, top'
          }}
          draggable={false}
        />

        <img
          ref={ballRef}
          src="/images/objets/balle.svg"
          alt="Balle"
          style={{
            position: 'absolute', left: `${game.current.ball.x}%`, top: `${game.current.ball.y}%`,
            height: '5%', width: 'auto', transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 10,
            willChange: 'left, top'
          }}
          draggable={false}
        />

        {isPlaying && (
          <div style={{
            position: 'absolute', bottom: '1cqw', left: '1cqw',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '4cqw',
            fontWeight: 700, color: darkGreen, zIndex: 10, pointerEvents: 'none',
          }}>
            {score.ai} - {score.player}
          </div>
        )}

        <button 
          onClick={togglePlay}
          style={{
            position: 'absolute', bottom: '2cqw', right: 0, padding: '1.5cqw 3cqw',
            background: isPlaying ? 'transparent' : darkGreen, color: isPlaying ? darkGreen : '#FAD799',
            border: `2px solid ${darkGreen}`, borderRadius: '6px',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5cqw',
            fontWeight: 700, cursor: 'pointer',
            boxShadow: isPlaying ? 'none' : '0 4px 12px rgba(27, 59, 34, 0.2)',
            transition: 'transform 0.1s ease', zIndex: 20, pointerEvents: 'auto',
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