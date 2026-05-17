import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


export default function Platine() {

  const DATA = getItemById('platine');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';
  const sandGold = '#FAD799';
  
  const deckBg = '#121212';
  const deckBorder = darkGreen;

  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  const [isPlaying1, setIsPlaying1] = useState(false);
  const [progress1, setProgress1] = useState(0);
  const [time1, setTime1] = useState(0);

  const [isPlaying2, setIsPlaying2] = useState(false);
  const [progress2, setProgress2] = useState(0);
  const [time2, setTime2] = useState(0);

  const [crossfader, setCrossfader] = useState(50);

  const dragTrack1 = useRef({ active: false, pointerId: null, target: null });
  const dragTrack2 = useRef({ active: false, pointerId: null, target: null });

  useEffect(() => {
    if (audio1Ref.current) {
      const vol1 = crossfader <= 50 ? 1 : 1 - ((crossfader - 50) / 50);
      audio1Ref.current.volume = Math.max(0, Math.min(1, vol1));
    }
    if (audio2Ref.current) {
      const vol2 = crossfader >= 50 ? 1 : crossfader / 50;
      audio2Ref.current.volume = Math.max(0, Math.min(1, vol2));
    }
  }, [crossfader]);

  useEffect(() => {
    let rafId;
    const update = () => {
      if (audio1Ref.current) {
        const total = audio1Ref.current.duration;
        const current = audio1Ref.current.currentTime;
        setTime1(current);
        if (isFinite(total) && total > 0) setProgress1((current / total) * 100);
      }
      if (audio2Ref.current) {
        const total = audio2Ref.current.duration;
        const current = audio2Ref.current.currentTime;
        setTime2(current);
        if (isFinite(total) && total > 0) setProgress2((current / total) * 100);
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const togglePlay1 = () => {
    if (!audio1Ref.current) return;
    if (isPlaying1) audio1Ref.current.pause();
    else audio1Ref.current.play().catch(e => console.error(e));
    setIsPlaying1(!isPlaying1);
  };

  const togglePlay2 = () => {
    if (!audio2Ref.current) return;
    if (isPlaying2) audio2Ref.current.pause();
    else audio2Ref.current.play().catch(e => console.error(e));
    setIsPlaying2(!isPlaying2);
  };

  const getClientX = (e) => e.clientX ?? (e.touches && e.touches.length > 0 ? e.touches[0].clientX : 0);

  const handleSeek1 = (e) => {
    if (!audio1Ref.current || !track1Ref.current) return;
    const rect = track1Ref.current.getBoundingClientRect();
    const duration = isFinite(audio1Ref.current.duration) ? audio1Ref.current.duration : 0;
    
    let percent = (getClientX(e) - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    
    const seekTime = percent * duration;
    if (isFinite(seekTime)) {
      audio1Ref.current.currentTime = seekTime;
    }
  };

  const handleSeek2 = (e) => {
    if (!audio2Ref.current || !track2Ref.current) return;
    const rect = track2Ref.current.getBoundingClientRect();
    const duration = isFinite(audio2Ref.current.duration) ? audio2Ref.current.duration : 0;
    
    let percent = (getClientX(e) - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    
    const seekTime = percent * duration;
    if (isFinite(seekTime)) {
      audio2Ref.current.currentTime = seekTime;
    }
  };

  const handleTrackDown1 = (e) => {
    e.stopPropagation();
    try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
    dragTrack1.current = { active: true, pointerId: e.pointerId, target: e.target };
    handleSeek1(e);
  };

  const handleTrackDown2 = (e) => {
    e.stopPropagation();
    try { e.target.setPointerCapture(e.pointerId); } catch(err) {}
    dragTrack2.current = { active: true, pointerId: e.pointerId, target: e.target };
    handleSeek2(e);
  };

  useEffect(() => {
    const onMove = (e) => {
      if (dragTrack1.current.active) handleSeek1(e);
      if (dragTrack2.current.active) handleSeek2(e);
    };

    const onUp = () => {
      if (dragTrack1.current.active) {
        dragTrack1.current.active = false;
        try { dragTrack1.current.target.releasePointerCapture(dragTrack1.current.pointerId); } catch(err) {}
      }
      if (dragTrack2.current.active) {
        dragTrack2.current.active = false;
        try { dragTrack2.current.target.releasePointerCapture(dragTrack2.current.pointerId); } catch(err) {}
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  useEffect(() => {
    const a1 = audio1Ref.current;
    const a2 = audio2Ref.current;
    const onEnd1 = () => setIsPlaying1(false);
    const onEnd2 = () => setIsPlaying2(false);

    if (a1) a1.addEventListener('ended', onEnd1);
    if (a2) a2.addEventListener('ended', onEnd2);

    return () => {
      if (a1) a1.removeEventListener('ended', onEnd1);
      if (a2) a2.removeEventListener('ended', onEnd2);
    };
  }, []);

  return (
    <div 
      id="platine-scroll-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        overflowY: 'auto', 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none', 
        padding: '4cqw 6cqw 16vh 6cqw', 
      }}
    >
      <style>{`
        #platine-scroll-container::-webkit-scrollbar { display: none; }
        
        .crossfader-input {
          -webkit-appearance: none;
          width: 100%;
          background: transparent;
          cursor: pointer;
        }
        .crossfader-input::-webkit-slider-runnable-track {
          width: 100%;
          height: 1.5cqw;
          background: rgba(250, 215, 153, 0.2);
          border-radius: 4px;
        }
        .crossfader-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 3cqw;
          width: 6cqw;
          border-radius: 4px;
          background: ${sandGold}; 
          margin-top: -0.75cqw; 
          border: 1px solid rgba(80, 50, 20, 0.3);
        }
      `}</style>

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '12cqw',
        fontWeight: 700,
        color: darkText,
        margin: '0 0 1cqw 0',
        lineHeight: 1,
        textAlign: 'center',
        flexShrink: 0,
      }}>
        {DATA.label}
      </h1>
      
      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '4.5cqw',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: darkGreen,
        margin: '0 auto 3cqw auto',
        lineHeight: 1.2,
        textTransform: 'lowercase',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        {DATA.details[0].titre}
      </h2>

      <div 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: deckBg,
          border: `3px solid ${deckBorder}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          borderRadius: '12px',
          padding: '4cqw',
          gap: '4cqw',
          pointerEvents: 'auto',
          cursor: 'default',
          flexShrink: 0,
        }}
      >
        <audio ref={audio1Ref} src="/audios/musique1.mp3" />
        <audio ref={audio2Ref} src="/audios/musique2.mp3" />

        <div style={{ display: 'flex', gap: '4cqw', justifyContent: 'space-between' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2cqw' }}>
            <div style={{ fontFamily: 'sans-serif', fontSize: '3cqw', fontWeight: 600, color: '#aaa', letterSpacing: '0.1em' }}>
              PISTE 1
            </div>
            
            <div 
              style={{
                width: '28cqw', height: '28cqw', borderRadius: '50%', border: `4px solid #000`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                background: '#222',
                transform: `rotate(${time1 * 150}deg)`, 
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ position: 'absolute', inset: '2cqw', borderRadius: '50%', overflow: 'hidden' }}>
                 <img src="/images/disque1.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, pointerEvents: 'none' }} draggable="false" />
              </div>
              
              <div style={{ position: 'absolute', width: '3cqw', height: '3cqw', background: '#111', borderRadius: '50%', zIndex: 2, border: '1px solid #333' }} />
              <div style={{ position: 'absolute', top: '5%', width: '1.5cqw', height: '1.5cqw', background: sandGold, borderRadius: '50%', zIndex: 2, boxShadow: `0 0 5px ${sandGold}` }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '2cqw', marginTop: '1cqw' }}>
              <button onClick={togglePlay1} style={{
                width: '5cqw', height: '5cqw', borderRadius: '50%', background: isPlaying1 ? darkGreen : '#333', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0,
                transition: 'background 0.2s'
              }}>
                {isPlaying1 ? (
                  <div style={{ display: 'flex', gap: '0.6cqw' }}>
                    <div style={{ width: '0.6cqw', height: '2cqw', background: sandGold }} />
                    <div style={{ width: '0.6cqw', height: '2cqw', background: sandGold }} />
                  </div>
                ) : (
                  <div style={{ width: 0, height: 0, borderTop: '1cqw solid transparent', borderBottom: '1cqw solid transparent', borderLeft: `1.5cqw solid ${sandGold}`, marginLeft: '0.4cqw' }} />
                )}
              </button>
              
              <div 
                ref={track1Ref} 
                onPointerDown={handleTrackDown1} 
                style={{ flex: 1, height: '2cqw', background: '#333', borderRadius: '4px', cursor: 'pointer', position: 'relative', overflow: 'hidden', touchAction: 'none' }}
              >
                <div style={{ width: `${progress1}%`, height: '100%', background: sandGold, pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2cqw' }}>
            <div style={{ fontFamily: 'sans-serif', fontSize: '3cqw', fontWeight: 600, color: '#aaa', letterSpacing: '0.1em' }}>
              PISTE 2
            </div>
            
            <div 
              style={{
                width: '28cqw', height: '28cqw', borderRadius: '50%', border: `4px solid #000`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                background: '#222',
                transform: `rotate(${time2 * 150}deg)`,
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ position: 'absolute', inset: '2cqw', borderRadius: '50%', overflow: 'hidden' }}>
                 <img src="/images/disque2.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, pointerEvents: 'none' }} draggable="false" />
              </div>

              <div style={{ position: 'absolute', width: '3cqw', height: '3cqw', background: '#111', borderRadius: '50%', zIndex: 2, border: '1px solid #333' }} />
              <div style={{ position: 'absolute', top: '5%', width: '1.5cqw', height: '1.5cqw', background: sandGold, borderRadius: '50%', zIndex: 2, boxShadow: `0 0 5px ${sandGold}` }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '2cqw', marginTop: '1cqw' }}>
              <button onClick={togglePlay2} style={{
                width: '5cqw', height: '5cqw', borderRadius: '50%', background: isPlaying2 ? darkGreen : '#333', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0,
                transition: 'background 0.2s'
              }}>
                {isPlaying2 ? (
                  <div style={{ display: 'flex', gap: '0.6cqw' }}>
                    <div style={{ width: '0.6cqw', height: '2cqw', background: sandGold }} />
                    <div style={{ width: '0.6cqw', height: '2cqw', background: sandGold }} />
                  </div>
                ) : (
                  <div style={{ width: 0, height: 0, borderTop: '1cqw solid transparent', borderBottom: '1cqw solid transparent', borderLeft: `1.5cqw solid ${sandGold}`, marginLeft: '0.4cqw' }} />
                )}
              </button>
              
              <div 
                ref={track2Ref} 
                onPointerDown={handleTrackDown2} 
                style={{ flex: 1, height: '2cqw', background: '#333', borderRadius: '4px', cursor: 'pointer', position: 'relative', overflow: 'hidden', touchAction: 'none' }}
              >
                <div style={{ width: `${progress2}%`, height: '100%', background: sandGold, pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1cqw', marginTop: '2cqw' }}>
          <div style={{ fontFamily: 'sans-serif', fontSize: '2.5cqw', fontWeight: 600, color: '#aaa', letterSpacing: '0.1em' }}>CROSSFADER</div>
          <input 
            type="range" 
            min="0" max="100" 
            value={crossfader} 
            onChange={(e) => setCrossfader(Number(e.target.value))}
            className="crossfader-input"
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4cqw', marginTop: '4cqw', flexShrink: 0 }}>
        
        <div style={{ padding: '3cqw', borderLeft: `3px solid ${darkGreen}`, background: 'rgba(27, 59, 34, 0.05)' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5cqw', fontWeight: 600, color: darkText, margin: 0 }}>
            <strong style={{ color: darkGreen }}>Tutoriel :</strong> Lancez les pistes et faites glisser le crossfader pour la transition. Vous pouvez glisser le curseur sur la barre de progression pour avancer ou reculer dans les musiques.
          </p>
        </div>

        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5cqw', fontWeight: 600, color: darkText, lineHeight: 1.5, margin: 0 }}>
          {DATA.details[0].texte}
        </p>

      </div>
    </div>
  );
}