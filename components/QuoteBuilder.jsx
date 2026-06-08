'use client'
import { useState } from 'react'

const TYPES = [
  { icon: '🔒', name: 'Security Shutter', hint: 'High-security premises' },
  { icon: '🏪', name: 'Shop Front Shutter', hint: 'Retail & commercial' },
  { icon: '🚗', name: 'Garage Shutter', hint: 'Residential & commercial' },
  { icon: '🏭', name: 'Industrial Shutter', hint: 'Warehouses & factories' },
  { icon: '⚡', name: 'Electric Gate', hint: 'Compounds & estates' },
  { icon: '🪟', name: 'Window Shutter', hint: 'Residential & office' },
]

const RECOMMENDATIONS = {
  'Security Shutter': 'For high-security applications, we recommend galvanised steel slats with anti-pry locking bars and a standard electric motor for ease of use.',
  'Shop Front Shutter': 'For retail premises, we typically recommend a perforated powder-coated steel shutter — allows visibility while closed and suits most commercial frontages.',
  'Garage Shutter': 'For residential garage use, aluminium with a standard tubular motor and 2 remote handsets is our most popular and cost-effective option.',
  'Industrial Shutter': 'Industrial applications require heavy-gauge galvanised steel with a 3-phase motor. We\'ll size the motor correctly based on your opening dimensions.',
  'Electric Gate': 'For estate and compound gates, we recommend a sliding gate operator with GSM access control and battery backup for power-outage resilience.',
  'Window Shutter': 'For windows, powder-coated aluminium with a spring-assisted manual mechanism is the most popular — lightweight, weather-resistant, and very durable.',
}

const MOTORS = [
  { name: 'Manual', desc: 'Traditional pull-strap or hand-crank operation. Zero running costs, reliable, simple to maintain.', badge: 'Budget-friendly', key: 'Manual (no motor)' },
  { name: 'Standard Electric', desc: 'Single-phase tubular motor with remote control handset. Ideal for most residential and commercial applications.', badge: 'Most popular', key: 'Standard Electric Motor' },
  { name: 'Heavy-Duty 3-Phase', desc: '3-phase industrial motor for large shutters, rapid cycling, and high-traffic environments. Built for 24/7 commercial use.', badge: 'Industrial', key: 'Heavy-Duty 3-Phase Motor' },
  { name: 'Smart Motor', desc: 'WiFi-enabled motor with smartphone app, scheduling, usage history, and smart home integration.', badge: 'Premium', key: 'Smart Motor with App Control' },
]

const ADDONS = [
  { name: 'Professional Installation', desc: 'Site survey, certified fitting, full functional test sign-off & clean-up', price: 'Included' },
  { name: 'Annual Maintenance Plan', desc: 'Yearly service visit, lubrication, alignment checks, and priority call-out response', price: 'KES 8,500/yr' },
  { name: 'Powder-Coat Colour Upgrade', desc: 'Custom RAL colour — any colour you choose applied to the shutter slats and housing box', price: 'KES 4,500' },
  { name: 'Battery Backup Unit', desc: 'Auto-engages during power outages. Enough charge for 30+ full open/close cycles', price: 'KES 12,000' },
  { name: 'CCTV / Intercom Integration', desc: 'Connect to existing or new CCTV cameras, video intercom units, or alarm system panels', price: 'From KES 15,000' },
]

const WARRANTIES = [
  { label: '1 Year (Free)', value: '1 Year (Standard)' },
  { label: '2 Years +KES 5,000', value: '2 Years (+KES 5,000)' },
  { label: '3 Years +KES 9,000', value: '3 Years (+KES 9,000)' },
  { label: '5 Years +KES 15,000', value: '5 Years (+KES 15,000)' },
]

