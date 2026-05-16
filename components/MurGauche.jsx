import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'


const COMPOSANTS = {
  'abwheel':          dynamic(() => import('./objets/abwheel')),
  'telephone':        dynamic(() => import('./objets/telephone')),
  'saxophone':        dynamic(() => import('./objets/saxophone')),
  'basket':           dynamic(() => import('./objets/course')),
  'piano':            dynamic(() => import('./objets/piano')),
  'platine':          dynamic(() => import('./objets/platine')),
  'siege':            dynamic(() => import('./objets/chaise')),
  'ballon':           dynamic(() => import('./objets/football')),
  'raquette-pingpong':dynamic(() => import('./objets/pingpong')),
  'raquette-tennis':  dynamic(() => import('./objets/tennis')),
  'livres':           dynamic(() => import('./objets/livre')),
  'classeurs':        dynamic(() => import('./objets/formation')),
  'journal':          dynamic(() => import('./objets/qualitevaleur')),
  'miroir':           dynamic(() => import('./objets/mapersonnalite')),
  'gemini':           dynamic(() => import('./objets/ia')),
  'tiroir':           dynamic(() => import('./objets/tiroir')),
  'fenetre':          dynamic(() => import('./objets/avenir')),
  'sous-mon-lit':     dynamic(() => import('./objets/amelioration')),
}

const MUR_GAUCHE = { left: 0, top: 0, width: 16.7, height: 100 }

export default function MurGauche({ activeElementId, cursorRef, ringRef }) {
  const [displayedId, setDisplayedId] = useState(activeElementId)

  const Composant = displayedId ? COMPOSANTS[displayedId] : null

  useEffect(() => {
    if (activeElementId) {
      setDisplayedId(activeElementId)
    }
  }, [activeElementId])

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
      {Composant && <Composant/>}
    </div>
  )
}