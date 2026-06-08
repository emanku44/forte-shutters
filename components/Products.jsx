'use client'
import { SecurityShutterSVG, ShopFrontSVG, GarageSVG, IndustrialSVG, ElectricGateSVG, WindowShutterSVG } from './ShutterGraphics'

const PRODUCTS = [
  {
    Graphic: SecurityShutterSVG,
    name: 'Security Shutters',
    desc: 'Heavy-duty roller shutters engineered for maximum intruder resistance. Ideal for banks, warehouses, and high-value premises.',
    features: ['Galvanised or powder-coated steel', 'Anti-lift & anti-pry reinforcements', 'Manual or electric operation', 'Insurance-grade protection'],
  },
  {
    Graphic: ShopFrontSVG,
    name: 'Shop Front Shutters',
    desc: 'Clean, commercial-grade shutters that project a professional image while securing your retail space overnight.',
    features: ['Perforated or solid slat options', 'Visible branding space available', 'Quick-release emergency exit', 'Custom colour finishes'],
  },
  {
    Graphic: GarageSVG,
    name: 'Garage Shutters',
    desc: 'Space-saving roller garage doors for residential and commercial properties. Smooth, quiet, and built for daily use.',
    features: ['Aluminium & steel construction', 'Remote control & smartphone options', 'Insulated slats available', 'Auto-stop safety sensors'],
  },
  {
    Graphic: IndustrialSVG,
    name: 'Industrial Shutters',
    desc: 'Oversized, high-cycle shutters for factories, warehouses, and loading docks. Built to handle heavy commercial traffic.',
    features: ['High-speed variants available', 'Wind-rated & weatherproof', '3-phase motor options', 'Regulatory-compliant safety edges'],
  },
  {
    Graphic: ElectricGateSVG,
    name: 'Electric Gates',
    desc: 'Sliding, swing, and bi-fold automated gates for estates, offices, and residential compounds. Elegance meets access control.',
    features: ['Sliding / swing / cantilever types', 'GSM, remote & intercom control', 'Solar-powered backup available', 'CCTV & intercom integration'],
  },
  {
    Graphic: WindowShutterSVG,
    name: 'Window Shutters',
    desc: 'Roller and fixed-bar window security solutions for apartments, offices, and retail spaces — discreet and effective.',
    features: ['Internal & external fitting', 'Powder-coat colour matching', 'Spring-assisted manual operation', 'Louvred ventilation options'],
  },
]

export default function Products() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="products" className="section section-steel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div className="section-tag">What We Offer</div>
          <h2 className="section-title">Our Product Range</h2>
          <p className="section-sub">Purpose-built solutions for every security need — from shop fronts in Nairobi to garage doors in Thika.</p>
        </div>
        <button className="btn-primary" onClick={() => scrollTo('quote')}>Request Quote →</button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5px', background: 'var(--border)', border: '1px solid var(--border)',
      }}>
        {PRODUCTS.map((p) => (
          <div
            key={p.name}
            style={{ background: 'var(--panel)', padding: '0', cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#2A2F37'
              e.currentTarget.querySelector('.top-bar').style.transform = 'scaleX(1)'
              e.currentTarget.querySelector('.graphic-wrap').style.opacity = '1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--panel)'
              e.currentTarget.querySelector('.top-bar').style.transform = 'scaleX(0)'
              e.currentTarget.querySelector('.graphic-wrap').style.opacity = '0.7'
            }}
          >
            {/* Gold top bar */}
            <div className="top-bar" style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'var(--gold)', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform 0.3s', zIndex: 2,
            }} />

            {/* SVG Graphic */}
            <div className="graphic-wrap" style={{
              height: 160, padding: '1rem 1.5rem 0',
              opacity: 0.7, transition: 'opacity 0.3s',
              background: 'linear-gradient(180deg, #161920 0%, var(--panel) 100%)',
            }}>
              <p.Graphic />
            </div>

            {/* Gold divider line */}
            <div style={{ height: 1, background: 'rgba(212,146,10,0.2)', margin: '0 1.5rem' }} />

            {/* Content */}
            <div style={{ padding: '1.5rem 2rem 2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.6rem' }}>{p.name}</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{p.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                {p.features.map(f => (
                  <div key={f} style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 4, background: 'var(--gold)', borderRadius: '50%', flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => scrollTo('quote')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', marginTop: '1.5rem', padding: 0, fontFamily: 'var(--font-body)' }}
              >
                Get a quote →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
