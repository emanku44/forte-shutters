'use client'
export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '120px 5% 80px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(92,107,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(92,107,42,0.06) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 65% 50%, transparent 25%, rgba(15,17,9,0.92) 75%)',
      }} />
      {/* Olive accent bar left */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(180deg, var(--mustard) 0%, var(--olive) 100%)', opacity: 0.8 }} />

      <div style={{ position: 'relative', maxWidth: 680, width: '100%' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(92,107,42,0.12)', border: '1px solid rgba(92,107,42,0.35)',
          color: 'var(--olive-light)', fontSize: '0.75rem', fontWeight: 600,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '6px 14px', borderRadius: 2, marginBottom: '2rem',
        }}>
          <span style={{ width: 6, height: 6, background: 'var(--olive-light)', borderRadius: '50%', animation: 'pulse 2s infinite', flexShrink: 0 }} />
          Kenya&apos;s Trusted Shutter Specialists
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(2.8rem, 10vw, 5.5rem)', lineHeight: 1.0,
          textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '1.5rem',
        }}>
          Strength<br />You Can <span style={{ color: 'var(--mustard-light)' }}>Trust.</span><br />
          <span style={{ color: 'var(--olive-light)', fontSize: '0.85em' }}>Security</span> You Feel.
        </h1>

        <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', fontWeight: 300, color: 'var(--muted)', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Premium roller shutters, electric gates, and security solutions for homes, businesses, and industrial properties across Kenya.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => scrollTo('quote')} style={{ flex: '1 1 auto', textAlign: 'center' }}>Build Your Quote</button>
          <button className="btn-outline" onClick={() => scrollTo('products')} style={{ flex: '1 1 auto', textAlign: 'center' }}>View Products</button>
        </div>

        <div className="hero-stats" style={{
          display: 'flex', gap: '2rem', marginTop: '4rem', flexWrap: 'wrap',
          paddingTop: '2rem', borderTop: '1px solid rgba(92,107,42,0.25)',
        }}>
          {[['500+','Installations'],['10+','Years Experience'],['3','Major Cities'],['24/7','Emergency Support']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', fontWeight: 700, color: 'var(--mustard-light)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
