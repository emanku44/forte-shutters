'use client'
import { useState, useEffect } from 'react'

const TYPES = [
  { icon: '🔒', name: 'Security Shutter', hint: 'High-security premises' },
  { icon: '🏪', name: 'Shop Front Shutter', hint: 'Retail & commercial' },
  { icon: '🚗', name: 'Garage Shutter', hint: 'Residential & commercial' },
  { icon: '🏭', name: 'Industrial Shutter', hint: 'Warehouses & factories' },
  { icon: '⚡', name: 'Electric Gate', hint: 'Compounds & estates' },
  { icon: '🪟', name: 'Window Shutter', hint: 'Residential & office' },
]

const RECOMMENDATIONS = {
  'Security Shutter': 'For high-security applications, we recommend galvanised steel slats with anti-pry locking bars and a standard electric motor.',
  'Shop Front Shutter': 'For retail premises, we typically recommend a perforated powder-coated steel shutter — allows visibility while closed.',
  'Garage Shutter': 'Aluminium with a standard tubular motor and 2 remote handsets is our most popular residential option.',
  'Industrial Shutter': 'Industrial applications require heavy-gauge galvanised steel with a 3-phase motor sized to your opening.',
  'Electric Gate': 'We recommend a sliding gate operator with GSM access control and battery backup for power-outage resilience.',
  'Window Shutter': 'Powder-coated aluminium with spring-assisted manual mechanism — lightweight, weather-resistant, and durable.',
}

const MOTORS = [
  { name: 'Manual', desc: 'Pull-strap or hand-crank. Zero running costs, reliable.', badge: 'Budget-friendly', key: 'Manual (no motor)' },
  { name: 'Standard Electric', desc: 'Single-phase tubular motor with remote control handset.', badge: 'Most popular', key: 'Standard Electric Motor' },
  { name: 'Heavy-Duty 3-Phase', desc: '3-phase industrial motor for high-traffic environments.', badge: 'Industrial', key: 'Heavy-Duty 3-Phase Motor' },
  { name: 'Smart Motor', desc: 'WiFi-enabled with smartphone app and scheduling.', badge: 'Premium', key: 'Smart Motor with App Control' },
]

const ADDON_LIST = [
  { name: 'Professional Installation', desc: 'Site survey, certified fitting, full test sign-off & clean-up' },
  { name: 'Annual Maintenance Plan', desc: 'Yearly service visit, lubrication, alignment, priority call-out' },
  { name: 'Powder-Coat Colour Upgrade', desc: 'Custom RAL colour on slats and housing box' },
  { name: 'Battery Backup Unit', desc: 'Auto-engages during outages — 30+ open/close cycles' },
  { name: 'CCTV / Intercom Integration', desc: 'Connect to CCTV, video intercom, or alarm panels' },
]

const WARRANTIES = [
  { label: '1 Year (Free)', value: '1 Year (Standard)', cost: 0 },
  { label: '2 Years +KES 5,000', value: '2 Years (+KES 5,000)', cost: 5000 },
  { label: '3 Years +KES 9,000', value: '3 Years (+KES 9,000)', cost: 9000 },
  { label: '5 Years +KES 15,000', value: '5 Years (+KES 15,000)', cost: 15000 },
]

const fmt = (n) => 'KES ' + Math.round(n || 0).toLocaleString()

function calcBreakdown(data, livePricing) {
  const { pricing, motors, addons, labour } = livePricing

  // Materials
  const prod = pricing.find(p => p.product_type === data.product_type)
  const area = (data.openings || []).reduce((s, o) => s + (parseFloat(o.w)||0)*(parseFloat(o.h)||0), 0)
  const materials = prod ? (prod.base_price + area * prod.price_per_sqm) : 0

  // Motor
  const motorRow = motors.find(m => m.motor_type === data.motor)
  const motorCost = motorRow ? motorRow.price : 0

  // Addons
  const addonCost = (data.addons || []).reduce((s, name) => {
    const a = addons.find(a => a.addon_name === name)
    return s + (a ? a.price : 0)
  }, 0)

  // Warranty
  const warrantyCost = WARRANTIES.find(w => w.value === data.warranty)?.cost || 0

  // Subtotal before labour
  const subtotal = materials + motorCost + addonCost + warrantyCost

  // Labour
  const town = (data.location || '').trim()
  const labourRow = labour.find(l => town.toLowerCase().includes(l.town.toLowerCase()))
  const flatCharge = labourRow ? labourRow.flat_charge : 0
  const multiplier = labourRow ? parseFloat(labourRow.multiplier) : 1.0
  const labourCost = Math.round(subtotal * (multiplier - 1) + flatCharge)

  const total = subtotal + labourCost
  const lo = Math.round(total / 1000) * 1000
  const hi = Math.round(lo * 1.2 / 1000) * 1000

  return { materials, motorCost, addonCost, warrantyCost, subtotal, labourCost, flatCharge, multiplier, labourTown: labourRow?.town || null, total, lo, hi }
}

