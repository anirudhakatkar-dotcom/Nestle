import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Sheet from '../components/Sheet'
import { PriBtn, SecBtn, PageHeader, Spinner } from '../components/UI'
import { T, inp, DAYS, MEALS } from '../tokens'

function getMonday(date = new Date()) {
  const d   = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  d.setHours(0, 0, 0, 0)
  return d
}

export default function Meals() {
  const [mealData,  setMealData]  = useState({})
  const [weekStart, setWeekStart] = useState('')
  const [activeDay, setActiveDay] = useState('Mon')
  const [editing,   setEditing]   = useState(null)
  const [val,       setVal]       = useState('')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    const str = getMonday().toISOString().split('T')[0]
    setWeekStart(str)
    loadMeals(str)
  }, [])

  async function loadMeals(weekStartStr) {
    const { data } = await supabase.from('meal_plan').select('*').eq('week_start_date', weekStartStr)
    const m = {}
    DAYS.forEach(d => { m[d] = {}; MEALS.forEach(meal => { m[d][meal.key] = '' }) })
    data?.forEach(row => { if (m[row.day_of_week]) m[row.day_of_week][row.meal_type] = row.content || '' })
    setMealData(m)
    setLoading(false)
  }

  function openEdit(meal) { setEditing(meal); setVal(mealData[activeDay]?.[meal.key] || '') }

  async function save() {
    if (!editing) return
    const content  = val.trim()
    const mealKey  = editing.key
    const day      = activeDay
    setMealData(prev => ({ ...prev, [day]: { ...prev[day], [mealKey]: content } }))
    setEditing(null)
    await supabase.from('meal_plan').upsert({
      week_start_date: weekStart,
      day_of_week:     day,
      meal_type:       mealKey,
      content,
      updated_at:      new Date().toISOString(),
    }, { onConflict: 'week_start_date,day_of_week,meal_type' })
  }

  async function clearMeal() {
    if (!editing) return
    const mealKey = editing.key
    const day     = activeDay
    setMealData(prev => ({ ...prev, [day]: { ...prev[day], [mealKey]: '' } }))
    setEditing(null)
    setVal('')
    await supabase.from('meal_plan').upsert({
      week_start_date: weekStart,
      day_of_week:     day,
      meal_type:       mealKey,
      content:         '',
      updated_at:      new Date().toISOString(),
    }, { onConflict: 'week_start_date,day_of_week,meal_type' })
  }

  const dayFill = d => MEALS.filter(m => mealData[d]?.[m.key]).length

  if (loading) return (
    <div style={{ paddingBottom: 90 }}>
      <PageHeader eyebrow="Weekly view" title="Meal Planner" />
      <Spinner />
    </div>
  )

  return (
    <div style={{ paddingBottom: 90 }}>
      <PageHeader eyebrow="Weekly view" title="Meal Planner" />

      {/* Day strip */}
      <div style={{ overflowX: 'auto', display: 'flex', gap: 7, padding: '20px 22px 0', scrollbarWidth: 'none' }}>
        {DAYS.map(d => {
          const on = d === activeDay
          return (
            <button key={d} onClick={() => setActiveDay(d)} style={{
              flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '9px 16px', borderRadius: 20,
              border: `1px solid ${on ? 'rgba(229,57,59,0.4)' : T.border}`,
              cursor: 'pointer',
              background: on ? T.redSoft : T.bg2,
              color: on ? T.red : T.sub,
              transition: 'all 0.18s', gap: 5,
            }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{d}</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {MEALS.map(m => (
                  <div key={m.key} style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: mealData[d]?.[m.key] ? (on ? T.red : T.green) : T.border2,
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Meal slots */}
      <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MEALS.map(meal => {
          const content = mealData[activeDay]?.[meal.key] || ''
          return (
            <div key={meal.key} style={{
              background: T.bg2, borderRadius: 14, padding: '16px 18px',
              border: `1px solid ${content ? 'rgba(74,222,128,0.15)' : T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: content ? T.greenSoft : T.bg3,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>{meal.icon}</span>
                <div>
                  <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: T.muted, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {meal.label}
                  </p>
                  <p style={{ margin: '3px 0 0', fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: content ? T.text : T.muted, fontStyle: content ? 'normal' : 'italic' }}>
                    {content || 'Not planned'}
                  </p>
                </div>
              </div>
              <button onClick={() => openEdit(meal)} style={{
                background: content ? T.greenSoft : T.bg3,
                color: content ? T.green : T.muted,
                border: 'none', borderRadius: 8, padding: '7px 13px',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                fontSize: 12, fontWeight: 600, flexShrink: 0,
              }}>{content ? 'Edit' : '+ Add'}</button>
            </div>
          )
        })}

        <div style={{
          background: T.bg2, borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 4,
          border: 'rgba(74,222,128,0.1)',
        }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
            Tomorrow's menu heads to your WhatsApp at{' '}
            <span style={{ color: T.green }}>9 PM</span> every night
          </p>
        </div>
      </div>

      <Sheet show={!!editing} onClose={() => setEditing(null)} title={`${editing?.icon} ${editing?.label} — ${activeDay}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          <textarea value={val} onChange={e => setVal(e.target.value)}
            placeholder="What's on the menu?" rows={3}
            style={{ ...inp, resize: 'none' }} />
          <PriBtn onClick={save}>Save</PriBtn>
          {mealData[activeDay]?.[editing?.key] && <SecBtn onClick={clearMeal}>Clear</SecBtn>}
        </div>
      </Sheet>
    </div>
  )
}
