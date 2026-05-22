import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Sheet from '../components/Sheet'
import { Lbl, PriBtn, Tag, Spinner } from '../components/UI'
import { T, inp, PERSONS, PERSON_STYLE, TYPE_STYLE, TYPES, PLATFORMS } from '../tokens'

const FILTERS = ['All', ...PERSONS]

export default function Watchlist() {
  const [list,        setList]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('All')
  const [showArchive, setShowArchive] = useState(false)
  const [showAdd,     setShowAdd]     = useState(false)
  const [form,        setForm]        = useState({ title: '', type: 'Movie', platform: '', genre: '', whose_choice: 'Aru Baby' })

  useEffect(() => {
    supabase.from('watchlist').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setList(data || [])
      setLoading(false)
    })
  }, [])

  const showing = list.filter(i => !i.is_watched && (filter === 'All' || i.whose_choice === filter))
  const watched = list.filter(i => i.is_watched)

  async function toggle(item) {
    const is_watched = !item.is_watched
    const watched_at = is_watched ? new Date().toISOString() : null
    setList(prev => prev.map(i => i.id !== item.id ? i : { ...i, is_watched, watched_at }))
    await supabase.from('watchlist').update({ is_watched, watched_at }).eq('id', item.id)
  }

  async function add() {
    if (!form.title.trim()) return
    const { data, error } = await supabase.from('watchlist').insert({
      title:        form.title.trim(),
      type:         form.type,
      platform:     form.platform,
      genre:        form.genre,
      whose_choice: form.whose_choice,
      is_watched:   false,
    }).select().single()
    if (!error && data) {
      setList(prev => [data, ...prev])
      setForm({ title: '', type: 'Movie', platform: '', genre: '', whose_choice: 'Aru Baby' })
      setShowAdd(false)
    }
  }

  if (loading) return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: '32px 22px 0' }}>
        <h1 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 32, color: T.text, fontWeight: 700 }}>Watch List</h1>
      </div>
      <Spinner />
    </div>
  )

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{ padding: '32px 22px 0', backgroundImage: 'linear-gradient(to bottom, rgba(229,57,59,0.04) 0%, transparent 80%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {showing.length} to watch · {watched.length} watched
            </p>
            <h1 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 32, color: T.text, fontWeight: 700, lineHeight: 1 }}>
              Watch List
            </h1>
          </div>
          <button onClick={() => setShowAdd(true)} style={{
            background: T.red, color: '#fff', border: 'none',
            borderRadius: 8, padding: '9px 18px', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(229,57,59,0.3)',
          }}>+ Add</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 7, padding: '18px 22px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {FILTERS.map(f => {
          const s  = PERSON_STYLE[f] || {}
          const on = filter === f
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              flexShrink: 0, padding: '7px 15px', borderRadius: 20,
              border: `1px solid ${on ? (f === 'All' ? 'rgba(229,57,59,0.4)' : s.color + '44') : T.border}`,
              cursor: 'pointer',
              background: on ? (f === 'All' ? T.redSoft : s.soft) : T.bg2,
              color:      on ? (f === 'All' ? T.red     : s.color) : T.sub,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              transition: 'all 0.18s',
            }}>
              {f === 'All' ? 'All' : `♥ ${f}`}
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {showing.map(item => {
          const ts = TYPE_STYLE[item.type]           || {}
          const ps = PERSON_STYLE[item.whose_choice] || {}
          return (
            <div key={item.id} style={{ background: T.bg2, borderRadius: 14, padding: '15px 16px', border: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 9px', fontFamily: "'Fraunces', serif", fontSize: 18, color: T.text, fontWeight: 600, lineHeight: 1.2 }}>
                    {item.title}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    <Tag soft={ts.soft} color={ts.color}>{item.type}</Tag>
                    {item.platform && <Tag soft={T.bg3} color={T.sub}>{item.platform}</Tag>}
                    {item.genre    && <Tag soft={T.bg3} color={T.muted}>{item.genre}</Tag>}
                    <Tag soft={ps.soft} color={ps.color}>♥ {item.whose_choice}</Tag>
                  </div>
                </div>
                <button onClick={() => toggle(item)} style={{
                  alignSelf: 'center', background: T.greenSoft, color: T.green,
                  border: `1px solid rgba(74,222,128,0.2)`,
                  borderRadius: 8, padding: '8px 13px', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, flexShrink: 0,
                }}>✓ Watched</button>
              </div>
            </div>
          )
        })}

        {showing.length === 0 && (
          <div style={{ textAlign: 'center', padding: '52px 0', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🎬</div>
            <p style={{ fontSize: 14, margin: 0 }}>Nothing here yet. Add something!</p>
          </div>
        )}

        {watched.length > 0 && (
          <button onClick={() => setShowArchive(true)} style={{
            background: 'none', border: `1px solid ${T.border}`, borderRadius: 10,
            padding: 13, cursor: 'pointer', color: T.muted,
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2,
          }}>📦 Archive · {watched.length} watched</button>
        )}
      </div>

      {/* Archive sheet */}
      <Sheet show={showArchive} onClose={() => setShowArchive(false)} title="Watched">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {watched.map(item => {
            const ts = TYPE_STYLE[item.type]           || {}
            const ps = PERSON_STYLE[item.whose_choice] || {}
            return (
              <div key={item.id} style={{ padding: '12px 14px', background: T.bg3, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${T.border}` }}>
                <div>
                  <p style={{ margin: '0 0 6px', fontFamily: "'Fraunces', serif", fontSize: 16, color: T.muted, textDecoration: 'line-through', fontWeight: 600 }}>
                    {item.title}
                  </p>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Tag soft={ts.soft} color={ts.color}>{item.type}</Tag>
                    <Tag soft={ps.soft} color={ps.color}>♥ {item.whose_choice}</Tag>
                  </div>
                </div>
                <button onClick={() => toggle(item)} style={{
                  background: 'none', border: `1px solid ${T.border2}`, borderRadius: 7,
                  padding: '6px 12px', cursor: 'pointer', color: T.muted,
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                }}>Unwatch</button>
              </div>
            )
          })}
        </div>
      </Sheet>

      {/* Add sheet */}
      <Sheet show={showAdd} onClose={() => setShowAdd(false)} title="Add to watchlist">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Lbl>Title</Lbl>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Movie or show name" style={inp} />
          </div>
          <div>
            <Lbl>Type</Lbl>
            <div style={{ display: 'flex', gap: 8 }}>
              {TYPES.map(t => {
                const s  = TYPE_STYLE[t] || {}
                const on = form.type === t
                return (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                    flex: 1, padding: '10px 0', borderRadius: 8,
                    border: `1px solid ${on ? s.color + '55' : T.border}`,
                    background: on ? s.soft : T.bg3,
                    color: on ? s.color : T.muted,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  }}>{t}</button>
                )
              })}
            </div>
          </div>
          <div>
            <Lbl>Platform</Lbl>
            <select value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} style={inp}>
              <option value="">Select...</option>
              {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <Lbl>Genre</Lbl>
            <input value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
              placeholder="Drama, Comedy, Sci-Fi..." style={inp} />
          </div>
          <div>
            <Lbl>Whose pick?</Lbl>
            <div style={{ display: 'flex', gap: 8 }}>
              {PERSONS.map(p => {
                const s  = PERSON_STYLE[p] || {}
                const on = form.whose_choice === p
                return (
                  <button key={p} onClick={() => setForm(f => ({ ...f, whose_choice: p }))} style={{
                    flex: 1, padding: '11px 0', borderRadius: 8,
                    border: `1px solid ${on ? s.color + '55' : T.border}`,
                    background: on ? s.soft : T.bg3,
                    color: on ? s.color : T.muted,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  }}>♥ {p}</button>
                )
              })}
            </div>
          </div>
          <PriBtn onClick={add}>Add to list</PriBtn>
        </div>
      </Sheet>
    </div>
  )
}
