import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { hashPin } from '../lib/auth'
import { T } from '../tokens'

const PAD = [1,2,3,4,5,6,7,8,9,'',0,'\u232b']

export default function Login({ onLogin }) {
  const [pin,      setPin]      = useState([])
  const [shake,    setShake]    = useState(false)
  const [err,      setErr]      = useState(false)
  const [mode,     setMode]     = useState('loading') // loading | enter | setup | confirm
  const [firstPin, setFirstPin] = useState('')

  useEffect(() => {
    supabase.from('settings').select('id').maybeSingle().then(({ data }) => {
      setMode(data ? 'enter' : 'setup')
    })
  }, [])

  function reset(nextMode) {
    setPin([]); setErr(false); setShake(false)
    if (nextMode) setMode(nextMode)
  }

  async function tap(d) {
    if (pin.length >= 4) return
    const next = [...pin, d]
    setPin(next)
    if (next.length < 4) return
    const entered = next.join('')

    if (mode === 'setup') {
      setFirstPin(entered)
      reset('confirm')
      return
    }

    if (mode === 'confirm') {
      if (entered === firstPin) {
        const hash = await hashPin(entered)
        await supabase.from('settings').upsert({ id: 1, pin_hash: hash })
        sessionStorage.setItem('nestle_auth', '1')
        onLogin()
      } else {
        setErr(true); setShake(true)
        setTimeout(() => { reset('setup'); setFirstPin('') }, 700)
      }
      return
    }

    if (mode === 'enter') {
      const { data } = await supabase.from('settings').select('pin_hash').single()
      const hash = await hashPin(entered)
      if (hash === data?.pin_hash) {
        sessionStorage.setItem('nestle_auth', '1')
        onLogin()
      } else {
        setErr(true); setShake(true)
        setTimeout(() => reset(), 700)
      }
    }
  }

  const subtitles = {
    loading: 'Loading...',
    setup:   'Create your PIN',
    confirm: 'Confirm your PIN',
    enter:   'your home, organised',
  }

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 32,
      backgroundImage: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(229,57,59,0.06) 0%, transparent 100%)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 style={{ margin: '0 0 6px', fontFamily: "'Fraunces', serif", fontSize: 46, fontWeight: 700, color: T.text, letterSpacing: '-0.01em' }}>
          Nestle
        </h1>
        <p style={{ margin: 0, color: T.muted, fontSize: 14, letterSpacing: '0.04em' }}>
          {subtitles[mode]}
        </p>
      </div>

      {mode !== 'loading' && (
        <>
          <div style={{ display: 'flex', gap: 20, marginBottom: 52, animation: shake ? 'shake 0.35s ease' : 'none' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: err ? T.red : pin.length > i ? T.text : T.bg4,
                border: `2px solid ${err ? T.red : pin.length > i ? T.text : T.border2}`,
                boxShadow: pin.length > i && !err ? '0 0 10px rgba(240,240,240,0.15)' : 'none',
                transition: 'all 0.18s',
              }} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, width: 264 }}>
            {PAD.map((d, i) => (
              <button key={i}
                onClick={() => {
                  if (d === '\u232b') setPin(p => p.slice(0, -1))
                  else if (d !== '') tap(d)
                }}
                style={{
                  height: 66, borderRadius: 12,
                  border: d === '' ? 'none' : `1px solid ${T.border}`,
                  cursor: d === '' ? 'default' : 'pointer',
                  background: d === '' ? 'transparent' : T.bg2,
                  color: d === '\u232b' ? T.muted : T.text,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: d === '\u232b' ? 20 : 26,
                  fontWeight: 500,
                  transition: 'background 0.12s',
                }}>
                {d}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
