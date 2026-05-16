import dynamic from 'next/dynamic'

const COMPOSANTS = {
  'abwheel':          dynamic(() => import('./objets/abwheel'), { ssr: false }),
  'telephone':        dynamic(() => import('./objets/telephone'), { ssr: false }),
  'saxophone':        dynamic(() => import('./objets/saxophone'), { ssr: false }),
  'basket':           dynamic(() => import('./objets/course'), { ssr: false }),
  'piano':            dynamic(() => import('./objets/piano'), { ssr: false }),
  'platine':          dynamic(() => import('./objets/platine'), { ssr: false }),
  'siege':            dynamic(() => import('./objets/chaise'), { ssr: false }),
  'ballon':           dynamic(() => import('./objets/football'), { ssr: false }),
  'raquette-pingpong':dynamic(() => import('./objets/pingpong'), { ssr: false }),
  'raquette-tennis':  dynamic(() => import('./objets/tennis'), { ssr: false }),
  'livres':           dynamic(() => import('./objets/livre'), { ssr: false }),
  'classeurs':        dynamic(() => import('./objets/formation'), { ssr: false }),
  'journal':          dynamic(() => import('./objets/qualitevaleur'), { ssr: false }),
  'miroir':           dynamic(() => import('./objets/mapersonnalite'), { ssr: false }),
  'gemini':           dynamic(() => import('./objets/ia'), { ssr: false }),
  'tiroir':           dynamic(() => import('./objets/tiroir'), { ssr: false }),
  'fenetre':          dynamic(() => import('./objets/avenir'), { ssr: false }),
  'sous-mon-lit':     dynamic(() => import('./objets/amelioration'), { ssr: false }),
}

const MUR_GAUCHE = { left: 0, top: 0, width: 16.7, height: 100 }

export default function MurGauche({ activeElementId }) {
  return (
    <div style={{
      position: 'absolute',
      left:   `${MUR_GAUCHE.left}%`,
      top:    `${MUR_GAUCHE.top}%`,
      width:  `${MUR_GAUCHE.width}%`,
      height: `${MUR_GAUCHE.height}%`,
      pointerEvents: 'none',
      zIndex: 10,
      overflow: 'hidden',
    }}>
      {Object.entries(COMPOSANTS).map(([id, Component]) => {
        const isActive = activeElementId === id;
        
        return (
          <div 
            key={id}
            style={{
              position: 'absolute',
              inset: 0,
              visibility: isActive ? 'visible' : 'hidden',
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              transition: 'opacity 0.3s ease'
            }}
          >
            <Component isActive={isActive} />
          </div>
        );
      })}
    </div>
  )
}