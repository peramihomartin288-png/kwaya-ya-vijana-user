import { Link } from 'react-router-dom';
import { slugify } from '../lib/share';

export default function LiveCard({ live }) {
  if (!live || !live.active) return null;
  const url = `/live/${slugify(live.head)}/${live.created_at?.split('T')[0]}`;

  return (
    <Link to={url} style={{ display: 'block', textDecoration: 'none', color: 'var(--color-text)' }}>
      <div style={{ background: 'var(--color-card)', marginBottom: 16, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/icons/icon.svg" alt="KMCA" style={{ width: 32, height: 32 }} />
            <span style={{ fontWeight: 700 }}>KMCA</span>
          </div>
          <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>🔴 LIVE</span>
        </div>
        
        <div style={{ padding: '12px 16px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{live.head}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{live.description}</p>
          <div style={{ marginTop: 12, background: 'var(--color-primary)', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 'var(--radius-sm)', fontWeight: 'bold' }}>
            👁️ Tazama Live
          </div>
        </div>
      </div>
    </Link>
  );
}
