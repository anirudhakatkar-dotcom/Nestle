import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Sheet from '../components/Sheet'
import { Lbl, PriBtn, PageHeader, Spinner } from '../components/UI'
import { T, inp } from '../tokens'

export default function Inventory() {
  const [categories, setCategories] = useState([])
  const [items,      setItems]      = useState([])
  const [activeCat,  setActiveCat]  = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [oosDlg,     setOosDlg]    = useState(false)
  const [addDlg,     setAddDlg]    = useState(false)
  const [form,       setForm]       = useState({ name: '', qty: '', unit: '', catId: null })

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [{ data: cats }, { data: its }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('items').select('*').order('name'),
    ])
    setCategories(cats || [])
    setItems(its || [])
    if (cats?.length > 0) { setActiveCat(cats[0].id); setForm(f => ({ ...f, catId: cats[0].id })) }
    setLoading(false)
  }

  const catItems = items.filter(i => i.category_id === activeCat)
  const allOOS   = items
    .filter(i => i.is_out_of_stock)
    .map(i => ({
      ...i,
      catName:  categories.find(c => c.id === i.category_id)?.name  || '',
      catEmoji: categories.find(c => c.id === i.category_id)?.emoji || '',
    }))

  async function toggleOOS(item) {
    const next = !item.is_out_of_stock
    setItems(prev => prev.map(i => i.id !== item.id ? i : { ...i, is_out_of_stock: next }))
    await supabase.from('items').update({ is_out_of_stock: next, updated_at: new Date().toISOString() }).eq('id', item.id)
  }

  async function addItem() {
    if (!form.name.trim()) return
    const { data, error } = await supabase.from('items').insert({
      category_id:    form.catId || activeCat,
      name:           form.name.trim(),
      last_quantity:  form.qty,
      last_unit:      form.unit,
      is_out_of_stock: false,
    }).select().single()
    if (!error && data) {
      setItems(prev => [...prev, data])
      setForm(f => ({ ...f, name: '', qty: '', unit: '' }))
      setAddDlg(false)
    }
  }

  const activeCatObj = categories.find(c => c.id === activeCat)

  if (loading) return (
    <div style={{ paddingBottom: 90 }}>
      <PageHeader eyebrow="Your pantry" title="Home Stock" />
      <Spinner />
    </div>
  )

  return (
    <div style={{ paddingBottom: 90 }}>
      <PageHeader
        eyebrow="Your pantry"
        title="Home Stock"
        right={allOOS.length > 0 && (
          <button onClick={() => setOosDlg(true)} style={{
            background: T.redSoft, color: T.red, border: 'none',
            borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>🛒 {allOOS.length}</button>
        )}
      />

      {/* Category strip */}
      <div style={{ overflowX: 'auto', display: 'flex', gap: 7, padding: '20px 22px 0', scrollbarWidth: 'none' }}>
        {categories.map(c => {
          const n  = items.filter(i => i.category_id === c.id && i.is_out_of_stock).length
          const on = activeCat === c.id
          return (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setForm(f => ({ ...f, catId: c.id })) }} style={{
              flexShrink: 0, padding: '7px 15px', borderRadius: 20,
              border: `1px solid ${on ? 'rgba(229,57,59,0.4)' : T.border}`,
              cursor: 'pointer',
              background: on ? T.redSoft : T.bg2,
              color: on ? T.red : T.sub,
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.18s',
            }}>
              {c.emoji} {c.name}
              {n > 0 && (
                <span style={{ background: T.red, color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{n}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Items */}
      <div style={{ padding: '14px 22px 0', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {catItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{activeCatObj?.emoji}</div>
            <p style={{ fontSize: 14, margin: 0 }}>Nothing here yet</p>
          </div>
        )}

        {catItems.map(item => (
          <div key={item.id} style={{
            background: item.is_out_of_stock ? 'rgba(229,57,59,0.05)' : T.bg2,
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: `1px solid ${item.is_out_of_stock ? 'rgba(229,57,59,0.2)' : T.border}`,
            transition: 'all 0.2s',
          }}>
            <div>
              <p style={{
                margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
                color: item.is_out_of_stock ? 'rgba(229,57,59,0.55)' : T.text,
                textDecoration: item.is_out_of_stock ? 'line-through' : 'none',
              }}>{item.name}</p>
              {(item.last_quantity || item.last_unit) && (
                <p style={{ margin: '3px 0 0', fontSize: 13, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
                  {item.last_quantity} {item.last_unit}
                </p>
              )}
            </div>
            <button onClick={() => toggleOOS(item)} style={{
              padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
              background: item.is_out_of_stock ? T.red : T.greenSoft,
              color:      item.is_out_of_stock ? '#fff' : T.green,
              transition: 'all 0.18s', flexShrink: 0,
            }}>
              {item.is_out_of_stock ? 'Out of stock' : 'In stock'}
            </button>
          </div>
        ))}

        <button onClick={() => setAddDlg(true)} style={{
          background: 'none', border: `1px dashed ${T.border2}`,
          borderRadius: 12, padding: '14px 0', cursor: 'pointer', color: T.muted,
          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 2,
        }}>+ Add to {activeCatObj?.emoji} {activeCatObj?.name}</button>
      </div>

      {/* OOS sheet */}
      <Sheet show={oosDlg} onClose={() => setOosDlg(false)} title="Shopping list">
        <p style={{ color: T.muted, fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: '0 0 14px' }}>
          Items to grab on your next run
        </p>
        {allOOS.length === 0
          ? <p style={{ color: T.muted, textAlign: 'center', padding: '24px 0', fontFamily: "'DM Sans', sans-serif" }}>All stocked up! 🎉</p>
          : allOOS.map(item => (
            <div key={item.id} style={{ padding: '13px 15px', background: T.bg3, borderRadius: 10, marginBottom: 7, border: `1px solid ${T.border}` }}>
              <p style={{ margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: T.text }}>{item.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>
                {item.catEmoji} {item.catName}{item.last_quantity ? ` · ${item.last_quantity} ${item.last_unit}` : ''}
              </p>
            </div>
          ))
        }
      </Sheet>

      {/* Add sheet */}
      <Sheet show={addDlg} onClose={() => setAddDlg(false)} title="Add item">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Lbl>Category</Lbl>
            <select value={form.catId || ''} onChange={e => setForm(f => ({ ...f, catId: e.target.value }))} style={inp}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div>
            <Lbl>Item name</Lbl>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Atta, Toothpaste" style={inp} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Lbl>Qty</Lbl>
              <input value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} placeholder="2" style={inp} />
            </div>
            <div style={{ flex: 1 }}>
              <Lbl>Unit</Lbl>
              <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="kg / L / pcs" style={inp} />
            </div>
          </div>
          <PriBtn onClick={addItem}>Add item</PriBtn>
        </div>
      </Sheet>
    </div>
  )
}
