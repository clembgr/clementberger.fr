import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const COMPOSANTS = {
  'abwheel':           dynamic(() => import('./objets/abwheel'),        { ssr: false }),
  'telephone':         dynamic(() => import('./objets/telephone'),       { ssr: false }),
  'saxophone':         dynamic(() => import('./objets/saxophone'),       { ssr: false }),
  'basket':            dynamic(() => import('./objets/course'),          { ssr: false }),
  'piano':             dynamic(() => import('./objets/piano'),           { ssr: false }),
  'platine':           dynamic(() => import('./objets/platine'),         { ssr: false }),
  'siege':             dynamic(() => import('./objets/chaise'),          { ssr: false }),
  'ballon':            dynamic(() => import('./objets/football'),        { ssr: false }),
  'raquette-pingpong': dynamic(() => import('./objets/pingpong'),        { ssr: false }),
  'raquette-tennis':   dynamic(() => import('./objets/tennis'),          { ssr: false }),
  'livres':            dynamic(() => import('./objets/livre'),           { ssr: false }),
  'classeurs':         dynamic(() => import('./objets/formation'),       { ssr: false }),
  'journal':           dynamic(() => import('./objets/qualitevaleur'),   { ssr: false }),
  'miroir':            dynamic(() => import('./objets/mapersonnalite'),  { ssr: false }),
  'gemini':            dynamic(() => import('./objets/ia'),              { ssr: false }),
  'tiroir':            dynamic(() => import('./objets/tiroir'),          { ssr: false }),
  'fenetre':           dynamic(() => import('./objets/avenir'),          { ssr: false }),
  'sous-mon-lit':      dynamic(() => import('./objets/amelioration'),    { ssr: false }),
}

if (typeof window !== 'undefined') {
  Object.values(COMPOSANTS).forEach(c => c.preload?.())
}

const MUR_GAUCHE = { left: 0, top: 0, width: 16.7, height: 100 }

export default function MurGauche({ activeElementId }) {
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
      {Composant && <Composant />}
    </div>
  )
}