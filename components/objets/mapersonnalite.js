import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


export default function MaPersonnalite() {
  const DATA = getItemById('miroir');

  const darkGreen = '#1b3b22';
  const darkText = '#503214f2';

  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isHoveringSlider, setIsHoveringSlider] = useState(false);
  const interactiveAreaRef = useRef(null);
  const introRafRef = useRef(null);
  const introStartRef = useRef(null);

  
  useEffect(() => {
    
    const keyframes = [50, 75, 25, 30];
    const segmentDuration = 700; 
    const pauseStart = 400; 

    let startTime = null;
    let cancelled = false;

    const ease = (t) => t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t; 

    const animate = (timestamp) => {
      if (cancelled) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < pauseStart) {
        introRafRef.current = requestAnimationFrame(animate);
        return;
      }

      const t = elapsed - pauseStart;
      const totalSegments = keyframes.length - 1;
      const totalDuration = segmentDuration * totalSegments;

      if (t >= totalDuration) {
        setSliderPos(30);
        return;
      }

      const segIndex = Math.min(Math.floor(t / segmentDuration), totalSegments - 1);
      const segT = ease((t % segmentDuration) / segmentDuration);
      const from = keyframes[segIndex];
      const to = keyframes[segIndex + 1];
      setSliderPos(from + (to - from) * segT);

      introRafRef.current = requestAnimationFrame(animate);
    };

    introRafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (introRafRef.current) cancelAnimationFrame(introRafRef.current);
    };
  }, []);

  
  const cancelIntro = () => {
    if (introRafRef.current) {
      cancelAnimationFrame(introRafRef.current);
      introRafRef.current = null;
    }
  };

  const blockPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    cancelIntro();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !interactiveAreaRef.current) return;
    const rect = interactiveAreaRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    x = Math.max(0, Math.min(100, x));
    setSliderPos(x);
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };


  return (
    <div
      id="personnalite-container"
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
        padding: '0 0 12vh 0',
        position: 'relative',
        pointerEvents: 'auto',
      }}
    >
      <style>{`
        #personnalite-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div
        ref={interactiveAreaRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '11cqw',
          fontWeight: 700,
          color: darkText,
          margin: '4cqw 0 2cqw 0',
          padding: '0 6cqw',
          textAlign: 'center',
          flexShrink: 0,
          zIndex: 1
        }}>
          {DATA.label}
        </h1>

        {/* CALQUE 1 : CONTENU TEXTE */}
        <div
          id="personnalite-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2cqw 6cqw 10cqw 6cqw',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            zIndex: 1,
            position: 'relative'
          }}
        >
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8cqw',
            margin: 0,
            padding: 0,
            listStyleType: 'none',
          }}>


            <li style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '50%', textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '5cqw',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: darkGreen,
                  fontStyle : 'italic',
                  margin: '0 0 1.5cqw 0',
                }}>
                  {DATA.details[0].titre}
                </h2>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3.5cqw',
                  fontWeight: 600,
                  color: darkText,
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  {DATA.details[0].texte}
                </p>
              </div>
            </li>

            <li style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <img
                src="/images/ton-image-gauche.png"
                alt=""
                style={{ position: 'absolute', left: '2cqw', top: '50%', transform: 'translateY(-50%)', width: '15cqw', pointerEvents: 'none' }}
              />
              <div style={{ width: '50%', textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '5cqw',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: darkGreen,
                  margin: '0 0 1.5cqw 0',
                }}>
                  {DATA.details[1].titre}
                </h2>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3.5cqw',
                  fontWeight: 600,
                  color: darkText,
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  {DATA.details[1].texte}
                </p>
              </div>
              <img
                src="/images/ton-image-droite.png"
                alt=""
                style={{ position: 'absolute', right: '2cqw', top: '50%', transform: 'translateY(-50%)', width: '15cqw', pointerEvents: 'none' }}
              />
            </li>

            <li style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '50%', textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '5cqw',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: darkGreen,
                  margin: '0 0 1.5cqw 0',
                }}>
                  {DATA.details[2].titre}
                </h2>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3.5cqw',
                  fontWeight: 600,
                  color: darkText,
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  {DATA.details[2].texte}
                </p>
              </div>
            </li>

            <li style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '50%', textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '5cqw',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: darkGreen,
                  margin: '0 0 1.5cqw 0',
                }}>
                  {DATA.details[3].titre}
                </h2>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3.5cqw',
                  fontWeight: 600,
                  color: darkText,
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  {DATA.details[3].texte}
                </p>
              </div>
            </li>

            <li style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '50%', textAlign: 'center' }}>
                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '5cqw',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: darkGreen,
                  margin: '0 0 1.5cqw 0',
                }}>
                  {DATA.details[4].titre}
                </h2>
                <p style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3.5cqw',
                  fontWeight: 600,
                  color: darkText,
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                {DATA.details[4].texte}
                </p>
              </div>
            </li>

          </ul>
        </div>

        {/* CALQUE 2 : OVERLAY GRAFFITI */}
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 5,
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          transition: isDragging ? 'none' : 'clip-path 0.05s linear'
        }}>
          <img
            src="/images/objets/graffiti.svg"
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.6
            }}
          />
        </div>

        {/* CALQUE 3 : LE SLIDER ET SA ZONE DE CLIC ÉLARGIE */}
        <div
          onPointerDown={handlePointerDown}
          onPointerEnter={() => setIsHoveringSlider(true)}
          onPointerLeave={() => { if (!isDragging) setIsHoveringSlider(false); }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            width: '10cqw',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'none',
          }}
        >
          {/* Ligne verte fine */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '2px',
            backgroundColor: darkGreen,
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }} />

          {/* Bouton visuel */}
          <div style={{
            position: 'relative',
            width: '7cqw',
            height: '7cqw',
            backgroundColor: '#FAD799',
            border: `2px solid ${darkGreen}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: darkGreen,
            fontSize: '3.5cqw',
            fontWeight: 'bold',
            boxShadow: isDragging
              ? '0 0 22px rgba(27, 59, 34, 0.5)'
              : '0 0 15px rgba(27, 59, 34, 0.3)',
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            transition: 'box-shadow 0.2s ease',
          }}>
            ◂▸
          </div>
        </div>

      </div>
    </div>
  );
}