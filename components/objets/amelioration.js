import { useState } from 'react';

export default function Amelioration() {
  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const UPDATES = [
    { version: "v1.1", titre: "Amélioration des détails", desc: "Ajout d'animations sur les ombres des feuillages" },
    { version: "v1.2", titre: "Version Mobile Native", desc: "Refonte de l'interface pour une navigation fluide et optimisée sur les smartphones." },
    { version: "v1.3", titre: "Cycle Jour / Nuit", desc: "Bascule automatique sur un éclairage de nuit pour un mode sombre." }
  ];

  const blockPropagation = (e) => {
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!message.trim()) return;
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xrejkvzk', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sujet: "Nouvelle idée d'amélioration (Anonyme)",
          message: message
        })
      });

      if (response.ok) {
        setStatus('success');
        setMessage('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div 
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
        padding: '4cqw 6cqw 12vh 6cqw', 
        position: 'relative',
        pointerEvents: 'auto',
      }}
    >
      <style>{`
        .amelioration-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* EN-TÊTE FIXE */}
      <div style={{ textAlign: 'center', marginBottom: '3cqw', flexShrink: 0 }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '10cqw',
          fontWeight: 700,
          color: darkText,
          margin: 0
        }}>
          Améliorations & nouveautés
        </h1>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4cqw',
          color: darkGreen,
          margin: 0
        }}>
          participez à l'évolution du portfolio
        </p>
      </div>

      {/* ZONE DÉFILANTE (Formulaire + Roadmap) */}
      <div 
        className="amelioration-scroll"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4cqw',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '2cqw'
        }}
      >
        {/* LE FORMULAIRE ANONYME */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '12px',
          padding: '3cqw',
          border: `1px solid rgba(27, 59, 34, 0.2)`,
          flexShrink: 0
        }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '5cqw', fontWeight: 700, color: darkGreen, margin: '0 0 1cqw 0' }}>Boîte à idées/Donnez votre avis</h2>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4cqw', color: darkText, marginBottom: '2cqw', marginTop: 0 }}>
            Une fonctionnalité manquante ? Un bug ? Envoyez-moi un message (100% anonyme).
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2cqw' }}>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre suggestion ici..."
              disabled={status === 'sending' || status === 'success'}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: '15cqw',
                resize: 'none',
                padding: '2cqw',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '3.2cqw',
                borderRadius: '8px',
                border: `1px solid ${darkGreen}`,
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                color: darkText,
                outline: 'none',
                opacity: (status === 'sending' || status === 'success') ? 0.6 : 1
              }}
            />
            <button 
              type="submit"
              disabled={status === 'sending' || status === 'success' || !message.trim()}
              style={{
                alignSelf: 'flex-end',
                padding: '1cqw 3cqw',
                backgroundColor: status === 'success' ? '#2b5e34' : (!message.trim() ? 'transparent' : darkGreen),
                color: status === 'success' ? '#FAD799' : (!message.trim() ? darkGreen : '#FAD799'),
                border: `2px solid ${status === 'success' ? '#2b5e34' : darkGreen}`,
                borderRadius: '8px',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '3cqw',
                fontWeight: 700,
                cursor: (!message.trim() || status === 'sending' || status === 'success') ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {status === 'idle' && "Envoyer"}
              {status === 'sending' && "Envoi en cours..."}
              {status === 'success' && "✓ Message envoyé"}
              {status === 'error' && "✗ Erreur d'envoi"}
            </button>
          </form>
        </div>

        {/* LA ROADMAP / NOUVEAUTÉS */}
        <div style={{ flexShrink: 0 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '5cqw', fontWeight: 700, color: darkGreen, margin: '0 0 2cqw 0' }}>Mises à jour à venir</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2cqw' }}>
            {UPDATES.map((update, index) => (
              <div 
                key={index} 
                style={{ 
                  backgroundColor: 'rgba(250, 215, 153, 0.7)', 
                  padding: '2.5cqw', 
                  borderRadius: '8px', 
                  borderLeft: `4px solid ${darkGreen}` 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1cqw' }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '4cqw', fontWeight: 700, color: darkText }}>
                    {update.titre}
                  </span>
                  <span style={{ 
                    fontFamily: 'sans-serif',
                    fontSize: '2cqw', 
                    backgroundColor: darkGreen, 
                    color: '#FAD799', 
                    padding: '0.4cqw 1.2cqw', 
                    borderRadius: '12px', 
                    fontWeight: 'bold' 
                  }}>
                    {update.version}
                  </span>
                </div>
                <p style={{ 
                  fontFamily: 'Cormorant Garamond, serif', 
                  fontSize: '3cqw', 
                  fontWeight: 600,
                  color: 'rgba(80, 50, 20, 0.8)', 
                  margin: 0, 
                  lineHeight: 1.4 
                }}>
                  {update.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}