// SVG illustrations for each shutter/gate type

export function SecurityShutterSVG() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Wall frame */}
      <rect x="10" y="10" width="180" height="125" rx="2" fill="none" stroke="#3A3F48" strokeWidth="2"/>
      {/* Shutter slats - closed */}
      {[18,28,38,48,58,68,78,88,98,108,118].map((y, i) => (
        <g key={i}>
          <rect x="14" y={y} width="172" height="8" rx="1" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
          <rect x="14" y={y+7} width="172" height="2" rx="0" fill="#1C2028"/>
        </g>
      ))}
      {/* Lock mechanism */}
      <rect x="88" y="60" width="24" height="16" rx="2" fill="var(--mustard)" opacity="0.9"/>
      <rect x="93" y="55" width="14" height="8" rx="7" fill="none" stroke="var(--mustard)" strokeWidth="2"/>
      <circle cx="100" cy="68" r="2" fill="#111214"/>
      {/* Guide rails */}
      <rect x="10" y="10" width="6" height="125" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      <rect x="184" y="10" width="6" height="125" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      {/* Top box */}
      <rect x="10" y="10" width="180" height="12" rx="2" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      {/* Gold accent line */}
      <rect x="10" y="10" width="180" height="2" rx="1" fill="var(--mustard)" opacity="0.8"/>
    </svg>
  )
}

export function ShopFrontSVG() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Building facade */}
      <rect x="5" y="5" width="190" height="130" rx="2" fill="none" stroke="#3A3F48" strokeWidth="1.5"/>
      {/* Fascia board */}
      <rect x="5" y="5" width="190" height="25" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      <text x="100" y="22" textAnchor="middle" fill="var(--mustard)" fontSize="9" fontFamily="sans-serif" letterSpacing="2" fontWeight="bold">FORTE SHOP</text>
      {/* Perforated shutter - half open */}
      {[32,42,52,62,72,82].map((y, i) => (
        <g key={i}>
          <rect x="10" y={y} width="180" height="7" rx="1" fill="#23272E" stroke="#3D4450" strokeWidth="0.5"/>
          {/* Perforations */}
          {[20,35,50,65,80,95,110,125,140,155,170].map((x, j) => (
            <rect key={j} x={x} y={y+2} width="6" height="3" rx="1" fill="#111214" opacity="0.7"/>
          ))}
        </g>
      ))}
      {/* Open section showing shop interior */}
      <rect x="10" y="95" width="180" height="35" fill="#161920"/>
      <rect x="20" y="100" width="60" height="25" rx="1" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      <rect x="90" y="100" width="40" height="25" rx="1" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      <rect x="140" y="100" width="40" height="25" rx="1" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      {/* Roller box */}
      <rect x="10" y="30" width="180" height="6" fill="#161920" stroke="#3A3F48" strokeWidth="0.5"/>
      {/* Gold line */}
      <rect x="5" y="5" width="190" height="2" fill="var(--mustard)" opacity="0.8"/>
    </svg>
  )
}

export function GarageSVG() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* House outline */}
      <polygon points="100,8 185,55 185,132 15,132 15,55" fill="none" stroke="#3A3F48" strokeWidth="1.5"/>
      {/* Roof fill */}
      <polygon points="100,8 185,55 15,55" fill="#161920"/>
      {/* Wall */}
      <rect x="15" y="55" width="170" height="77" fill="#1C2028"/>
      {/* Garage door frame */}
      <rect x="35" y="72" width="130" height="55" rx="2" fill="#111214" stroke="#3A3F48" strokeWidth="1"/>
      {/* Horizontal panels */}
      {[72, 85, 98, 111, 124].map((y, i) => (
        <g key={i}>
          <rect x="37" y={y} width="126" height="11" rx="1" fill="#23272E" stroke="#2A2F37" strokeWidth="0.5"/>
          {/* Panel indents */}
          <rect x="42" y={y+2} width="52" height="7" rx="1" fill="#1C2028" stroke="#3D4450" strokeWidth="0.5"/>
          <rect x="106" y={y+2} width="52" height="7" rx="1" fill="#1C2028" stroke="#3D4450" strokeWidth="0.5"/>
        </g>
      ))}
      {/* Motor unit on ceiling */}
      <rect x="85" y="62" width="30" height="8" rx="2" fill="var(--mustard)" opacity="0.7"/>
      <line x1="100" y1="70" x2="100" y2="72" stroke="var(--mustard)" strokeWidth="1.5"/>
      {/* Remote signal */}
      <path d="M 160 78 Q 165 74 170 78" fill="none" stroke="var(--mustard)" strokeWidth="1.5" opacity="0.6"/>
      <path d="M 158 74 Q 165 68 172 74" fill="none" stroke="var(--mustard)" strokeWidth="1" opacity="0.4"/>
      {/* Guide rails */}
      <line x1="35" y1="72" x2="35" y2="127" stroke="#3D4450" strokeWidth="2"/>
      <line x1="165" y1="72" x2="165" y2="127" stroke="#3D4450" strokeWidth="2"/>
      {/* Gold accent */}
      <line x1="35" y1="72" x2="165" y2="72" stroke="var(--mustard)" strokeWidth="1.5" opacity="0.8"/>
    </svg>
  )
}

