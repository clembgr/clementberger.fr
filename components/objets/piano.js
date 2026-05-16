import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';


const PIANO_NOTES = [
  { note: 'C4',  freq: 261.63, type: 'white' },
  { note: 'C#4', freq: 277.18, type: 'black', left: 10 },
  { note: 'D4',  freq: 293.66, type: 'white' },
  { note: 'D#4', freq: 311.13, type: 'black', left: 20 },
  { note: 'E4',  freq: 329.63, type: 'white' },
  { note: 'F4',  freq: 349.23, type: 'white' },
  { note: 'F#4', freq: 369.99, type: 'black', left: 40 },
  { note: 'G4',  freq: 392.00, type: 'white' },
  { note: 'G#4', freq: 415.30, type: 'black', left: 50 },
  { note: 'A4',  freq: 440.00, type: 'white' },
  { note: 'A#4', freq: 466.16, type: 'black', left: 60 },
  { note: 'B4',  freq: 493.88, type: 'white' },
  { note: 'C5',  freq: 523.25, type: 'white' },
  { note: 'C#5', freq: 554.37, type: 'black', left: 80 },
  { note: 'D5',  freq: 587.33, type: 'white' },
  { note: 'D#5', freq: 622.25, type: 'black', left: 90 },
  { note: 'E5',  freq: 659.25, type: 'white' },
];

export default function Piano() {
  const DATA = getItemById('piano');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const audioCtxRef = useRef(null);
  const activeVoices = useRef({});
  const isDragging = useRef(false);
  const currentHoveredNote = useRef(null);
  
  const [activeKeys, setActiveKeys] = useState([]);

  useEffect(() => {
    return () => stopAllNotes();
  }, []);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const createNoiseBuffer = (ctx) => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const startNote = (freq, noteName) => {
    if (activeVoices.current[noteName]) return;

    const ctx = initAudio();
    const now = ctx.currentTime;

    
    
    
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(6, now); 
    lfoGain.gain.setValueAtTime(freq * 0.015, now); 
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, now); 

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.04, now + 0.1); 

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(0.3, now + 0.1); 

    osc.connect(mainGain);
    noiseGain.connect(mainGain);
    mainGain.connect(ctx.destination);

    osc.start();
    noise.start();

    activeVoices.current[noteName] = { osc, lfo, noise, mainGain };
    setActiveKeys(prev => [...prev, noteName]);
  };

  const stopNote = (noteName) => {
    const voice = activeVoices.current[noteName];
    if (!voice) return;

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const now = ctx.currentTime;
    const { osc, lfo, noise, mainGain } = voice;

    mainGain.gain.cancelScheduledValues(now);
    mainGain.gain.setValueAtTime(mainGain.gain.value, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4); 

    osc.stop(now + 0.4);
    lfo.stop(now + 0.4);
    noise.stop(now + 0.4);

    delete activeVoices.current[noteName];
    setActiveKeys(prev => prev.filter(k => k !== noteName));
  };

  const stopAllNotes = () => {
    Object.keys(activeVoices.current).forEach(note => stopNote(note));
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    handlePointerMove(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (!elem) return;

    const noteName = elem.getAttribute('data-note');
    const freq = parseFloat(elem.getAttribute('data-freq'));

    if (noteName && noteName !== currentHoveredNote.current) {
      if (currentHoveredNote.current) stopNote(currentHoveredNote.current);
      startNote(freq, noteName);
      currentHoveredNote.current = noteName;
    } else if (!noteName && currentHoveredNote.current) {
      stopNote(currentHoveredNote.current);
      currentHoveredNote.current = null;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    if (currentHoveredNote.current) {
      stopNote(currentHoveredNote.current);
      currentHoveredNote.current = null;
    }
    stopAllNotes();
  };

  const whiteKeys = PIANO_NOTES.filter(n => n.type === 'white');
  const blackKeys = PIANO_NOTES.filter(n => n.type === 'black');

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        containerType: 'inline-size',
        padding: '4cqw 6cqw 50vh 6cqw',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '12cqw', fontWeight: 700, color: darkText, margin: '0 0 2cqw 0', lineHeight: 1, textAlign: 'center' }}>
          {DATA.label}
        </h1>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4.5cqw', fontWeight: 700, letterSpacing: '0.1em', color: darkGreen, margin: '0 0 3cqw 0', lineHeight: 1.2, textTransform: 'lowercase', textAlign: 'center' }}>
          {DATA.details[0].titre}
        </h2>
        <div style={{ width: '10cqw', height: '2px', background: darkGreen, marginBottom: '3cqw' }} />
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3.5cqw', fontWeight: 600, color: darkText, lineHeight: 1.5, margin: '0 0 2cqw 0', textAlign: 'center', maxWidth: '85%' }}>
          {DATA.details[0].texte} Vous pouvez essayer de jouer quelques notes sur le "piano" ci-dessous.
        </p>
      </div>

      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{
          position: 'relative',
          width: '100%',
          height: '40cqw', 
          display: 'flex',
          pointerEvents: 'auto', 
          cursor: 'pointer',
          border: `4px solid ${darkGreen}`, 
          borderRadius: '6px',
          overflow: 'hidden', 
          boxSizing: 'border-box',
          touchAction: 'none', 
        }}
      >
        {whiteKeys.map((k, i) => (
          <div
            key={k.note}
            data-note={k.note}
            data-freq={k.freq}
            style={{
              flex: 1,
              height: '100%',
              background: activeKeys.includes(k.note) ? 'rgba(27, 59, 34, 0.15)' : 'transparent', 
              borderRight: i === whiteKeys.length - 1 ? 'none' : `4px solid ${darkGreen}`,
              boxSizing: 'border-box',
              transition: activeKeys.includes(k.note) ? 'none' : 'background 0.3s ease',
            }}
          />
        ))}

        {blackKeys.map((k) => (
          <div
            key={k.note}
            data-note={k.note}
            data-freq={k.freq}
            style={{
              position: 'absolute',
              top: 0,
              left: `calc(${k.left}% - 2.5%)`,
              width: '5%',
              height: '60%',
              background: activeKeys.includes(k.note) ? '#4a7d57' : '#2a5a36',
              border: `4px solid ${darkGreen}`,
              borderTop: 'none', 
              borderRadius: '0 0 4px 4px',
              boxSizing: 'border-box',
              zIndex: 10,
              transition: activeKeys.includes(k.note) ? 'none' : 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}