'use client'
export default function Hero() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '120px 5% 80px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(212,146,10,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,146,10,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(17,18,20,0.9) 80%)',
      }} />

      <div style={{ position: 'relative', maxWidth: 680 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(212,146,10,0.12)', border: '1px solid rgba(212,146,10,0.3)',
          color: 'var(--gold-light)', fontSize: '0.75rem', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '6px 14px', borderRadius: 2, marginBottom: '2rem',
        }}>
          <span style={{ width: 6, height: 6, background: 'var(--gold-light)', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          Kenya&apos;s Trusted Shutter Specialists
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.0,
          textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '1.5rem',
        }}>
          Strength<br />You Can <span style={{ color: 'var(--gold-light)' }}>Trust.</span><br />Security You Feel.
        </h1>

        <p style={{ fontSize: '1.1rem', fontWeight: 300, color: 'var(--muted)', maxWidth: 480, marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Premium roller shutters, electric gates, and security solutions for homes, businesses, and industrial properties across Kenya.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => scrollTo('quote')}>Build Your Quote</button>
          <button className="btn-outline" onClick={() => scrollTo('products')}>View Products</button>
        </div>

        <div style={{
          display: 'flex', gap: '3rem', marginTop: '4rem',
          paddingTop: '2rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap',
        }}>
          {[['500+','Installations'],['10+','Years Experience'],['3','Major Cities'],['24/7','Emergency Support']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--gold-light)', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
