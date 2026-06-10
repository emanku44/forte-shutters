'use client'
import { useState, useEffect, useCallback } from 'react'

// ── Shared styles ─────────────────────────────────────────
const c = {
  page:    { minHeight: '100vh', background: '#0F1109', color: '#EEE8D8', fontFamily: 'var(--font-body, sans-serif)' },
  inp:     { background: '#0F1109', border: '1px solid rgba(255,255,255,0.12)', color: '#EEE8D8', padding: '9px 12px', borderRadius: 2, fontSize: '0.9rem', width: '100%', outline: 'none', fontFamily: 'inherit' },
  savBtn:  (s) => ({ background: s ? '#5C6B2A' : '#C8960C', color: '#0F1109', border: 'none', borderRadius: 2, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }),
  addBtn:  { background: '#5C6B2A', color: '#EEE8D8', border: 'none', borderRadius: 2, padding: '9px 16px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  delBtn:  { background: 'rgba(220,50,50,0.1)', color: '#f87171', border: '1px solid rgba(220,50,50,0.2)', borderRadius: 2, padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit' },
  card:    { background: '#1E2214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, marginBottom: '1rem', overflow: 'hidden' },
  lbl:     { fontSize: '0.72rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5, fontWeight: 500 },
  row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 8 },
  rowLbl:  { fontSize: '0.8rem', color: '#8A9470', flexShrink: 0 },
  rowVal:  { fontSize: '0.875rem', fontWeight: 500, textAlign: 'right' },
}

const fmt = (n) => 'KES ' + Number(n || 0).toLocaleString()

// ── CSS injected for responsive behaviour ─────────────────
const STYLES = `
  .adm-wrap { max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem; }
  .adm-tabs { display: flex; overflow-x: auto; gap: 2px; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 1.5rem; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
  .adm-tabs::-webkit-scrollbar { display: none; }
  .adm-tab { flex-shrink: 0; background: none; border: none; border-bottom: 2px solid transparent; padding: 10px 16px; font-size: 0.82rem; font-weight: 500; cursor: pointer; font-family: inherit; transition: color 0.2s; margin-bottom: -1px; white-space: nowrap; }
  .adm-tab.active { color: #C8960C; border-bottom-color: #C8960C; }
  .adm-tab:not(.active) { color: #8A9470; }
  .adm-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }
  .adm-topbar { background: #171A0E; border-bottom: 2px solid #C8960C; padding: 0 1rem; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
  .adm-topbar-actions { display: flex; gap: 8px; }
  .adm-topbar-btn { background: none; border: 1px solid rgba(255,255,255,0.1); color: #8A9470; padding: 5px 10px; border-radius: 2px; cursor: pointer; font-size: 0.78rem; font-family: inherit; text-decoration: none; white-space: nowrap; }
  .adm-filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1rem; }

  /* Quote cards on mobile */
  .adm-quote-card { background: #1E2214; border: 1px solid rgba(255,255,255,0.07); border-radius: 4; padding: 1rem; margin-bottom: 0.75rem; }
  .adm-quote-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
  .adm-quote-name { font-weight: 600; font-size: 0.95rem; }
  .adm-quote-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; margin: 0.6rem 0; }
  .adm-quote-meta-item { font-size: 0.78rem; }
  .adm-quote-meta-item .ml { color: #8A9470; }
  .adm-quote-meta-item .mv { color: #EEE8D8; }

  /* Pricing cards */
  .adm-price-card { background: #1E2214; border: 1px solid rgba(255,255,255,0.07); border-radius: 4; padding: 1rem 1.25rem; margin-bottom: 0.75rem; }
  .adm-price-name { font-weight: 600; font-size: 0.9rem; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .adm-price-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

  /* Labour cards */
  .adm-labour-card { background: #1E2214; border: 1px solid rgba(255,255,255,0.07); border-radius: 4; padding: 1rem 1.25rem; margin-bottom: 0.75rem; }
  .adm-labour-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
  .adm-labour-town { font-weight: 700; font-size: 1rem; font-family: var(--font-display, sans-serif); text-transform: uppercase; letter-spacing: 0.05em; }
  .adm-labour-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
  .adm-labour-uplift { font-size: 0.78rem; color: #8A9470; padding: 6px 10px; background: rgba(200,150,12,0.05); border-radius: 2px; }

  /* Add town form */
  .adm-add-form { background: rgba(92,107,42,0.06); border: 1px solid rgba(92,107,42,0.15); border-radius: 4; padding: 1rem; margin-bottom: 1rem; }
  .adm-add-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }

  .adm-hint { font-size: 0.75rem; color: #8A9470; padding: 0.6rem 1rem; background: rgba(200,150,12,0.04); border-top: 1px solid rgba(200,150,12,0.08); }

  @media (max-width: 480px) {
    .adm-price-fields { grid-template-columns: 1fr; }
    .adm-labour-fields { grid-template-columns: 1fr; }
    .adm-add-grid { grid-template-columns: 1fr; }
    .adm-quote-meta { grid-template-columns: 1fr; }
    .adm-stats { grid-template-columns: 1fr 1fr; }
  }
`

// ── EditField — inline editable field ─────────────────────
function EditField({ label, value, type = 'number', prefix, onSave }) {
  const [val, setVal] = useState(value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const changed = String(val) !== String(value)

  const save = async () => {
    setSaving(true)
    await onSave(type === 'number' ? Number(val) : val)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <label style={c.lbl}>{label}</label>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {prefix && <span style={{ fontSize: '0.8rem', color: '#8A9470', flexShrink: 0 }}>{prefix}</span>}
        <input
          type={type === 'number' ? 'number' : 'text'}
          value={val}
          onChange={e => { setVal(e.target.value); setSaved(false) }}
          onKeyDown={e => e.key === 'Enter' && changed && save()}
          style={{ ...c.inp, flex: 1, minWidth: 0 }}
        />
        {changed
          ? <button onClick={save} style={c.savBtn(saving)}>{saving ? '…' : 'Save'}</button>
          : saved
            ? <span style={{ fontSize: '0.75rem', color: '#7A8F38', flexShrink: 0 }}>✓</span>
            : null
        }
      </div>
    </div>
  )
}

// ── Password Gate ─────────────────────────────────────────
function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true); setErr('')
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) })
    if (res.ok) onAuth()
    else { setErr('Incorrect password'); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0F1109', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#1E2214', border: '1px solid rgba(200,150,12,0.3)', borderRadius: 4, padding: '2rem', width: '100%', maxWidth: 340 }}>
        <div style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '0.12em', textAlign: 'center', color: '#EEE8D8', marginBottom: 4 }}>FORTE.</div>
        <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#8A9470', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2rem' }}>Admin Dashboard</div>
        <label style={c.lbl}>Password</label>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Enter admin password" style={{ ...c.inp, padding: '11px 14px', marginBottom: '0.75rem' }} autoFocus />
        {err && <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{err}</div>}
        <button onClick={submit} disabled={loading} style={{ ...c.savBtn(loading), width: '100%', padding: '12px', fontSize: '0.9rem' }}>
          {loading ? 'Checking…' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}

