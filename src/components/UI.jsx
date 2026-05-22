import { T } from '../tokens'

export function Lbl({ children }) {
  return (
    <label style={{
      display: 'block', marginBottom: 6,
      fontFamily: "'DM Sans', sans-serif", fontSize: 11,
      fontWeight: 600, letterSpacing: '0.07em',
      textTransform: 'uppercase', color: T.muted,
    }}>{children}</label>
  )
}

export function Tag({ soft, color, children }) {
  return (
    <span style={{
      padding: '3px 9px', borderRadius: 5,
      background: soft, color,
      fontSize: 11, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
    }}>{children}</span>
  )
}

export function PriBtn({ onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      background: T.red, color: '#fff', border: 'none',
      borderRadius: 10, padding: '13px 20px', cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600,
      width: '100%', ...style,
    }}>{children}</button>
  )
}

export function SecBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', color: T.sub,
      border: `1px solid ${T.border2}`,
      borderRadius: 10, padding: '12px 20px', cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
      width: '100%',
    }}>{children}</button>
  )
}

export function PageHeader({ eyebrow, title, right }) {
  return (
    <div style={{ padding: '32px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        {eyebrow && (
          <p style={{ margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {eyebrow}
          </p>
        )}
        <h1 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 32, color: T.text, fontWeight: 700, lineHeight: 1 }}>
          {title}
        </h1>
      </div>
      {right}
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <p style={{ color: T.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 14, margin: 0 }}>Loading...</p>
    </div>
  )
}
