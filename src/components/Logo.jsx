export default function Logo({ size = 36, showText = true, textColor }) {
  const tc = textColor || 'var(--text)';
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8"  cy="32" r="3"   fill="#E31E24" opacity="0.35" />
        <circle cx="20" cy="32" r="3"   fill="#E31E24" opacity="0.55" />
        <circle cx="32" cy="32" r="3"   fill="#E31E24" opacity="0.35" />
        <circle cx="14" cy="22" r="3.5" fill="#007BFF" opacity="0.65" />
        <circle cx="26" cy="22" r="3.5" fill="#007BFF" opacity="0.65" />
        <circle cx="20" cy="12" r="4"   fill="#E31E24" opacity="0.85" />
        <circle cx="20" cy="4"  r="4.5" fill="#E31E24" />
        <line x1="8"  y1="32" x2="14" y2="22" stroke="#E31E24" strokeWidth="1.5" opacity="0.3"/>
        <line x1="20" y1="32" x2="14" y2="22" stroke="#007BFF" strokeWidth="1.5" opacity="0.5"/>
        <line x1="20" y1="32" x2="26" y2="22" stroke="#007BFF" strokeWidth="1.5" opacity="0.5"/>
        <line x1="32" y1="32" x2="26" y2="22" stroke="#E31E24" strokeWidth="1.5" opacity="0.3"/>
        <line x1="14" y1="22" x2="20" y2="12" stroke="#007BFF" strokeWidth="1.8" opacity="0.7"/>
        <line x1="26" y1="22" x2="20" y2="12" stroke="#007BFF" strokeWidth="1.8" opacity="0.7"/>
        <line x1="20" y1="12" x2="20" y2="4"  stroke="#E31E24" strokeWidth="2.2" opacity="0.9"/>
        <circle cx="20" cy="4" r="8" fill="#E31E24" opacity="0.1"/>
      </svg>
      {showText && (
        <div style={{ lineHeight:1 }}>
          <div style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:size*0.42, color:'#E31E24', letterSpacing:'-0.5px' }}>MMK</div>
          <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:500, fontSize:size*0.26, color:tc, letterSpacing:'0.3px', marginTop:1 }}>Digital Solution</div>
        </div>
      )}
    </div>
  );
}