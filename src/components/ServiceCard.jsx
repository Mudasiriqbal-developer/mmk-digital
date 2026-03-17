import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ icon, title, description, tag, color = '#007BFF', onClick }) {
  return (
    <div className="card" onClick={onClick}
      style={{
        padding: '28px 24px',
        cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
      }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: color, opacity: 0.06,
      }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: `${color}14`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18, color: color,
      }}>
        {icon}
      </div>

      {tag && (
        <span style={{
          display: 'inline-block', marginBottom: 10,
          padding: '3px 10px', borderRadius: 99,
          background: `${color}14`, color: color,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          {tag}
        </span>
      )}

      <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#0d1117' }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65, marginBottom: 20 }}>
        {description}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: color, fontWeight: 600, fontSize: 14 }}>
        Get Started <ArrowRight size={15} />
      </div>
    </div>
  );
}