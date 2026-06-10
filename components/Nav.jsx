'use client'
import { useState, useEffect } from 'react'

function ForteLogo({ size = 1 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, userSelect: 'none' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: `${2.2 * size}rem`,
        fontWeight: 800,
        letterSpacing: '0.12em',
        color: '#EEE8D8',
        lineHeight: 1,
        textTransform: 'uppercase',
      }}>
        FORTE
      </div>
      <div style={{ position: 'relative', marginTop: `${0.1 * size}rem` }}>
        {/* Double rule like the logo */}
        <div style={{ height: `${2 * size}px`, background: 'var(--mustard)', marginBottom: `${1 * size}px` }} />
        <div style={{ height: `${1 * size}px`, background: 'var(--olive)', marginBottom: `${3 * size}px` }} />
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: `${0.65 * size}rem`,
          fontWeight: 400,
          letterSpacing: '0.35em',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          SHUTTERS
        </div>
      </div>
    </div>
  )
}

export { ForteLogo }

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
        padding: '0 5%', height: 74,
        background: scrolled ? 'rgba(15,17,9,0.98)' : 'rgba(15,17,9,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(92,107,42,0.25)',
        transition: 'background 0.3s',
      }}>
        <a href="#hero" onClick={e => { e.preventDefault(); scrollTo('hero') }} style={{ textDecoration: 'none' }}>
          <ForteLogo size={0.75} />
        </a>

        {/* Desktop links */}
        <ul className="nav-desktop" style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
          {[['products', 'Products'], ['why', 'Why Us'], ['areas', 'Coverage'], ['contact', 'Contact']].map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={e => { e.preventDefault(); scrollTo(id) }}
                style={{ color: 'var(--muted)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.03em' }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button className="btn-primary nav-desktop" style={{ padding: '10px 22px', fontSize: '0.875rem' }} onClick={() => scrollTo('quote')}>
          Get a Quote
        </button>

        {/* Hamburger */}
        <button
          className="nav-mobile"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
        >
          <span style={{ width: 22, height: 2, background: menuOpen ? 'var(--mustard)' : 'var(--text)', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ width: 22, height: 2, background: menuOpen ? 'var(--mustard)' : 'var(--text)', display: 'block', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 22, height: 2, background: menuOpen ? 'var(--mustard)' : 'var(--text)', display: 'block', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile" style={{
          position: 'fixed', top: 74, left: 0, right: 0, zIndex: 99,
          background: 'rgba(15,17,9,0.99)', borderBottom: '1px solid rgba(92,107,42,0.2)',
          padding: '1.5rem 5%', display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          {[['products', 'Products'], ['why', 'Why Us'], ['areas', 'Coverage'], ['contact', 'Contact']].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}
              style={{ color: 'var(--text)', fontSize: '1.1rem', textDecoration: 'none' }}>
              {label}
            </a>
          ))}
          <button className="btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => scrollTo('quote')}>
            Get a Quote
          </button>
        </div>
      )}
    </>
  )
}
