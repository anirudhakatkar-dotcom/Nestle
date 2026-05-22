import { T } from '../tokens'

export default function Sheet({ show, onClose, title, children }) {
  if (!show) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #1a1a1a 0%, #111 100%)',
        borderRadius: '22px 22px 0 0',
        padding: '0 0 48px',
        maxHeight: '88vh',
        overflowY: 'auto',
        boxShadow: '0 -20px 80px rgba(0,0,0,0.8)',
        border: `1px solid ${T.border}`,
        borderBottom: 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 36, height: 3, borderRadius: 2, background: T.bg4 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px 20px' }}>
          <h3 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 22, color: T.text, fontWeight: 600 }}>
            {title}
          </h3>
          <button onClick={onClose} style={{
            background: T.bg3, border: `1px solid ${T.border}`, borderRadius: '50%',
            width: 32, height: 32, cursor: 'pointer', color: T.sub, fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
        <div style={{ padding: '0 22px' }}>{children}</div>
      </div>
    </div>
  )
}