export function IndustrialSVG() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Large warehouse opening */}
      <rect x="5" y="8" width="190" height="127" rx="2" fill="none" stroke="#3A3F48" strokeWidth="2"/>
      {/* Heavy slats */}
      {[16,29,42,55,68,81,94,107,120].map((y, i) => (
        <g key={i}>
          <rect x="8" y={y} width="184" height="11" rx="1" fill="#23272E" stroke="#3D4450" strokeWidth="0.8"/>
          {/* Ribbing detail */}
          <rect x="8" y={y+9} width="184" height="2.5" fill="#1C2028"/>
          {[30, 70, 110, 150].map((x, j) => (
            <rect key={j} x={x} y={y+2} width="3" height="7" rx="1" fill="#3D4450"/>
          ))}
        </g>
      ))}
      {/* Heavy duty guide rails */}
      <rect x="5" y="8" width="10" height="127" fill="#1C2028" stroke="#3A3F48" strokeWidth="1"/>
      <rect x="185" y="8" width="10" height="127" fill="#1C2028" stroke="#3A3F48" strokeWidth="1"/>
      {/* Rail bolts */}
      {[25, 55, 85, 115].map((y, i) => (
        <g key={i}>
          <circle cx="10" cy={y} r="2.5" fill="#3D4450" stroke="var(--mustard)" strokeWidth="0.5"/>
          <circle cx="190" cy={y} r="2.5" fill="#3D4450" stroke="var(--mustard)" strokeWidth="0.5"/>
        </g>
      ))}
      {/* Motor housing - large industrial */}
      <rect x="70" y="8" width="60" height="14" rx="2" fill="#1C2028" stroke="var(--mustard)" strokeWidth="1" opacity="0.9"/>
      <rect x="95" y="11" width="10" height="8" rx="1" fill="var(--mustard)" opacity="0.6"/>
      <text x="100" y="19" textAnchor="middle" fill="var(--mustard)" fontSize="5" fontFamily="sans-serif" opacity="0.9">3-PHASE</text>
      {/* Gold top accent */}
      <rect x="5" y="8" width="190" height="3" fill="var(--mustard)" opacity="0.7"/>
    </svg>
  )
}

