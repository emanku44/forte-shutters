'use client'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: 70,
        background: scrolled ? 'rgba(17,18,20,0.97)' : 'rgba(17,18,20,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'background 0.3s',
      }}>
        <a
          href="#hero"
          onClick={e => { e.preventDefault(); scrollTo('hero') }}
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.04em', color: '#fff', textDecoration: 'none' }}
        >
          FORTE<span style={{ color: 'var(--gold-light)' }}>.</span>
        </a>

        {/* Desktop links */}
        <ul className="nav-desktop" style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          {[['products', 'Products'], ['why', 'Why Us'], ['areas', 'Coverage'], ['contact', 'Contact']].map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={e => { e.preventDefault(); scrollTo(id) }}
                style={{ color: 'var(--muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <button
          className="btn-primary nav-desktop"
          style={{ padding: '10px 22px', fontSize: '0.875rem' }}
          onClick={() => scrollTo('quote')}
        >
          Get a Quote
        </button>

        {/* Mobile hamburger */}
        <button
          className="nav-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
          aria-label="Toggle menu"
        >
          <span style={{ width: 22, height: 2, background: menuOpen ? 'var(--gold-light)' : 'var(--text)', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: menuOpen ? 'var(--gold-light)' : 'var(--text)', display: 'block', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 22, height: 2, background: menuOpen ? 'var(--gold-light)' : 'var(--text)', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="nav-mobile" style={{
          position: 'fixed', top: 70, left: 0, right: 0, zIndex: 99,
          background: 'rgba(17,18,20,0.98)', borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '1.5rem 5%', display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          {[['products', 'Products'], ['why', 'Why Us'], ['areas', 'Coverage'], ['contact', 'Contact']].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={e => { e.preventDefault(); scrollTo(id) }}
              style={{ color: 'var(--text)', fontSize: '1.1rem', textDecoration: 'none', fontWeight: 400 }}
            >
              {label}
            </a>
          ))}
          <button
            className="btn-primary"
            style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}
            onClick={() => scrollTo('quote')}
          >
            Get a Quote
          </button>
        </div>
      )}
    </>
  )
}