function estimateRange(data) {
  let base = 45000
  if (data.product_type === 'Electric Gate') base = 85000
  if (data.product_type === 'Industrial Shutter') base = 95000
  if (data.product_type === 'Security Shutter') base = 55000

  const area = (data.openings || []).reduce((sum, o) => sum + (parseFloat(o.w) || 0) * (parseFloat(o.h) || 0), 0)
  if (area > 0) base += area * 4500

  if (data.motor === 'Smart Motor with App Control') base += 22000
  else if (data.motor === 'Standard Electric Motor') base += 12000
  else if (data.motor === 'Heavy-Duty 3-Phase Motor') base += 30000

  if (data.addons?.includes('Annual Maintenance Plan')) base += 8500
  if (data.addons?.includes('Battery Backup Unit')) base += 12000
  if (data.addons?.includes('Powder-Coat Colour Upgrade')) base += 4500
  if (data.addons?.includes('CCTV / Intercom Integration')) base += 15000

  const lo = Math.round(base / 1000) * 1000
  const hi = Math.round(lo * 1.22 / 1000) * 1000
  return { lo, hi, loStr: lo.toLocaleString(), hiStr: hi.toLocaleString() }
}

const inputStyle = {
  background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)',
  padding: '11px 14px', borderRadius: 4, fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  outline: 'none', width: '100%',
}
const labelStyle = {
  fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500,
}

