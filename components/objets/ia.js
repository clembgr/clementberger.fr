import { useState, useRef, useEffect } from 'react';
import { getItemById } from '../../data/portfolio';

export default function Ia() {
  const DATA = getItemById('gemini');

  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const reponsePredefinie = DATA.details;

  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  
  const blockPropagation = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleSubmit = (e) => {
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!query.trim() || isTyping) return;

    const userText = query;
    setQuery('');
    
    setConversation(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    setTimeout(() => {
      setConversation(prev => [...prev, { role: 'ai', text: '' }]);
      
      let i = 0;
      const interval = setInterval(() => {
        setConversation(prev => {
          const newConv = [...prev];
          const lastMsgIndex = newConv.length - 1;
          newConv[lastMsgIndex] = {
            ...newConv[lastMsgIndex],
            text: reponsePredefinie.slice(0, i + 1)
          };
          return newConv;
        });
        i++;
        
        if (i === reponsePredefinie.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 25);
    }, 500);
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
        pointerEvents: 'auto'
      }}
    >
      <style>{`
        .ia-chat-container::-webkit-scrollbar { display: none; }
        .blinking-cursor { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: '3cqw', flexShrink: 0 }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '11cqw',
          fontWeight: 700,
          color: darkText,
          margin: 0
        }}>
          {DATA.label}
        </h1>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '4cqw',
          fontWeight: 700,
          color: darkGreen,
          margin: 0
        }}>
          {DATA.details[0].titre}
        </p>
      </div>

      <div 
        ref={chatContainerRef}
        className="ia-chat-container"
        style={{
          flex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          border: `1px solid rgba(27, 59, 34, 0.1)`,
          borderRadius: '8px',
          padding: '4cqw',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3cqw',
          marginBottom: '3cqw',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.02)'
        }}
      >
        {conversation.length === 0 ? (
          <div style={{
            margin: 'auto',
            textAlign: 'center',
            opacity: 0.8,
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '4cqw',
            color: darkGreen
          }}>
            Essayez de taper :<br/>
            <span style={{ fontStyle: 'italic' }}>"Quel est le lien entre Clément et l'IA ?"</span>
          </div>
        ) : (
          conversation.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isLastAiMsg = !isUser && index === conversation.length - 1;
            
            return (
              <div 
                key={index}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  backgroundColor: isUser ? darkGreen : 'rgba(250, 215, 153, 0.8)',
                  color: isUser ? '#FAD799' : darkText,
                  padding: '2cqw 3cqw',
                  borderRadius: '8px',
                  borderBottomRightRadius: isUser ? 0 : '8px',
                  borderBottomLeftRadius: !isUser ? 0 : '8px',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3.5cqw',
                  fontWeight: 600,
                  lineHeight: 1.4,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  textAlign: isUser ? 'right' : 'left'
                }}
              >
                {msg.text}
                {isLastAiMsg && isTyping && (
                  <span className="blinking-cursor" style={{ marginLeft: '2px', fontWeight: 'bold' }}>|</span>
                )}
              </div>
            );
          })
        )}
      </div>

      <form 
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '2cqw',
          flexShrink: 0
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={isTyping}
          style={{
            flex: 1,
            padding: '2.5cqw 3cqw',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3.5cqw',
            fontWeight: 600,
            color: darkText,
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: `2px solid ${darkGreen}`,
            borderRadius: '6px',
            outline: 'none',
            opacity: isTyping ? 0.7 : 1
          }}
        />
        <button 
          type="submit"
          disabled={!query.trim() || isTyping}
          style={{
            padding: '0 4cqw',
            backgroundColor: (!query.trim() || isTyping) ? 'transparent' : darkGreen,
            color: (!query.trim() || isTyping) ? darkGreen : '#FAD799',
            border: `2px solid ${darkGreen}`,
            borderRadius: '6px',
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '3.5cqw',
            fontWeight: 700,
            cursor: (!query.trim() || isTyping) ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            textTransform: 'lowercase'
          }}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}