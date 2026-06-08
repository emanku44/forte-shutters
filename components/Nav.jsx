'use client'
import { useState, useEffect } from 'react'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
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

      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
        {[['products', 'Products'], ['why', 'Why Us'], ['areas', 'Coverage'], ['contact', 'Contact']].map(([id, label]) => (
          <li key={id} style={{ display: 'none', display: 'flex' }}>
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

      <button
        className="btn-primary"
        style={{ padding: '10px 22px', fontSize: '0.875rem' }}
        onClick={() => scrollTo('quote')}
      >
        Get a Quote
      </button>
    </nav>
  )
}
