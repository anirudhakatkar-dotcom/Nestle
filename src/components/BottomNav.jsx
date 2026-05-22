import { T } from '../tokens'

const TABS = [
  { id: 'inventory', icon: '🏠', label: 'Home'  },
  { id: 'meals',     icon: '🍽️', label: 'Meals' },
  { id: 'watchlist', icon: '🎬', label: 'Watch' },
]

export default function BottomNav({ active, set }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: 'rgba(12,12,12,0.97)', backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${T.border}`,
      display: 'flex', zIndex: 200, paddingBottom: 12,
    }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => set(t.id)} style={{
          flex: 1, padding: '11px 0 5px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer',
          transition: 'color 0.2s',
        }}>
          <span style={{ fontSize: 20, opacity: active === t.id ? 1 : 0.45 }}>{t.icon}</span>
          <span style={{
            fontSize: 10, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: active === t.id ? T.text : T.muted,
          }}>{t.label}</span>
          {active === t.id && (
            <span style={{ width: 16, height: 2, borderRadius: 1, background: T.red, marginTop: 1 }} />
          )}
        </button>
      ))}
    </nav>
  )
}
