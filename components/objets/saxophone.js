import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';





export default function Saxophone() {
  const DATA = getItemById('saxophone');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');

  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Erreur de lecture:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    if (total > 0) {
      setProgress((current / total) * 100);
    }
    setCurrentTime(formatTime(current));
  };

  const handleSeek = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekTime = (clickX / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = seekTime;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const setAudioData = () => setDuration(formatTime(audio.duration));
    if (audio.readyState >= 1) setAudioData();
    else audio.addEventListener('loadedmetadata', setAudioData);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
      containerType: 'inline-size',
      padding: '4cqw',
    }}>
      
      {/* Titre */}
      <h1 style={{
        position: 'absolute',
        top: '8cqw',
        left: '6cqw',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '15cqw',
        fontWeight: 700,
        color: darkText,
        margin: 0,
        lineHeight: 0.95,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {DATA.label}
      </h1>

      <img
        src="/images/objets/saxophone.svg"
        alt="saxophone"
        style={{
          position: 'absolute',
          top: '20cqw',
          right: '-5cqw',
          width: '55cqw',
          height: 'auto',
          objectFit: 'contain',
          opacity: 0.9,
          zIndex: 5,
          pointerEvents: 'none',
        }}
        draggable={false}
      />

      {/* Bloc 1 */}
      <p style={{
        position: 'absolute',
        top: '45cqw',
        left: '2cqw',
        width: '65cqw',
        transform: 'rotate(6deg)',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '4.2cqw',
        fontWeight: 600,
        color: darkGreen,
        margin: 0,
        textAlign: 'right',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {DATA.details[0].texte}
      </p>

      {/* Bloc 2 */}
      <p style={{
        position: 'absolute',
        top: '69cqw',
        left: '15cqw',
        width: '50cqw',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '4.2cqw',
        fontWeight: 700,
        color: darkText,
        margin: 0,
        textAlign: 'right',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {DATA.details[1].texte}
      </p>

      {/* Bloc 3 */}
      <p style={{
        position: 'absolute',
        top: '95cqw',
        left: '22cqw',
        width: '45cqw',
        transform: 'rotate(-10deg)',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '4.2cqw',
        fontWeight: 600,
        color: darkGreen,
        margin: 0,
        textAlign: 'right',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {DATA.details[2].texte}
      </p>

      <p style={{
        position: 'absolute',
        bottom: '21cqw',
        left: '8cqw',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '4cqw',
        fontStyle: 'italic',
        fontWeight: 600,
        color: darkText,
        margin: 0,
        zIndex: 20,
        pointerEvents: 'none',
      }}>
        ♪ Reprise de Careless Whisper - George Michael
      </p>

      {/* LECTEUR AUDIO */}
      <div 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: '6cqw',
          left: '6cqw',
          right: '6cqw',
          display: 'flex',
          alignItems: 'center',
          gap: '3cqw',
          padding: '2.5cqw 4cqw',
          background: 'rgba(250, 215, 153, 0.8)', 
          border: `3px solid ${darkGreen}`,
          borderRadius: '50px',
          boxShadow: '0 8px 20px rgba(27, 59, 34, 0.25)', 
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          pointerEvents: 'auto',
          cursor: 'default',
        }}
      >
        <audio 
          ref={audioRef} 
          src="/audios/musique.mp3" 
          onTimeUpdate={handleTimeUpdate}
        />

        <button 
          onClick={togglePlay}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            width: '6.5cqw',
            height: '6.5cqw',
            borderRadius: '50%',
            background: darkGreen,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            padding: 0,
            pointerEvents: 'auto',
          }}
        >
          {isPlaying ? (
            <div style={{ display: 'flex', gap: '0.6cqw' }}>
              <div style={{ width: '0.8cqw', height: '2.5cqw', background: '#FAD799' }} />
              <div style={{ width: '0.8cqw', height: '2.5cqw', background: '#FAD799' }} />
            </div>
          ) : (
            <div style={{ 
              width: 0, 
              height: 0, 
              borderTop: '1.2cqw solid transparent',
              borderBottom: '1.2cqw solid transparent',
              borderLeft: `1.8cqw solid #FAD799`,
              marginLeft: '0.4cqw'
            }} />
          )}
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5cqw' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5cqw', fontWeight: 600, color: darkGreen }}>
              {currentTime}
            </span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5cqw', fontWeight: 600, color: darkGreen }}>
              {duration}
            </span>
          </div>

          <div 
            ref={trackRef}
            onClick={handleSeek}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ 
              width: '100%', 
              height: '3cqw',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            <div style={{
              width: '100%',
              height: '1.2cqw',
              background: 'rgba(27, 59, 34, 0.2)', 
              borderRadius: '10px',
              position: 'relative',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress}%`,
                background: darkGreen,
                borderRadius: '10px',
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}