export function ElectricGateSVG() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Ground */}
      <line x1="0" y1="128" x2="200" y2="128" stroke="#3A3F48" strokeWidth="1.5"/>
      {/* Left pillar */}
      <rect x="8" y="30" width="22" height="98" rx="2" fill="#1C2028" stroke="#3A3F48" strokeWidth="1"/>
      <rect x="6" y="28" width="26" height="8" rx="1" fill="#23272E" stroke="#3A3F48" strokeWidth="0.5"/>
      <rect x="6" y="22" width="26" height="8" rx="1" fill="var(--mustard)" opacity="0.7"/>
      {/* Right pillar */}
      <rect x="170" y="30" width="22" height="98" rx="2" fill="#1C2028" stroke="#3A3F48" strokeWidth="1"/>
      <rect x="168" y="28" width="26" height="8" rx="1" fill="#23272E" stroke="#3A3F48" strokeWidth="0.5"/>
      <rect x="168" y="22" width="26" height="8" rx="1" fill="var(--mustard)" opacity="0.7"/>
      {/* Left gate panel - sliding open slightly */}
      <rect x="30" y="38" width="65" height="82" rx="1" fill="#23272E" stroke="#3D4450" strokeWidth="0.8"/>
      {/* Gate vertical bars */}
      {[38, 50, 62, 74, 83].map((x, i) => (
        <rect key={i} x={x} y="42" width="4" height="74" rx="2" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      ))}
      {/* Gate horizontal rails */}
      <rect x="30" y="46" width="65" height="5" rx="1" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      <rect x="30" y="76" width="65" height="5" rx="1" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      <rect x="30" y="106" width="65" height="5" rx="1" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      {/* Right gate panel */}
      <rect x="105" y="38" width="65" height="82" rx="1" fill="#23272E" stroke="#3D4450" strokeWidth="0.8"/>
      {[113, 125, 137, 149, 158].map((x, i) => (
        <rect key={i} x={x} y="42" width="4" height="74" rx="2" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      ))}
      <rect x="105" y="46" width="65" height="5" rx="1" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      <rect x="105" y="76" width="65" height="5" rx="1" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      <rect x="105" y="106" width="65" height="5" rx="1" fill="#2A2F37" stroke="#3D4450" strokeWidth="0.5"/>
      {/* Motor box on left pillar */}
      <rect x="10" y="85" width="18" height="22" rx="2" fill="#161920" stroke="var(--mustard)" strokeWidth="0.8"/>
      <circle cx="19" cy="96" r="4" fill="none" stroke="var(--mustard)" strokeWidth="1"/>
      <circle cx="19" cy="96" r="1.5" fill="var(--mustard)"/>
      {/* Signal waves */}
      <path d="M 175 60 Q 182 55 175 50" fill="none" stroke="var(--mustard)" strokeWidth="1.5" opacity="0.8"/>
      <path d="M 177 63 Q 187 55 177 47" fill="none" stroke="var(--mustard)" strokeWidth="1" opacity="0.5"/>
      <circle cx="174" cy="56" r="2" fill="var(--mustard)" opacity="0.9"/>
    </svg>
  )
}

export function WindowShutterSVG() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Window frame in wall */}
      <rect x="0" y="0" width="200" height="140" fill="#161920"/>
      {/* Wall texture lines */}
      {[20,40,60,80,100,120].map((y, i) => (
        <line key={i} x1="0" y1={y} x2="200" y2={y} stroke="#1C2028" strokeWidth="0.5"/>
      ))}
      {/* Window opening */}
      <rect x="30" y="15" width="140" height="110" rx="3" fill="#0D1117" stroke="#3A3F48" strokeWidth="2"/>
      {/* Window glass (visible through louvres) */}
      <rect x="34" y="19" width="132" height="102" fill="#0D1520" opacity="0.5"/>
      {/* Louvred shutter slats - angled */}
      {[22, 33, 44, 55, 66, 77, 88, 99, 110].map((y, i) => (
        <g key={i}>
          <rect x="32" y={y} width="136" height="9" rx="1"
            fill="#23272E"
            stroke="#3D4450"
            strokeWidth="0.5"
            transform={`skewY(-3)`}
            style={{ transformOrigin: `${32}px ${y}px` }}
          />
          {/* Light gap between louvres */}
          <rect x="32" y={y+8} width="136" height="2" fill="#0D1520" opacity="0.6"/>
        </g>
      ))}
      {/* Side channels */}
      <rect x="30" y="15" width="8" height="110" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      <rect x="162" y="15" width="8" height="110" fill="#1C2028" stroke="#3A3F48" strokeWidth="0.5"/>
      {/* Top roller box */}
      <rect x="28" y="10" width="144" height="10" rx="2" fill="#1C2028" stroke="#3A3F48" strokeWidth="1"/>
      <rect x="28" y="10" width="144" height="3" rx="1" fill="var(--mustard)" opacity="0.7"/>
      {/* Pull strap */}
      <rect x="97" y="110" width="6" height="12" rx="3" fill="var(--mustard)" opacity="0.5"/>
      <rect x="95" y="120" width="10" height="4" rx="2" fill="var(--mustard)" opacity="0.6"/>
    </svg>
  )
}
