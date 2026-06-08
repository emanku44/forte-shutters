'use client'

const WHY = [
  { n: '01', title: 'Quality Materials', desc: 'We source only certified galvanised steel, marine-grade aluminium, and premium components. Every shutter leaves our workshop ready for Kenya\'s climate.' },
  { n: '02', title: 'Expert Installation', desc: 'Our certified technicians complete every installation to specification. Clean finishes, precise alignment, and a full functional test before we leave your site.' },
  { n: '03', title: 'After-Sales Support', desc: 'Breakdowns don\'t wait for business hours. Our rapid-response team covers Nairobi, Thika, Mombasa, and surrounding areas — even on weekends.' },
  { n: '04', title: 'Transparent Pricing', desc: 'No hidden charges. Use our online quote builder to get a clear, itemised estimate before we even step onto your property.' },
]

export function WhyUs() {
  return (
    <section id="why" className="section section-charcoal">
      <div className="section-tag">Why Choose Forte</div>
      <h2 className="section-title">The Forte Difference</h2>
      <p className="section-sub">We don&apos;t just install shutters. We deliver peace of mind backed by workmanship you can see and warranties you can rely on.</p>
      <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', marginTop: '4rem' }}>
        {WHY.map(w => (
          <div key={w.n} style={{ background: 'var(--charcoal)', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, color: 'rgba(212,146,10,0.15)', lineHeight: 1, marginBottom: '0.5rem' }}>{w.n}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{w.title}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{w.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

const AREAS = ['Thika (HQ)', 'Nairobi CBD', 'Westlands', 'Karen', 'Mombasa', 'Kiambu', 'Ruiru', 'Juja', 'Machakos', 'Nakuru', 'Muranga', 'Nyeri']

export function Areas() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section id="areas" className="section section-steel">
      <div className="areas-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <div className="section-tag">Service Coverage</div>
          <h2 className="section-title">Where We Work</h2>
          <p className="section-sub">Based in Thika, we serve a wide belt across Kenya — wherever quality security matters.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: '2rem' }}>
            {AREAS.map(a => (
              <div key={a} style={{
                background: 'var(--panel)', border: '1px solid var(--border)', color: 'var(--text)',
                fontSize: '0.875rem', padding: '8px 18px', borderRadius: 100,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ width: 6, height: 6, background: 'var(--gold)', borderRadius: '50%', flexShrink: 0 }} />
                {a}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', fontWeight: 800, color: 'rgba(212,146,10,0.2)', lineHeight: 1 }}>KE</div>
          <div style={{ fontSize: '1rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            Serving Kenya from<br />
            <strong style={{ color: 'var(--gold-light)' }}>Thika to the Coast</strong>
          </div>
          <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Can&apos;t find your area listed?<br />
            <button onClick={() => scrollTo('contact')} style={{ color: 'var(--gold-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>
              Call us — we may still cover you →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
