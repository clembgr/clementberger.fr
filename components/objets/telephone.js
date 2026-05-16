
const ECRAN = {
  left:   (77   / 963)  * 100,
  top:    (158  / 1941) * 100,
  width:  (807  / 963)  * 100,
  height: (1627 / 1941) * 100,
}

const CONTACTS = [
  {
    categorie: 'email',
    label: 'contact@clementberger.fr',
    href: 'mailto:contact@clementberger.fr',
    iconSrc: '/images/email-icon.png', 
  },
  {
    categorie: 'linkedin',
    label: 'clementberger',
    href: 'https://linkedin.com/in/clembgr/',
    iconSrc: '/images/linkedin-icon.png',
  },
  {
    categorie: 'github',
    label: 'clembgr',
    href: 'https://github.com/clembgr',
    iconSrc: '/images/github-icon.png',
  },
  {
    categorie: 'Mon cv',
    label: 'cv.clementberger.fr',
    href: 'https://cv.clementberger.fr',
    iconSrc: '/images/cv-icon.png',
  },
]

export default function Telephone() {
  const darkGreen = '#1b3b22'; 
  const darkText = 'rgba(80, 50, 20, 0.95)';

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4vh 4vw 12vh 4vw', 
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'relative',
        height: '100%',
        aspectRatio: '963 / 1941',
        maxHeight: '100%',
        maxWidth: '100%',
      }}>

        <img
          src="/images/telephone-mur.svg"
          alt="téléphone"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
        />

        <div style={{
          position: 'absolute',
          left:   `${ECRAN.left}%`,
          top:    `${ECRAN.top}%`,
          width:  `${ECRAN.width}%`,
          height: `${ECRAN.height}%`,
          background: '#FAD799',
          borderRadius: '2%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '6% 6%',
          overflow: 'hidden',
          containerType: 'inline-size',
        }}>

          <div>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '9cqw',
              fontWeight: 700, 
              letterSpacing: '0.3em',
              color: darkGreen, 
              textTransform: 'lowercase',
              margin: '0 0 3% 0',
            }}>
              contact
            </p>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '22cqw',
              fontWeight: 600,
              color: darkText,
              margin: '0 0 2% 0',
              lineHeight: 1.05,
            }}>
              Clément<br />Berger
            </h2>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '8cqw',
              fontStyle: 'italic',
              fontWeight: 600, 
              color: darkGreen, 
              margin: 0,
              lineHeight: 1.4,
            }}>
              Étudiant BUT Informatique<br />
              Développeur en alternance
            </p>
          </div>

          <div style={{
            width: '25%',
            height: '1.5px', 
            background: darkGreen, 
            flexShrink: 0,
          }} />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4%',
            flex: 1,
            justifyContent: 'center',
          }}>
            {CONTACTS.map(({ categorie, label, href, iconSrc }) => (
              <a
                key={categorie}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4%',
                  textDecoration: 'none',
                  pointerEvents: 'all',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '15%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}>
                  <img 
                    src={iconSrc} 
                    alt={`logo ${categorie}`} 
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '12cqw',
                      objectFit: 'contain'
                    }} 
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1%', overflow: 'hidden' }}>
                  <span style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '6.5cqw',
                    fontWeight: 700, 
                    letterSpacing: '0.2em',
                    color: darkGreen, 
                    textTransform: 'lowercase',
                  }}>
                    {categorie}
                  </span>
                  <span style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '8cqw',
                    fontWeight: 600,
                    color: darkText,
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden'
                  }}>
                    {label}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '6cqw',
            fontWeight: 700, 
            letterSpacing: '0.15em',
            color: darkGreen, 
            margin: 0,
            textTransform: 'lowercase',
            textAlign: 'center'
          }}>
            disponible pour une alternance Septembre 2027 (bac+4)
          </p>

        </div>
      </div>
    </div>
  )
}