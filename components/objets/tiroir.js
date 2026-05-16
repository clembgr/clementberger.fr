import { useState } from 'react';

export default function Tiroir() {
  const darkGreen = '#1b3b22';
  const darkText = 'rgba(80, 50, 20, 0.95)';

  const [hoveredComp, setHoveredComp] = useState(null);

  const COMPETENCES = [
    // --- COLONNE DE GAUCHE (Tabs à gauche) ---
    { id: 1, text: "MySQL", x: 12, y: 14.3, desc: "Création, requêtage et gestion de bases de données relationnelles par Oracle." },
    { id: 2, text: "Python/Flask", x: 12, y: 21.3, desc: "Développement de mini-scripts, création de l'application du stage EDF" },
    { id: 3, text: "Java", x: 12, y: 27, desc: "Programmation orientée objet par des exercices pédagogiques." },
    { id: 4, text: "C/C++/C#", x: 12, y: 33.5, desc: "Maîtrise des langages compilés, gestion de la mémoire et développement bas niveau." },
    { id: 5, text: "PHP", x: 12, y: 38, desc: "Développement de solutions back-end dynamiques pour le web." },
    { id: 6, text: "HTML/CSS", x: 12, y: 41.5, desc: "Intégration web, création d'interfaces responsives et stylisation." },
    { id: 7, text: "Bootstrap", x: 30, y: 46.7, desc: "Utilisation de ce framework pour la conception rapide d'interfaces." },
    { id: 8, text: "NoSQL", x: 30, y: 54, desc: "Cours d'ElasticSearch et de MongoDB." },
    { id: 9, text: "Laravel", x: 12, y: 58.3, desc: "Développement d'applications web structurées basées sur l'architecture MVC en PHP." },
    { id: 10, text: "Figma", x: 12, y: 63.6, desc: "Maquettage, prototypage et conception d'interfaces utilisateur (UI/UX)." },

    // --- COLONNE DE DROITE (Tabs à droite) ---
    { id: 11, text: "JS", x: 60, y: 19.5, desc: "Langage utilisé pour ce portfolio." },
    { id: 12, text: "React", x: 83, y: 29, desc: "Bibliothèque JavaScript utilisée égalment dans ce projet." },
    { id: 13, text: "Git", x: 58, y: 31.5, desc: "Contrôle de version, travail collaboratif et gestion de dépôts." },
    { id: 14, text: "Linux", x: 60, y: 33.6, desc: "Administration système basique, utilisation du terminal et des scripts bash." },
    { id: 15, text: "Virtualisation", x: 67, y: 38, desc: "Création et gestion de machines virtuelles (VirtualBox)." },
    { id: 16, text: "Tailwind", x: 80, y: 41.6, desc: "Framework CSS utilitaire pour la stylisation rapide." },
    { id: 17, text: "Node.js", x: 84, y: 49.2, desc: "Environnement d'exécution JavaScript côté serveur pour le back-end." },
    { id: 18, text: "Canva", x: 77, y: 55.5, desc: "Création de visuels graphiques, de présentations et de documents de communication." },
    { id: 19, text: "Office", x: 60, y: 59.4, desc: "Maîtrise de la suite bureautique (Word, Excel, PowerPoint)." },
  ];

  const blockPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      onClick={blockPropagation}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        padding: '0 6cqw 12vh 6cqw', 
        position: 'relative',
        pointerEvents: 'auto',
        justifyContent: 'center', 
        alignItems: 'flex-start',     
      }}
    >
      <style>{`
        @keyframes fadeInBulle {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        position: 'relative',
        height: '100%',
        maxHeight: '100%',
        aspectRatio: '602 / 778',
        containerType: 'inline-size', 
      }}>
        
        <img 
          src="/images/tiroir-ouvert.svg" 
          alt="Tiroir de compétences"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill', 
            pointerEvents: 'none',
          }}
        />

        <h1 style={{
          position: 'absolute',
          top: '4.2%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '6.5cqi', 
          fontWeight: 700,
          color: darkText,
          margin: 0,
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}>
          Mes compétences
        </h1>

        {COMPETENCES.map((comp) => {
          const isLeft = comp.id <= 10;
          const isHovered = hoveredComp === comp.id;

          return (
            <div 
              key={comp.id}
              style={{
                position: 'absolute',
                left: `${comp.x}%`,
                top: `${comp.y}%`,
                transform: `translate(${isLeft ? '0%' : '-100%'}, -50%)`, 
                zIndex: isHovered ? 20 : 10,
              }}
              onMouseEnter={() => setHoveredComp(comp.id)}
              onMouseLeave={() => setHoveredComp(null)}
              onClick={() => setHoveredComp(isHovered ? null : comp.id)}
            >
              <span 
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '2.6cqi', 
                  fontWeight: 700,
                  color: darkText,
                  whiteSpace: 'nowrap',
                  cursor: 'help',
                  pointerEvents: 'auto', 
                  padding: '0.5cqi', 
                }}
              >
                {comp.text}
              </span>

              {isHovered && (
                <div style={{
                  position: 'absolute',
                  top: '100%', 
                  left: isLeft ? '0' : 'auto',
                  right: isLeft ? 'auto' : '0',
                  marginTop: '0.5cqi',
                  width: 'max-content',
                  maxWidth: '45cqi', 
                  background: 'rgba(250, 215, 153, 0.98)',
                  border: `2px solid ${darkGreen}`,
                  borderRadius: '6px',
                  padding: '2cqi',
                  boxShadow: '0 4px 12px rgba(27, 59, 34, 0.15)',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '3.2cqi', 
                  fontWeight: 600,
                  color: darkText,
                  whiteSpace: 'normal',
                  textAlign: 'left',
                  pointerEvents: 'none',
                  animation: 'fadeInBulle 0.2s ease',
                }}>
                  {comp.desc}
                </div>
              )}
            </div>
          );
        })}

        {/* Texte informatif */}
        <p style={{
          position: 'absolute',
          bottom: '10%', 
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: '3.5cqi',
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#FAD799',
          textShadow: '0 2px 5px rgba(0, 0, 0, 0.8)',
          margin: 0,
          whiteSpace: 'nowrap',
          zIndex: 10,
          pointerEvents: 'none',
        }}>
          * Se référer à mes projets informatiques pour des cas d'usage concrets.
        </p>

      </div>
    </div>
  );
}