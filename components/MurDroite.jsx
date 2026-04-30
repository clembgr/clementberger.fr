export default function MurDroite({ onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '40px',
        bottom: '40px',
        left: '300px',
        right: '40px',
        background: '#FAD799',
        borderRadius: '18px',
        zIndex: 50,
        pointerEvents: 'all',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '60px 80px',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(80,50,20,0.2) transparent',
      }}>
        
      </div>
    </div>
  )
}