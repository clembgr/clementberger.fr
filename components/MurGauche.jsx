
const COMPOSANTS = {
  
}

const MUR_GAUCHE = { left: 0, top: 0, width: 16.7, height: 100 }

export default function MurGauche({ activeElementId }) {
  const Composant = activeElementId ? COMPOSANTS[activeElementId] : null

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