// ── Quote detail row helper ───────────────────────────────
function DetailRow({ label, value, highlight }) {
  if (!value || value === '—') return null
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 12 }}>
      <span style={{ fontSize: '0.78rem', color: '#8A9470', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: 500, textAlign: 'right', color: highlight ? '#C8960C' : '#EEE8D8' }}>{value}</span>
    </div>
  )
}

// ── Quotes Tab ────────────────────────────────────────────
function QuotesTab({ quotes, onStatusChange }) {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState({})
  const statuses = ['new', 'contacted', 'quoted', 'closed']
  const filtered = filter === 'all' ? quotes : quotes.filter(q => q.status === filter)
  const counts = statuses.reduce((a, s) => ({ ...a, [s]: quotes.filter(q => q.status === s).length }), {})
  const statusColor = { new: '#C8960C', contacted: '#7A8F38', quoted: '#60a5fa', closed: '#8A9470' }
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <>
      <div className="adm-stats">
        {[['Total', quotes.length, '#8A9470'], ['New', counts.new, '#C8960C'], ['Contacted', counts.contacted, '#7A8F38'], ['Quoted', counts.quoted, '#60a5fa']].map(([label, count, col]) => (
          <div key={label} style={{ background: '#1E2214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '1rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: col, fontFamily: 'var(--font-display, sans-serif)', lineHeight: 1 }}>{count}</div>
            <div style={{ fontSize: '0.72rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="adm-filter-row">
        {['all', ...statuses].map(st => (
          <button key={st} onClick={() => setFilter(st)} style={{
            background: filter === st ? 'rgba(200,150,12,0.12)' : 'transparent',
            border: `1px solid ${filter === st ? 'rgba(200,150,12,0.4)' : 'rgba(255,255,255,0.08)'}`,
            color: filter === st ? '#C8960C' : '#8A9470',
            padding: '5px 12px', borderRadius: 2, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
          }}>{st === 'all' ? `All (${quotes.length})` : `${st} (${counts[st]})`}</button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#8A9470', background: '#1E2214', borderRadius: 4 }}>No quotes yet</div>
      )}

      {filtered.map(q => {
        const isOpen = !!expanded[q.id]
        const openings = Array.isArray(q.openings) ? q.openings : []
        const totalArea = openings.reduce((s, o) => s + (parseFloat(o.w)||0)*(parseFloat(o.h)||0), 0)

        return (
          <div key={q.id} className="adm-quote-card" style={{ border: `1px solid ${isOpen ? 'rgba(200,150,12,0.3)' : 'rgba(255,255,255,0.07)'}`, transition: 'border-color 0.2s' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div className="adm-quote-name">{q.customer_name}</div>
                  {q.status === 'new' && <span style={{ background: 'rgba(200,150,12,0.15)', color: '#C8960C', fontSize: '0.65rem', padding: '2px 7px', borderRadius: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>New</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8A9470', marginTop: 2 }}>
                  {new Date(q.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: '2-digit' })}
                  {q.product_type && <span style={{ marginLeft: 8, color: '#EEE8D8' }}>· {q.product_type}</span>}
                  {q.location && <span style={{ marginLeft: 6, color: '#8A9470' }}>· {q.location}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                <select
                  value={q.status || 'new'}
                  onChange={e => onStatusChange(q.id, e.target.value)}
                  style={{ ...c.inp, width: 'auto', padding: '5px 8px', fontSize: '0.75rem', color: statusColor[q.status || 'new'], borderColor: statusColor[q.status || 'new'] + '55' }}
                >
                  {statuses.map(st => <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>)}
                </select>
                <button onClick={() => toggle(q.id)} style={{ background: isOpen ? 'rgba(200,150,12,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isOpen ? 'rgba(200,150,12,0.3)' : 'rgba(255,255,255,0.08)'}`, color: isOpen ? '#C8960C' : '#8A9470', borderRadius: 2, padding: '5px 9px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {isOpen ? '▲' : '▼'}
                </button>
              </div>
            </div>

            {/* Summary chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: '0.6rem' }}>
              {q.estimated_low && <span style={{ background: 'rgba(200,150,12,0.1)', color: '#C8960C', fontSize: '0.75rem', padding: '3px 10px', borderRadius: 2, fontWeight: 600 }}>KES {(q.estimated_low/1000).toFixed(0)}k – {(q.estimated_high/1000).toFixed(0)}k</span>}
              {q.motor && q.motor !== 'Manual (no motor)' && <span style={{ background: 'rgba(255,255,255,0.04)', color: '#8A9470', fontSize: '0.75rem', padding: '3px 10px', borderRadius: 2 }}>⚡ {q.motor}</span>}
              {totalArea > 0 && <span style={{ background: 'rgba(255,255,255,0.04)', color: '#8A9470', fontSize: '0.75rem', padding: '3px 10px', borderRadius: 2 }}>{totalArea.toFixed(1)} m²</span>}
              {q.addons?.length > 0 && <span style={{ background: 'rgba(92,107,42,0.12)', color: '#7A8F38', fontSize: '0.75rem', padding: '3px 10px', borderRadius: 2 }}>{q.addons.length} add-on{q.addons.length > 1 ? 's' : ''}</span>}
            </div>

            {/* Collapsible detail */}
            {isOpen && (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(200,150,12,0.15)' }}>

                <div style={{ fontSize: '0.7rem', color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Customer</div>
                <DetailRow label="Name" value={q.customer_name} />
                <DetailRow label="Phone" value={q.customer_phone} />
                <DetailRow label="Email" value={q.customer_email} />
                <DetailRow label="Contact via" value={q.contact_pref} />
                <DetailRow label="Property type" value={q.property_type} />
                <DetailRow label="Location" value={q.location} />

                <div style={{ fontSize: '0.7rem', color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: '1rem 0 0.5rem' }}>Product & Dimensions</div>
                <DetailRow label="Product type" value={q.product_type} />
                <DetailRow label="Material" value={q.material} />
                <DetailRow label="Colour / finish" value={q.colour} />
                {openings.map((o, i) => o.w && o.h ? <DetailRow key={i} label={`Opening ${i+1}`} value={`${o.w}m × ${o.h}m = ${(parseFloat(o.w)*parseFloat(o.h)).toFixed(2)} m²`} /> : null)}
                {totalArea > 0 && <DetailRow label="Total area" value={`${totalArea.toFixed(2)} m²`} highlight />}
                {q.special_notes && <DetailRow label="Special notes" value={q.special_notes} />}

                <div style={{ fontSize: '0.7rem', color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: '1rem 0 0.5rem' }}>Motor & Automation</div>
                <DetailRow label="Operation" value={q.motor} />
                {q.remote_count > 0 && q.motor !== 'Manual (no motor)' && <DetailRow label="Remote handsets" value={String(q.remote_count)} />}
                <DetailRow label="Access control" value={q.access_control !== 'None' ? q.access_control : null} />
                <DetailRow label="Power supply" value={q.power_supply} />

                {q.addons?.length > 0 && (
                  <>
                    <div style={{ fontSize: '0.7rem', color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: '1rem 0 0.5rem' }}>Add-ons Selected</div>
                    {q.addons.map(a => (
                      <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ width: 6, height: 6, background: '#7A8F38', borderRadius: '50%', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem' }}>{a}</span>
                      </div>
                    ))}
                  </>
                )}

                <div style={{ fontSize: '0.7rem', color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: '1rem 0 0.5rem' }}>Pricing</div>
                <DetailRow label="Warranty" value={q.warranty} />
                <DetailRow label="Estimated range" value={q.estimated_low ? `KES ${q.estimated_low.toLocaleString()} – ${q.estimated_high.toLocaleString()}` : null} highlight />

                {q.final_notes && (
                  <>
                    <div style={{ fontSize: '0.7rem', color: '#C8960C', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, margin: '1rem 0 0.5rem' }}>Customer Notes</div>
                    <div style={{ fontSize: '0.82rem', color: '#EEE8D8', background: 'rgba(255,255,255,0.02)', borderRadius: 2, padding: '8px 10px', lineHeight: 1.5 }}>{q.final_notes}</div>
                  </>
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {q.customer_phone && <a href={`https://wa.me/${q.customer_phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{ flex: '1 1 auto', textAlign: 'center', background: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)', borderRadius: 2, padding: '8px 12px', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 500 }}>💬 WhatsApp</a>}
                  {q.customer_phone && <a href={`tel:${q.customer_phone}`} style={{ flex: '1 1 auto', textAlign: 'center', background: 'rgba(255,255,255,0.04)', color: '#EEE8D8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, padding: '8px 12px', fontSize: '0.82rem', textDecoration: 'none' }}>📞 Call</a>}
                  {q.customer_email && <a href={`mailto:${q.customer_email}?subject=Your Forte Shutters Quote`} style={{ flex: '1 1 auto', textAlign: 'center', background: 'rgba(200,150,12,0.08)', color: '#C8960C', border: '1px solid rgba(200,150,12,0.2)', borderRadius: 2, padding: '8px 12px', fontSize: '0.82rem', textDecoration: 'none' }}>✉ Email</a>}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

// ── Products Tab ──────────────────────────────────────────
function ProductsTab({ data, onUpdate }) {
  if (!data.length) return (
    <div style={{ padding: '2rem', color: '#8A9470', textAlign: 'center', background: '#1E2214', borderRadius: 4 }}>
      No pricing data. Run <code>supabase-admin-setup.sql</code> first.
    </div>
  )

  return (
    <>
      {data.map(p => (
        <div key={p.id} className="adm-price-card">
          <div className="adm-price-name">{p.product_type}</div>
          <div className="adm-price-fields">
            <EditField label="Base Price (KES)" value={p.base_price} prefix="KES" onSave={v => onUpdate('pricing', p.id, { base_price: v })} />
            <EditField label="Per m² (KES)" value={p.price_per_sqm} prefix="KES" onSave={v => onUpdate('pricing', p.id, { price_per_sqm: v })} />
          </div>
          <div style={{ marginTop: '0.75rem' }}>
            <EditField label="Notes" value={p.notes || ''} type="text" onSave={v => onUpdate('pricing', p.id, { notes: v })} />
          </div>
        </div>
      ))}
      <div style={{ fontSize: '0.78rem', color: '#8A9470', padding: '0.75rem 1rem', background: 'rgba(200,150,12,0.04)', borderRadius: 2, border: '1px solid rgba(200,150,12,0.08)' }}>
        💡 Formula: Base Price + (Width × Height × Per m²) + Motor + Addons, then × town labour rate
      </div>
    </>
  )
}

// ── Motors & Addons Tab ───────────────────────────────────
function MotorsTab({ motors, addons, onUpdate }) {
  return (
    <>
      <div style={{ fontSize: '0.75rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 600 }}>Motors</div>
      {(motors || []).map(m => (
        <div key={m.id} style={{ background: '#1E2214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>{m.motor_type}</div>
          <EditField label="Price (KES)" value={m.price} prefix="KES" onSave={v => onUpdate('motor_pricing', m.id, { price: v })} />
        </div>
      ))}

      <div style={{ fontSize: '0.75rem', color: '#8A9470', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '1.25rem 0 0.75rem', fontWeight: 600 }}>Add-ons</div>
      {(addons || []).map(a => (
        <div key={a.id} style={{ background: '#1E2214', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '1rem 1.25rem', marginBottom: '0.75rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>{a.addon_name}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <EditField label="Price (KES)" value={a.price} prefix="KES" onSave={v => onUpdate('addon_pricing', a.id, { price: v })} />
            <EditField label="Display text" value={a.price_display} type="text" onSave={v => onUpdate('addon_pricing', a.id, { price_display: v })} />
          </div>
        </div>
      ))}
    </>
  )
}

// ── Labour Tab ────────────────────────────────────────────
function LabourTab({ rates, onUpdate, onDelete, onAdd }) {
  const [showForm, setShowForm] = useState(false)
  const [newTown, setNewTown] = useState({ town: '', flat_charge: 0, multiplier: 1.0, notes: '' })
  const [adding, setAdding] = useState(false)
  const nt = (k, v) => setNewTown(p => ({ ...p, [k]: v }))

  const add = async () => {
    if (!newTown.town) return
    setAdding(true)
    await onAdd(newTown)
    setNewTown({ town: '', flat_charge: 0, multiplier: 1.0, notes: '' })
    setAdding(false); setShowForm(false)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.78rem', color: '#8A9470' }}>Flat charge added first, then multiplier applied</div>
        <button style={c.addBtn} onClick={() => setShowForm(!showForm)}>+ Add Town</button>
      </div>

      {showForm && (
        <div className="adm-add-form">
          <div style={{ fontSize: '0.78rem', color: '#7A8F38', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 600 }}>New Town</div>
          <div className="adm-add-grid">
            <div><label style={c.lbl}>Town name</label><input type="text" value={newTown.town} onChange={e => nt('town', e.target.value)} placeholder="e.g. Eldoret" style={c.inp} /></div>
            <div><label style={c.lbl}>Flat charge (KES)</label><input type="number" value={newTown.flat_charge} onChange={e => nt('flat_charge', parseFloat(e.target.value))} style={c.inp} /></div>
            <div><label style={c.lbl}>Multiplier</label><input type="number" step="0.01" value={newTown.multiplier} onChange={e => nt('multiplier', parseFloat(e.target.value))} style={c.inp} /></div>
            <div><label style={c.lbl}>Notes</label><input type="text" value={newTown.notes} onChange={e => nt('notes', e.target.value)} placeholder="e.g. Overnight stay" style={c.inp} /></div>
          </div>
          <button onClick={add} disabled={adding} style={{ ...c.savBtn(adding), width: '100%', padding: '10px' }}>
            {adding ? 'Adding…' : 'Add Town'}
          </button>
        </div>
      )}

      {(rates || []).sort((a, b) => a.town.localeCompare(b.town)).map(r => {
        const uplift = Math.round(100000 * r.multiplier + r.flat_charge - 100000)
        return (
          <div key={r.id} className="adm-labour-card">
            <div className="adm-labour-top">
              <div className="adm-labour-town">{r.town}</div>
              {r.town !== 'Thika' && (
                <button style={c.delBtn} onClick={() => onDelete(r.id)}>Remove</button>
              )}
            </div>
            <div className="adm-labour-fields">
              <EditField label="Flat charge (KES)" value={r.flat_charge} prefix="KES" onSave={v => onUpdate(r.id, { flat_charge: v })} />
              <EditField label="Multiplier" value={r.multiplier} onSave={v => onUpdate(r.id, { multiplier: v })} />
            </div>
            <div className="adm-labour-uplift">
              Effective uplift on KES 100k job: <strong style={{ color: uplift > 0 ? '#C8960C' : '#8A9470' }}>+{fmt(uplift)}</strong>
              {r.notes && <span style={{ marginLeft: 8, opacity: 0.7 }}>· {r.notes}</span>}
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <EditField label="Notes" value={r.notes || ''} type="text" onSave={v => onUpdate(r.id, { notes: v })} />
            </div>
          </div>
        )
      })}
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

  const newCount = quotes.filter(q => q.status === 'new').length
  const TABS = [
    { key: 'quotes', label: newCount ? `Quotes (${newCount} new)` : 'Quotes' },
    { key: 'products', label: 'Products' },
    { key: 'motors', label: 'Motors & Add-ons' },
    { key: 'labour', label: 'Labour Rates' },
  ]

  return (
    <div style={c.page}>
      <style>{STYLES}</style>

      <div className="adm-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.1em', color: '#EEE8D8' }}>FORTE.</span>
          <span style={{ fontSize: '0.68rem', color: '#8A9470', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Admin</span>
        </div>
        <div className="adm-topbar-actions">
          <button onClick={load} className="adm-topbar-btn">↻</button>
          <a href="/" className="adm-topbar-btn" style={{ color: '#C8960C', borderColor: 'rgba(200,150,12,0.3)' }}>← Site</a>
        </div>
      </div>

      <div className="adm-wrap">
        <div className="adm-tabs">
          {TABS.map(t => (
            <button key={t.key} className={`adm-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
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
