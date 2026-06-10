'use client'
import { useState } from 'react'
import { ForteLogo } from './Nav'

const inputStyle = {
  background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)',
  padding: '11px 14px', borderRadius: 2, fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  outline: 'none', width: '100%',
}
const labelStyle = {
  fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 500,
}

export function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const submit = async () => {
    if (!form.name || !form.message) { alert('Please enter your name and message.'); return }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch { setStatus('error') }
  }

  return (
    <section id="contact" className="section section-steel">
      <div className="section-tag">Get in Touch</div>
      <h2 className="section-title">Contact Forte Shutters</h2>
      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start', marginTop: '3rem' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Thika Headquarters</h3>
          {[
            ['📍', 'Address', 'Thika Town, Kiambu County, Kenya'],
            ['📞', 'Phone / WhatsApp', '+254 700 000 000'],
            ['✉️', 'Email', 'info@forteshutters.co.ke'],
          ].map(([icon, label, val]) => (
            <div key={label} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 2 }}>{icon}</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.95rem' }}>{val}</div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: 2 }}>🕐</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Business Hours</div>
              <div style={{ fontSize: '0.95rem' }}>Mon–Fri 8am–6pm · Sat 9am–4pm</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--mustard-light)', marginTop: 2 }}>24/7 emergency call-out available</div>
            </div>
          </div>
          <a href="https://wa.me/254700000000" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginTop: '1.5rem', background: '#25D366', color: '#000',
            padding: '14px 24px', borderRadius: 2, textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem',
          }}>
            <span style={{ fontSize: '1.2rem' }}>💬</span> Chat on WhatsApp
          </a>
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Send a Message</h3>
          {status === 'success' ? (
            <div style={{ background: 'rgba(92,107,42,0.1)', border: '1px solid rgba(92,107,42,0.3)', borderRadius: 4, padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✅</div>
              <div style={{ fontWeight: 500 }}>Message sent!</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: 4 }}>We&apos;ll be in touch shortly.</div>
              <button onClick={() => setStatus('idle')} className="btn-outline" style={{ marginTop: '1rem', padding: '8px 20px' }}>Send another</button>
            </div>
          ) : (
            <>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-row" style={{ marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} type="tel" placeholder="+254 ..." value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" placeholder="you@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Message *</label>
                <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} placeholder="Tell us about your project..." value={form.message} onChange={e => set('message', e.target.value)} />
              </div>
              {status === 'error' && <div style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>Something went wrong. Please try again.</div>}
              <button className="btn-primary" style={{ width: '100%', opacity: status === 'loading' ? 0.7 : 1 }} onClick={submit} disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send Message →'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{ background: '#080A05', padding: '3rem 5%', borderTop: '2px solid var(--mustard)' }}>
      <div style={{ borderTop: '1px solid var(--olive)', marginBottom: '2rem', opacity: 0.3 }} />
      <div className="footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <ForteLogo size={0.85} />
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'right', lineHeight: 1.8 }}>
          Serving Nairobi · Thika · Mombasa · and beyond<br />
          <span style={{ color: 'var(--mustard)', fontSize: '0.75rem' }}>info@forteshutters.co.ke &nbsp;·&nbsp; +254 700 000 000</span><br />
          © {new Date().getFullYear()} Forte Shutters. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