export default function QuoteBuilder() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    const next = [...data.openings]
    next[i] = { ...next[i], [key]: val }
    set('openings', next)
  }

  const toggleAddon = (name) => {
    set('addons', data.addons.includes(name)
      ? data.addons.filter(a => a !== name)
      : [...data.addons, name]
    )
  }

  const next = () => {
    if (step === 1 && !data.product_type) { alert('Please select a product type.'); return }
    if (step === 3 && !data.motor) { alert('Please select an operation type.'); return }
    setStep(s => s + 1)
    setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }
  const back = () => {
    setStep(s => s - 1)
    setTimeout(() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const submit = async () => {
    if (!data.customer_name || !data.customer_phone) { alert('Please enter your name and phone number.'); return }
    setLoading(true)
    setError('')
    try {
      const est = estimateRange(data)
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, estimated_low: est.lo, estimated_high: est.hi }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submission failed')
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const est = estimateRange(data)

  const progressDot = (n) => {
    const isActive = step === n
    const isDone = step > n
    return {
      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.75rem', fontWeight: isDone ? 500 : isActive ? 700 : 500,
      background: isActive ? 'var(--gold)' : isDone ? 'rgba(212,146,10,0.2)' : 'var(--panel)',
      border: isActive ? '1px solid var(--gold)' : isDone ? '1px solid var(--gold)' : '1px solid var(--border)',
      color: isActive ? '#000' : isDone ? 'var(--gold)' : 'var(--muted)',
      zIndex: 1, cursor: isDone ? 'pointer' : 'default',
      transition: 'all 0.25s',
    }
  }

  if (submitted) {
    return (
      <section id="quote" className="section section-charcoal">
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--panel)', border: '1px solid var(--border-gold)', borderRadius: 8 }}>
            <div style={{ width: 70, height: 70, background: 'rgba(212,146,10,0.12)', border: '1px solid rgba(212,146,10,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Quote Request Received!</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: 400, margin: '0.75rem auto 0' }}>
              Thank you — a Forte Shutters specialist will contact you within <strong style={{ color: 'var(--text)' }}>24 hours</strong> with a detailed, itemised quote tailored to your project.
            </p>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
              For urgent enquiries call or WhatsApp:{' '}
              <a href="tel:+254700000000" style={{ color: 'var(--gold-light)', textDecoration: 'none' }}>+254 700 000 000</a>
            </p>
            <button className="btn-outline" style={{ marginTop: '2rem' }} onClick={() => { setSubmitted(false); setStep(1); setData({ product_type: '', property_type: '', location: '', openings: [{ w: '', h: '' }], material: '', colour: '', special_notes: '', motor: '', remote_count: 2, access_control: 'None', power_supply: 'Reliable mains power available', addons: [], warranty: '1 Year (Standard)', customer_name: '', customer_phone: '', customer_email: '', contact_pref: 'WhatsApp / Phone call', final_notes: '' }) }}>
              Start a new quote
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="quote" className="section section-charcoal">
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-tag">Online Quote Builder</div>
          <h2 className="section-title">Build Your Custom Quote</h2>
          <p className="section-sub" style={{ margin: '0 auto', textAlign: 'center' }}>
            Tell us about your project and we&apos;ll prepare a detailed estimate within 24 hours.
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: 16, right: 16, height: 1, background: 'var(--border)' }} />
          {[['Product', 1], ['Dimensions', 2], ['Motor', 3], ['Add-ons', 4], ['Summary', 5]].map(([label, n]) => (
            <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
              <div style={progressDot(n)} onClick={() => step > n && setStep(n)}>{n}</div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: step === n ? 'var(--gold-light)' : 'var(--muted)' }}>{label}</div>
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
                <div
                  key={t.name}
                  onClick={() => set('product_type', t.name)}
                  style={{
                    background: 'var(--panel)', border: `1.5px solid ${data.product_type === t.name ? 'var(--gold)' : 'var(--border)'}`,
                    background: data.product_type === t.name ? 'rgba(212,146,10,0.08)' : 'var(--panel)',
                    borderRadius: 6, padding: '1.25rem', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
                  }}
                >
                  <div style={{ fontSize: '1.8rem' }}>{t.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{t.hint}</div>
                </div>
              ))}
            </div>
            {data.product_type && RECOMMENDATIONS[data.product_type] && (
              <div style={{ background: 'rgba(212,146,10,0.07)', border: '1px solid rgba(212,146,10,0.2)', borderRadius: 6, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Forte Recommendation</div>
                <div style={{ fontSize: '0.9rem' }}>{RECOMMENDATIONS[data.product_type]}</div>
              </div>
            )}
            <div className="form-row">
              <div className="form-group">
                <label style={labelStyle}>Property type</label>
                <select style={inputStyle} value={data.property_type} onChange={e => set('property_type', e.target.value)}>
                  <option value="">Select property type</option>
                  {['Residential home', 'Shop / retail unit', 'Office / commercial building', 'Warehouse / factory', 'Gated estate / compound', 'Other'].map(o => <option key={o}>{o}</option>)}
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
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>Provide the size of the opening(s) in metres. Add multiple openings if needed.</p>
            {data.openings.map((o, i) => (
              <div key={i} className="form-row" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={labelStyle}>Opening {i + 1} — Width (m)</label>
                  <input style={inputStyle} type="number" step="0.1" min="0.3" placeholder="e.g. 3.0" value={o.w} onChange={e => updateOpening(i, 'w', e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Opening {i + 1} — Height (m)</label>
                  <input style={inputStyle} type="number" step="0.1" min="0.5" placeholder="e.g. 2.4" value={o.h} onChange={e => updateOpening(i, 'h', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={addOpening} style={{ background: 'transparent', border: '1px dashed rgba(212,146,10,0.4)', color: 'var(--gold)', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              + Add another opening
            </button>
            <div className="form-row">
              <div className="form-group">
                <label style={labelStyle}>Material preference</label>
                <select style={inputStyle} value={data.material} onChange={e => set('material', e.target.value)}>
                  {['Let Forte recommend', 'Galvanised steel (heavy duty)', 'Powder-coated steel (standard)', 'Aluminium (lightweight)', 'Stainless steel (premium)'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={labelStyle}>Colour / finish</label>
                <select style={inputStyle} value={data.colour} onChange={e => set('colour', e.target.value)}>
                  {['Standard (white or grey)', 'Matte black', 'Champagne / beige', 'Custom RAL colour (+cost)', 'Unpainted / mill finish'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Special requirements or notes</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} placeholder="e.g. sloped floor, overhead obstacles, need ventilation..." value={data.special_notes} onChange={e => set('special_notes', e.target.value)} />
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {MOTORS.map(m => (
                <div key={m.key} onClick={() => set('motor', m.key)} style={{
                  background: data.motor === m.key ? 'rgba(212,146,10,0.08)' : 'var(--panel)',
                  border: `1.5px solid ${data.motor === m.key ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: 6, padding: '1.25rem', cursor: 'pointer',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{m.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>{m.desc}</div>
                  <div style={{ display: 'inline-block', marginTop: 8, background: 'rgba(212,146,10,0.1)', color: 'var(--gold-light)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.badge}</div>
                </div>
              ))}
            </div>
            {data.motor && data.motor !== 'Manual (no motor)' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label style={labelStyle}>Remote handsets needed: {data.remote_count}</label>
                    <input type="range" min="1" max="10" value={data.remote_count} onChange={e => set('remote_count', parseInt(e.target.value))} style={{ accentColor: 'var(--gold)', width: '100%' }} />
                  </div>
                  <div className="form-group">
                    <label style={labelStyle}>Access control add-on</label>
                    <select style={inputStyle} value={data.access_control} onChange={e => set('access_control', e.target.value)}>
                      {['None', 'Keypad entry', 'GSM phone dial', 'Key fob / proximity card', 'Video intercom', 'Biometric / fingerprint'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Power supply situation</label>
                  <select style={inputStyle} value={data.power_supply} onChange={e => set('power_supply', e.target.value)}>
                    {['Reliable mains power available', 'Frequent load-shedding — need battery backup', 'Off-grid — need solar option', 'Not sure — advise me'].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <div className="form-hint">Solar and battery backup options available at extra cost</div>
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
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>Enhance your installation with these optional services.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {ADDONS.map(a => {
                const sel = data.addons.includes(a.name)
                return (
                  <div key={a.name} onClick={() => toggleAddon(a.name)} style={{
                    background: sel ? 'rgba(212,146,10,0.06)' : 'var(--panel)',
                    border: `1.5px solid ${sel ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius: 6, padding: '1.25rem 1.5rem',
                    display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer',
                  }}>
                    <div style={{ width: 22, height: 22, border: `1.5px solid ${sel ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 4, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? 'var(--gold)' : 'transparent' }}>
                      {sel && <span style={{ fontSize: '0.75rem', color: '#000', fontWeight: 700 }}>✓</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: 2 }}>{a.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{a.desc}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)', whiteSpace: 'nowrap' }}>{a.price}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ ...labelStyle, marginBottom: '0.75rem', display: 'block' }}>Warranty Period</div>
              <div className="form-hint" style={{ marginBottom: '0.75rem' }}>All products include a standard 1-year parts & labour warranty. Extend for greater peace of mind.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {WARRANTIES.map(w => (
                  <button key={w.value} onClick={() => set('warranty', w.value)} style={{
                    background: data.warranty === w.value ? 'rgba(212,146,10,0.08)' : 'var(--panel)',
                    border: `1.5px solid ${data.warranty === w.value ? 'var(--gold)' : 'var(--border)'}`,
                    color: data.warranty === w.value ? 'var(--gold-light)' : 'var(--muted)',
                    padding: '8px 18px', borderRadius: 100, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}>{w.label}</button>
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
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '2rem' }}>Review your selections. We&apos;ll prepare a full itemised quote within 24 hours.</p>
            <div style={{ background: 'var(--panel)', border: '1px solid var(--border-gold)', borderRadius: 8, padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>Project Overview</div>
              {[
                ['Product type', data.product_type],
                ['Property type', data.property_type],
                ['Location', data.location],
                ...data.openings.map((o, i) => [`Opening ${i + 1}`, o.w && o.h ? `${o.w}m × ${o.h}m (${(parseFloat(o.w) * parseFloat(o.h)).toFixed(2)} m²)` : '—']),
                ['Material', data.material],
                ['Colour', data.colour],
                ['Operation', data.motor],
                ['Access control', data.access_control !== 'None' ? data.access_control : null],
                ['Add-ons', data.addons.length ? data.addons.join(', ') : null],
                ['Warranty', data.warranty],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--muted)' }}>{k}</span>
                  <span style={{ fontWeight: 500, maxWidth: '55%', textAlign: 'right' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', marginTop: '0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
                <span>Estimated range</span>
                <span style={{ color: 'var(--gold-light)' }}>KES {est.loStr} – {est.hiStr}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.5rem', textAlign: 'right' }}>*Final quote issued after site survey. Price may vary.</div>
            </div>
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
                <label style={labelStyle}>Preferred contact method</label>
                <select style={inputStyle} value={data.contact_pref} onChange={e => set('contact_pref', e.target.value)}>
                  {['WhatsApp / Phone call', 'Email', 'Either is fine'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Anything else we should know?</label>
              <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} placeholder="e.g. urgency, site access details, budget range, questions..." value={data.final_notes} onChange={e => set('final_notes', e.target.value)} />
            </div>
            {error && <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: '#f87171', padding: '0.75rem 1rem', borderRadius: 4, fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</div>}
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