const inputStyle = { background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)', padding: '11px 14px', borderRadius: 2, fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none', width: '100%' }
const labelStyle = { fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500 }

export default function QuoteBuilder() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [livePricing, setLivePricing] = useState({ pricing: [], motors: [], addons: [], labour: [] })
  const [pricingLoaded, setPricingLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/pricing').then(r => r.json()).then(d => {
      fetch('/api/labour').then(r => r.json()).then(lab => {
        setLivePricing({ pricing: d.pricing || [], motors: d.motors || [], addons: d.addons || [], labour: Array.isArray(lab) ? lab : [] })
        setPricingLoaded(true)
      })
    })
  }, [])

  const [data, setData] = useState({
    product_type: '', property_type: '', location: '',
    openings: [{ w: '', h: '' }],
    material: '', colour: '', special_notes: '',
    motor: '', remote_count: 2, access_control: 'None', power_supply: 'Reliable mains power available',
    addons: [], warranty: '1 Year (Standard)',
    customer_name: '', customer_phone: '', customer_email: '',
    contact_pref: 'WhatsApp / Phone call', final_notes: '',
  })

  const set = (key, val) => setData(prev => ({ ...prev, [key]: val }))
  const addOpening = () => set('openings', [...data.openings, { w: '', h: '' }])
  const updateOpening = (i, key, val) => {
    const next = [...data.openings]; next[i] = { ...next[i], [key]: val }; set('openings', next)
  }
  const toggleAddon = (name) => set('addons', data.addons.includes(name) ? data.addons.filter(a => a !== name) : [...data.addons, name])

  const next = () => {
    if (step === 1 && !data.product_type) { alert('Please select a product type.'); return }
    if (step === 3 && !data.motor) { alert('Please select an operation type.'); return }
    setStep(s => s + 1)
    setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }
  const back = () => { setStep(s => s - 1); setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 50) }

  const submit = async () => {
    if (!data.customer_name || !data.customer_phone) { alert('Please enter your name and phone number.'); return }
    setLoading(true); setError('')
    try {
      const breakdown = calcBreakdown(data, livePricing)
      const res = await fetch('/api/quote', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimated_low: breakdown.lo, estimated_high: breakdown.hi }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submission failed')
      setSubmitted(true)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const breakdown = pricingLoaded ? calcBreakdown(data, livePricing) : null

  // Get addon display price from live data
  const addonDisplay = (name) => {
    const a = livePricing.addons.find(a => a.addon_name === name)
    return a ? a.price_display : ''
  }

  if (submitted) {
    return (
      <section id="quote" className="section section-charcoal">
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', padding: '3rem 2rem', background: 'var(--panel)', border: '1px solid var(--border-gold)', borderRadius: 4 }}>
          <div style={{ width: 70, height: 70, background: 'rgba(92,107,42,0.12)', border: '1px solid rgba(92,107,42,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Quote Request Received!</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: 400, margin: '0.75rem auto 0' }}>
            A Forte Shutters specialist will contact you within <strong style={{ color: 'var(--text)' }}>24 hours</strong> with a full itemised quote.
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Urgent? WhatsApp us: <a href="tel:+254700000000" style={{ color: 'var(--mustard-light)', textDecoration: 'none' }}>+254 700 000 000</a></p>
          <button className="btn-outline" style={{ marginTop: '2rem' }} onClick={() => { setSubmitted(false); setStep(1); setData({ product_type:'', property_type:'', location:'', openings:[{w:'',h:''}], material:'', colour:'', special_notes:'', motor:'', remote_count:2, access_control:'None', power_supply:'Reliable mains power available', addons:[], warranty:'1 Year (Standard)', customer_name:'', customer_phone:'', customer_email:'', contact_pref:'WhatsApp / Phone call', final_notes:'' }) }}>Start a new quote</button>
        </div>
      </section>
    )
  }

  const progressDot = (n) => ({
    width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: step === n ? 700 : 500,
    background: step === n ? 'var(--mustard)' : step > n ? 'rgba(200,150,12,0.2)' : 'var(--panel)',
    border: step === n ? '1px solid var(--mustard)' : step > n ? '1px solid var(--mustard)' : '1px solid var(--border)',
    color: step === n ? '#0F1109' : step > n ? 'var(--mustard)' : 'var(--muted)',
    zIndex: 1, cursor: step > n ? 'pointer' : 'default', transition: 'all 0.25s',
  })

  return (
    <section id="quote" className="section section-charcoal">
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-tag">Online Quote Builder</div>
          <h2 className="section-title">Build Your Custom Quote</h2>
          <p className="section-sub" style={{ margin: '0 auto', textAlign: 'center' }}>Tell us about your project and we&apos;ll prepare a detailed estimate within 24 hours.</p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, height: 1, background: 'var(--border)' }} />
          {[['Product',1],['Dimensions',2],['Motor',3],['Add-ons',4],['Summary',5]].map(([label, n]) => (
            <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
              <div style={progressDot(n)} onClick={() => step > n && setStep(n)}>{n}</div>
              <div className="prog-label" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: step === n ? 'var(--mustard-light)' : 'var(--muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ animation: 'fadeSlide 0.3s ease' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>What do you need?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>Select the type of product you&apos;re looking for.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {TYPES.map(t => (
                <div key={t.name} onClick={() => set('product_type', t.name)} style={{ background: data.product_type === t.name ? 'rgba(200,150,12,0.08)' : 'var(--panel)', border: `1.5px solid ${data.product_type === t.name ? 'var(--mustard)' : 'var(--border)'}`, borderRadius: 2, padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: '1.8rem' }}>{t.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.hint}</div>
                  {pricingLoaded && livePricing.pricing.find(p => p.product_type === t.name) && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--mustard)', marginTop: 2 }}>
                      From {fmt(livePricing.pricing.find(p => p.product_type === t.name)?.base_price)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {data.product_type && (
              <div style={{ background: 'rgba(92,107,42,0.07)', border: '1px solid rgba(92,107,42,0.2)', borderRadius: 2, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--olive-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Forte Recommendation</div>
                <div style={{ fontSize: '0.9rem' }}>{RECOMMENDATIONS[data.product_type]}</div>
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label style={labelStyle}>Property type</label>
                <select style={inputStyle} value={data.property_type} onChange={e => set('property_type', e.target.value)}>
                  <option value="">Select property type</option>
                  {['Residential home','Shop / retail unit','Office / commercial building','Warehouse / factory','Gated estate / compound','Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Location (city/town)</label>
                <input style={inputStyle} type="text" placeholder="e.g. Nairobi, Thika, Mombasa" value={data.location} onChange={e => set('location', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button className="btn-primary" onClick={next}>Next: Dimensions →</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ animation: 'fadeSlide 0.3s ease' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Opening Dimensions</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>Provide the size of the opening(s) in metres.</p>
            {data.openings.map((o, i) => (
              <div key={i} className="form-row" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={labelStyle}>Opening {i+1} — Width (m)</label>
                  <input style={inputStyle} type="number" step="0.1" min="0.3" placeholder="e.g. 3.0" value={o.w} onChange={e => updateOpening(i,'w',e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Opening {i+1} — Height (m)</label>
                  <input style={inputStyle} type="number" step="0.1" min="0.5" placeholder="e.g. 2.4" value={o.h} onChange={e => updateOpening(i,'h',e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={addOpening} style={{ background:'transparent', border:'1px dashed rgba(200,150,12,0.4)', color:'var(--mustard)', padding:'10px 20px', borderRadius:2, cursor:'pointer', fontFamily:'var(--font-body)', fontSize:'0.85rem', marginBottom:'1.5rem' }}>+ Add another opening</button>
            {pricingLoaded && data.product_type && data.openings.some(o => o.w && o.h) && (
              <div style={{ background: 'rgba(200,150,12,0.06)', border: '1px solid rgba(200,150,12,0.15)', borderRadius: 2, padding: '0.75rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                Materials estimate: <strong style={{ color: 'var(--mustard-light)' }}>{fmt(breakdown?.materials)}</strong>
                <span style={{ color: 'var(--muted)', marginLeft: 8 }}>({data.openings.reduce((s,o)=>s+(parseFloat(o.w)||0)*(parseFloat(o.h)||0),0).toFixed(2)} m²)</span>
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label style={labelStyle}>Material preference</label>
                <select style={inputStyle} value={data.material} onChange={e => set('material', e.target.value)}>
                  {['Let Forte recommend','Galvanised steel (heavy duty)','Powder-coated steel (standard)','Aluminium (lightweight)','Stainless steel (premium)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Colour / finish</label>
                <select style={inputStyle} value={data.colour} onChange={e => set('colour', e.target.value)}>
                  {['Standard (white or grey)','Matte black','Champagne / beige','Custom RAL colour (+cost)','Unpainted / mill finish'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Special requirements</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} placeholder="e.g. sloped floor, overhead obstacles, ventilation needed..." value={data.special_notes} onChange={e => set('special_notes', e.target.value)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button className="btn-outline" onClick={back}>← Back</button>
              <button className="btn-primary" onClick={next}>Next: Motor Options →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={{ animation: 'fadeSlide 0.3s ease' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Operation & Motor Type</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>Choose how your shutter or gate will be operated.</p>
            <div className="motor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {MOTORS.map(m => {
                const motorRow = livePricing.motors.find(r => r.motor_type === m.key)
                return (
                  <div key={m.key} onClick={() => set('motor', m.key)} style={{ background: data.motor === m.key ? 'rgba(200,150,12,0.08)' : 'var(--panel)', border: `1.5px solid ${data.motor === m.key ? 'var(--mustard)' : 'var(--border)'}`, borderRadius: 2, padding: '1.25rem', cursor: 'pointer' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{m.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{m.desc}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <div style={{ background: 'rgba(200,150,12,0.1)', color: 'var(--mustard-light)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.badge}</div>
                      {pricingLoaded && motorRow && <div style={{ fontSize: '0.8rem', color: 'var(--mustard)', fontWeight: 600 }}>{motorRow.price === 0 ? 'Free' : fmt(motorRow.price)}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
            {data.motor && data.motor !== 'Manual (no motor)' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label style={labelStyle}>Remote handsets: {data.remote_count}</label>
                    <input type="range" min="1" max="10" value={data.remote_count} onChange={e => set('remote_count', parseInt(e.target.value))} style={{ accentColor: 'var(--mustard)', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={labelStyle}>Access control</label>
                    <select style={inputStyle} value={data.access_control} onChange={e => set('access_control', e.target.value)}>
                      {['None','Keypad entry','GSM phone dial','Key fob / proximity card','Video intercom','Biometric / fingerprint'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Power supply</label>
                  <select style={inputStyle} value={data.power_supply} onChange={e => set('power_supply', e.target.value)}>
                    {['Reliable mains power available','Frequent load-shedding — need battery backup','Off-grid — need solar option','Not sure — advise me'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button className="btn-outline" onClick={back}>← Back</button>
              <button className="btn-primary" onClick={next}>Next: Add-ons →</button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div style={{ animation: 'fadeSlide 0.3s ease' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Optional Add-Ons & Warranty</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>All selected add-ons are shown in the itemised breakdown.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {ADDON_LIST.map(a => {
                const sel = data.addons.includes(a.name)
                const display = addonDisplay(a.name)
                return (
                  <div key={a.name} onClick={() => toggleAddon(a.name)} style={{ background: sel ? 'rgba(200,150,12,0.06)' : 'var(--panel)', border: `1.5px solid ${sel ? 'var(--mustard)' : 'var(--border)'}`, borderRadius: 2, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer' }}>
                    <div style={{ width: 22, height: 22, border: `1.5px solid ${sel ? 'var(--mustard)' : 'var(--border)'}`, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? 'var(--mustard)' : 'transparent' }}>
                      {sel && <span style={{ fontSize: '0.75rem', color: '#0F1109', fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: 2 }}>{a.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{a.desc}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--mustard-light)', whiteSpace: 'nowrap' }}>{display}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ ...labelStyle, marginBottom: '0.75rem', display: 'block' }}>Warranty Period</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {WARRANTIES.map(w => (
                  <button key={w.value} onClick={() => set('warranty', w.value)} style={{ background: data.warranty === w.value ? 'rgba(200,150,12,0.08)' : 'var(--panel)', border: `1.5px solid ${data.warranty === w.value ? 'var(--mustard)' : 'var(--border)'}`, color: data.warranty === w.value ? 'var(--mustard-light)' : 'var(--muted)', padding: '8px 18px', borderRadius: 100, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>{w.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button className="btn-outline" onClick={back}>← Back</button>
              <button className="btn-primary" onClick={next}>Review Summary →</button>
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div style={{ animation: 'fadeSlide 0.3s ease' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Your Quote Summary</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>Itemised estimate — final quote confirmed after site survey.</p>

            {breakdown && (
              <div style={{ background: 'var(--panel)', border: '1px solid var(--border-gold)', borderRadius: 4, padding: '1.75rem', marginBottom: '2rem' }}>
                {/* Project details */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mustard)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Project Details</div>
                {[['Product', data.product_type], ['Location', data.location], ['Property', data.property_type], ['Operation', data.motor], ...data.openings.map((o,i) => [`Opening ${i+1}`, o.w && o.h ? `${o.w}m × ${o.h}m` : '—'])].filter(([,v])=>v).map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ color: 'var(--muted)' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}

                {/* Cost breakdown */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--mustard)', margin: '1.25rem 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Cost Breakdown</div>
                {[
                  ['Materials & product', breakdown.materials],
                  data.motor && data.motor !== 'Manual (no motor)' ? ['Motor & automation', breakdown.motorCost] : null,
                  breakdown.addonCost > 0 ? ['Add-ons', breakdown.addonCost] : null,
                  breakdown.warrantyCost > 0 ? ['Extended warranty', breakdown.warrantyCost] : null,
                ].filter(Boolean).map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <span style={{ color: 'var(--muted)' }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{fmt(val)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.875rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ color: 'var(--muted)' }}>
                    Labour & installation
                    {breakdown.labourTown && <span style={{ fontSize: '0.75rem', marginLeft: 6, color: 'var(--olive-light)' }}>({breakdown.labourTown} rate ×{breakdown.multiplier} +{fmt(breakdown.flatCharge)})</span>}
                  </span>
                  <span style={{ fontWeight: 500 }}>{fmt(breakdown.labourCost)}</span>
                </div>

                {/* Totals */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: '0.5rem', borderTop: '1px solid rgba(200,150,12,0.2)', fontSize: '0.875rem', color: 'var(--muted)' }}>
                  <span>Subtotal</span><span>{fmt(breakdown.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>
                  <span>Estimated range</span>
                  <span style={{ color: 'var(--mustard-light)' }}>KES {breakdown.lo.toLocaleString()} – {breakdown.hi.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.4rem', textAlign: 'right' }}>*Indicative only. Final quote confirmed after site survey.</div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label style={labelStyle}>Your full name *</label>
                <input style={inputStyle} type="text" placeholder="e.g. Jane Muthoni" value={data.customer_name} onChange={e => set('customer_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Phone number *</label>
                <input style={inputStyle} type="tel" placeholder="e.g. 0712 345 678" value={data.customer_phone} onChange={e => set('customer_phone', e.target.value)} />
              </div>
            </div>
            <div className="form-row" style={{ marginTop: '1.25rem' }}>
              <div className="form-group">
                <label style={labelStyle}>Email address</label>
                <input style={inputStyle} type="email" placeholder="you@email.com" value={data.customer_email} onChange={e => set('customer_email', e.target.value)} />
              </div>
              <div className="form-group">
                <label style={labelStyle}>Preferred contact</label>
                <select style={inputStyle} value={data.contact_pref} onChange={e => set('contact_pref', e.target.value)}>
                  {['WhatsApp / Phone call','Email','Either is fine'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Anything else we should know?</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} placeholder="Urgency, site access, budget range, questions..." value={data.final_notes} onChange={e => set('final_notes', e.target.value)} />
            </div>
            {error && <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 2, fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button className="btn-outline" onClick={back}>← Back</button>
              <button className="btn-primary" style={{ padding: '14px 40px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }} onClick={submit} disabled={loading}>
                {loading ? 'Submitting…' : 'Submit Quote Request ✓'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
