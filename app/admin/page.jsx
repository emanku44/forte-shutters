'use client'
import { useState, useEffect, useCallback } from 'react'

// ── Styles ────────────────────────────────────────────────
const s = {
  page:    { minHeight: '100vh', background: '#0F1109', color: '#EEE8D8', fontFamily: 'var(--font-body, sans-serif)', padding: 0 },
  topbar:  { background: '#171A0E', borderBottom: '2px solid #C8960C', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  logo:    { fontFamily: 'var(--font-display, sans-serif)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.1em', color: '#EEE8D8' },
  wrap:    { maxWidth: 1100, margin: '0 auto', padding: '2rem' },
  tabs:    { display: 'flex', gap: 4, marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 0 },
  tab:     (active) => ({ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 500, color: active ? '#C8960C' : '#8A9470', borderBottom: active ? '2px solid #C8960C' : '2px solid transparent', marginBottom: -1, fontFamily: 'inherit', transition: 'color 0.2s', letterSpacing: '0.03em' }),
  card:    { background: '#1E2214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, marginBottom: '1.5rem', overflow: 'hidden' },
  cardHdr: { padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTtl: { fontFamily: 'var(--font-display, sans-serif)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.08em' },
  table:   { width: '100%', borderCollapse: 'collapse' },
  th:      { padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.07)', fontWeight: 500 },
  td:      { padding: '12px 16px', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'middle' },
  inp:     { background: '#0F1109', border: '1px solid rgba(255,255,255,0.12)', color: '#EEE8D8', padding: '6px 10px', borderRadius: 2, fontSize: '0.875rem', width: '100%', outline: 'none', fontFamily: 'inherit' },
  savBtn:  (saving) => ({ background: saving ? '#5C6B2A' : '#C8960C', color: '#0F1109', border: 'none', borderRadius: 2, padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minWidth: 60 }),
  addBtn:  { background: '#5C6B2A', color: '#EEE8D8', border: 'none', borderRadius: 2, padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  delBtn:  { background: 'rgba(220,50,50,0.12)', color: '#f87171', border: '1px solid rgba(220,50,50,0.2)', borderRadius: 2, padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' },
  badge:   (c) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 2, fontSize: '0.7rem', fontWeight: 600, background: c === 'new' ? 'rgba(200,150,12,0.15)' : c === 'contacted' ? 'rgba(92,107,42,0.2)' : c === 'quoted' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.08)', color: c === 'new' ? '#C8960C' : c === 'contacted' ? '#7A8F38' : c === 'quoted' ? '#60a5fa' : '#8A9470', textTransform: 'uppercase', letterSpacing: '0.06em' }),
  statBox: { background: '#1E2214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '1.25rem 1.5rem' },
}

function fmt(n) { return 'KES ' + Number(n || 0).toLocaleString() }

// ── Password Gate ─────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true); setErr('')
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
    if (res.ok) { onAuth() }
    else { setErr('Incorrect password'); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1109', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1E2214', border: '1px solid rgba(200,150,12,0.3)', borderRadius: 4, padding: '2.5rem', width: 340 }}>
        <div style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '0.25rem', color: '#EEE8D8' }}>FORTE.</div>
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8A9470', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>Admin Dashboard</div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Password</label>
          <input
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Enter admin password"
            style={{ ...s.inp, padding: '10px 14px', width: '100%' }}
            autoFocus
          />
        </div>
        {err && <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{err}</div>}
        <button onClick={submit} disabled={loading} style={{ ...s.savBtn(loading), width: '100%', padding: '11px', fontSize: '0.9rem' }}>
          {loading ? 'Checking…' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

// ── Editable cell ─────────────────────────────────────────
function EditCell({ value, type = 'number', prefix = '', onSave }) {
  const [val, setVal] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const changed = String(val) !== String(value)

  const save = async () => {
    setSaving(true)
    await onSave(type === 'number' ? Number(val) : val)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {prefix && <span style={{ color: '#8A9470', fontSize: '0.8rem' }}>{prefix}</span>}
      <input
        type={type === 'number' ? 'number' : 'text'}
        value={val}
        onChange={e => { setVal(e.target.value); setSaved(false) }}
        onKeyDown={e => e.key === 'Enter' && changed && save()}
        style={{ ...s.inp, width: type === 'number' ? 100 : 140 }}
      />
      {changed && <button onClick={save} style={s.savBtn(saving)}>{saving ? '…' : 'Save'}</button>}
      {saved && !changed && <span style={{ fontSize: '0.75rem', color: '#7A8F38' }}>✓</span>}
    </div>
  )
}

// ── Products Tab ──────────────────────────────────────────
function ProductsTab({ data, onUpdate }) {
  if (!data.length) return <div style={{ padding: '2rem', color: '#8A9470' }}>No pricing data. Run supabase-admin-setup.sql first.</div>

  return (
    <div style={s.card}>
      <div style={s.cardHdr}>
        <div style={s.cardTtl}>Product Base Pricing</div>
        <div style={{ fontSize: '0.75rem', color: '#8A9470' }}>Changes take effect on the next quote immediately</div>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Product</th>
            <th style={s.th}>Base Price (KES)</th>
            <th style={s.th}>Per m² (KES)</th>
            <th style={s.th}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {data.map(p => (
            <tr key={p.id} style={{ transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <td style={{ ...s.td, fontWeight: 500 }}>{p.product_type}</td>
              <td style={s.td}>
                <EditCell value={p.base_price} prefix="KES" onSave={v => onUpdate('pricing', p.id, { base_price: v })} />
              </td>
              <td style={s.td}>
                <EditCell value={p.price_per_sqm} prefix="KES" onSave={v => onUpdate('pricing', p.id, { price_per_sqm: v })} />
              </td>
              <td style={s.td}>
                <EditCell value={p.notes || ''} type="text" onSave={v => onUpdate('pricing', p.id, { notes: v })} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(200,150,12,0.05)', borderTop: '1px solid rgba(200,150,12,0.1)', fontSize: '0.8rem', color: '#8A9470' }}>
        💡 Quote formula: <span style={{ color: '#EEE8D8' }}>Base Price + (Width × Height × Per m²) + Motor + Addons</span>, then multiplied by the town labour rate
      </div>
    </div>
  )
}

// ── Motors & Addons Tab ───────────────────────────────────
function MotorsTab({ motors, addons, onUpdate }) {
  return (
    <>
      <div style={s.card}>
        <div style={s.cardHdr}><div style={s.cardTtl}>Motor Pricing</div></div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Motor Type</th>
              <th style={s.th}>Price (KES)</th>
            </tr>
          </thead>
          <tbody>
            {(motors || []).map(m => (
              <tr key={m.id}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...s.td, fontWeight: 500 }}>{m.motor_type}</td>
                <td style={s.td}>
                  <EditCell value={m.price} prefix="KES" onSave={v => onUpdate('motor_pricing', m.id, { price: v })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={s.card}>
        <div style={s.cardHdr}><div style={s.cardTtl}>Add-on Pricing</div></div>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Add-on</th>
              <th style={s.th}>Price (KES)</th>
              <th style={s.th}>Display Text</th>
            </tr>
          </thead>
          <tbody>
            {(addons || []).map(a => (
              <tr key={a.id}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...s.td, fontWeight: 500 }}>{a.addon_name}</td>
                <td style={s.td}>
                  <EditCell value={a.price} prefix="KES" onSave={v => onUpdate('addon_pricing', a.id, { price: v })} />
                </td>
                <td style={s.td}>
                  <EditCell value={a.price_display} type="text" onSave={v => onUpdate('addon_pricing', a.id, { price_display: v })} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Labour Rates Tab ──────────────────────────────────────
function LabourTab({ rates, onUpdate, onDelete, onAdd }) {
  const [newTown, setNewTown] = useState({ town: '', flat_charge: 0, multiplier: 1.0, notes: '' })
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const add = async () => {
    if (!newTown.town) return
    setAdding(true)
    await onAdd(newTown)
    setNewTown({ town: '', flat_charge: 0, multiplier: 1.0, notes: '' })
    setAdding(false); setShowForm(false)
  }

  return (
    <div style={s.card}>
      <div style={s.cardHdr}>
        <div>
          <div style={s.cardTtl}>Labour Rates by Town</div>
          <div style={{ fontSize: '0.75rem', color: '#8A9470', marginTop: 2 }}>Flat charge added first, then multiplier applied to full quote subtotal</div>
        </div>
        <button style={s.addBtn} onClick={() => setShowForm(!showForm)}>+ Add Town</button>
      </div>

      {showForm && (
        <div style={{ padding: '1rem 1.5rem', background: 'rgba(92,107,42,0.06)', borderBottom: '1px solid rgba(92,107,42,0.15)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr auto', gap: 10, alignItems: 'end' }}>
          {[['Town name', 'town', 'text'], ['Flat charge (KES)', 'flat_charge', 'number'], ['Multiplier', 'multiplier', 'number']].map(([label, key, type]) => (
            <div key={key}>
              <label style={{ fontSize: '0.72rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>{label}</label>
              <input type={type} step={key === 'multiplier' ? 0.01 : 1} value={newTown[key]}
                onChange={e => setNewTown(p => ({ ...p, [key]: type === 'number' ? parseFloat(e.target.value) : e.target.value }))}
                style={{ ...s.inp, width: '100%' }}
              />
            </div>
          ))}
          <div>
            <label style={{ fontSize: '0.72rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>Notes</label>
            <input type="text" placeholder="e.g. Overnight accommodation" value={newTown.notes}
              onChange={e => setNewTown(p => ({ ...p, notes: e.target.value }))}
              style={{ ...s.inp, width: '100%' }}
            />
          </div>
          <button onClick={add} disabled={adding} style={{ ...s.savBtn(adding), padding: '8px 14px', alignSelf: 'end' }}>
            {adding ? '…' : 'Add'}
          </button>
        </div>
      )}

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Town</th>
            <th style={s.th}>Flat Charge</th>
            <th style={s.th}>Multiplier</th>
            <th style={s.th}>Effective uplift on KES 100k job</th>
            <th style={s.th}>Notes</th>
            <th style={s.th}></th>
          </tr>
        </thead>
        <tbody>
          {(rates || []).sort((a, b) => a.town.localeCompare(b.town)).map(r => {
            const uplift = Math.round((100000 * r.multiplier + r.flat_charge) - 100000)
            return (
              <tr key={r.id}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...s.td, fontWeight: 600 }}>{r.town}</td>
                <td style={s.td}>
                  <EditCell value={r.flat_charge} prefix="KES" onSave={v => onUpdate(r.id, { flat_charge: v })} />
                </td>
                <td style={s.td}>
                  <EditCell value={r.multiplier} onSave={v => onUpdate(r.id, { multiplier: v })} />
                </td>
                <td style={{ ...s.td, color: uplift > 0 ? '#C8960C' : '#8A9470' }}>
                  +{fmt(uplift)}
                </td>
                <td style={s.td}>
                  <EditCell value={r.notes || ''} type="text" onSave={v => onUpdate(r.id, { notes: v })} />
                </td>
                <td style={s.td}>
                  {r.town !== 'Thika' && (
                    <button style={s.delBtn} onClick={() => onDelete(r.id)}>Remove</button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Quotes Tab ────────────────────────────────────────────
function QuotesTab({ quotes, onStatusChange }) {
  const [filter, setFilter] = useState('all')
  const statuses = ['new', 'contacted', 'quoted', 'closed']
  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.status === filter)
  const counts = statuses.reduce((acc, st) => ({ ...acc, [st]: quotes.filter(q => q.status === st).length }), {})

  return (
    <>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[['Total', quotes.length, '#8A9470'], ['New', counts.new, '#C8960C'], ['Contacted', counts.contacted, '#7A8F38'], ['Quoted', counts.quoted, '#60a5fa']].map(([label, count, color]) => (
          <div key={label} style={s.statBox}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color, fontFamily: 'var(--font-display, sans-serif)', lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: '0.75rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
        {['all', ...statuses].map(st => (
          <button key={st} onClick={() => setFilter(st)} style={{
            background: filter === st ? 'rgba(200,150,12,0.15)' : 'transparent',
            border: `1px solid ${filter === st ? 'rgba(200,150,12,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: filter === st ? '#C8960C' : '#8A9470',
            padding: '5px 14px', borderRadius: 2, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
          }}>{st === 'all' ? 'All' : st}</button>
        ))}
      </div>

      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Date</th>
              <th style={s.th}>Customer</th>
              <th style={s.th}>Phone</th>
              <th style={s.th}>Product</th>
              <th style={s.th}>Location</th>
              <th style={s.th}>Est. Range</th>
              <th style={s.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#8A9470', padding: '2rem' }}>No quotes yet</td></tr>
            )}
            {filtered.map(q => (
              <tr key={q.id}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ ...s.td, color: '#8A9470', whiteSpace: 'nowrap' }}>{new Date(q.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                <td style={{ ...s.td, fontWeight: 500 }}>{q.customer_name}</td>
                <td style={s.td}>
                  <a href={`https://wa.me/${q.customer_phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#25D366', textDecoration: 'none', fontSize: '0.85rem' }}>
                    {q.customer_phone}
                  </a>
                </td>
                <td style={s.td}>{q.product_type}</td>
                <td style={s.td}>{q.location || '—'}</td>
                <td style={{ ...s.td, color: '#C8960C', whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {q.estimated_low ? `${(q.estimated_low/1000).toFixed(0)}k–${(q.estimated_high/1000).toFixed(0)}k` : '—'}
                </td>
                <td style={s.td}>
                  <select
                    value={q.status || 'new'}
                    onChange={e => onStatusChange(q.id, e.target.value)}
                    style={{ ...s.inp, width: 110, padding: '4px 8px', fontSize: '0.78rem' }}
                  >
                    {statuses.map(st => <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

// ── Main Admin Page ───────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('quotes')
  const [pricing, setPricing] = useState([])
  const [motors, setMotors] = useState([])
  const [addons, setAddons] = useState([])
  const [labour, setLabour] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [prRes, labRes, qRes] = await Promise.all([
      fetch('/api/pricing'),
      fetch('/api/labour'),
      fetch('/api/quote'),
    ])
    const prData = await prRes.json()
    const labData = await labRes.json()
    const qData = qRes.ok ? await qRes.json() : []
    setPricing(prData.pricing || [])
    setMotors(prData.motors || [])
    setAddons(prData.addons || [])
    setLabour(Array.isArray(labData) ? labData : [])
    setQuotes(Array.isArray(qData) ? qData : [])
    setLoading(false)
  }, [])

  useEffect(() => { if (authed) load() }, [authed, load])

  const updatePricing = async (table, id, updates) => {
    await fetch('/api/pricing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ table, id, updates }) })
    load()
  }

  const updateLabour = async (id, updates) => {
    await fetch('/api/labour', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, updates }) })
    load()
  }

  const addLabour = async (data) => {
    await fetch('/api/labour', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates: data }) })
    load()
  }

  const deleteLabour = async (id) => {
    if (!confirm('Remove this town?')) return
    await fetch('/api/labour', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  const updateQuoteStatus = async (id, status) => {
    const { supabase } = await import('@/lib/supabase')
    await supabase.from('quotes').update({ status }).eq('id', id)
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q))
  }

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  const TABS = [
    { key: 'quotes', label: `Quotes${quotes.filter(q=>q.status==='new').length ? ` (${quotes.filter(q=>q.status==='new').length} new)` : ''}` },
    { key: 'products', label: 'Product Pricing' },
    { key: 'motors', label: 'Motors & Add-ons' },
    { key: 'labour', label: 'Labour Rates' },
  ]

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div>
          <span style={s.logo}>FORTE.</span>
          <span style={{ color: '#8A9470', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginLeft: 12 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={load} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#8A9470', padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit' }}>↻ Refresh</button>
          <a href="/" style={{ background: 'none', border: '1px solid rgba(200,150,12,0.3)', color: '#C8960C', padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', textDecoration: 'none' }}>← View Site</a>
        </div>
      </div>

      <div style={s.wrap}>
        <div style={s.tabs}>
          {TABS.map(t => (
            <button key={t.key} style={s.tab(tab === t.key)} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#8A9470' }}>Loading…</div>
        ) : (
          <>
            {tab === 'quotes'   && <QuotesTab quotes={quotes} onStatusChange={updateQuoteStatus} />}
            {tab === 'products' && <ProductsTab data={pricing} onUpdate={updatePricing} />}
            {tab === 'motors'   && <MotorsTab motors={motors} addons={addons} onUpdate={updatePricing} />}
            {tab === 'labour'   && <LabourTab rates={labour} onUpdate={updateLabour} onDelete={deleteLabour} onAdd={addLabour} />}
          </>
        )}
      </div>
    </div>
  )
}
