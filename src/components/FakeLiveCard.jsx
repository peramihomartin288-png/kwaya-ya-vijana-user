import { Link } from 'react-router-dom';
import { slugify } from '../lib/share';

export default function FakeLiveCard({ fakeLive }) {
  if (!fakeLive) return null;
  
  const url = `/fake-live/${slugify(fakeLive.head)}/${fakeLive.short_id || ''}`;
  
  // play_times ni JSON (mfano ["18:00", "20:00"])
  const times = Array.isArray(fakeLive.play_times) ? fakeLive.play_times.join(', ') : '';

  return (
    <Link to={url} style={{ display: 'block', textDecoration: 'none', color: 'var(--color-text)' }}>
      <div style={{ background: 'var(--color-card)', marginBottom: 16, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/icons/icon.svg" alt="KMCA" style={{ width: 32, height: 32 }} />
            <span style={{ fontWeight: 700 }}>KMCA</span>
          </div>
          <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>⏰ SALA MAALUMU</span>
        </div>
        
        <div style={{ padding: '12px 16px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{fakeLive.head}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{fakeLive.description}</p>
          {times && <p style={{ fontSize: '0.85rem', marginTop: 8, color: 'var(--color-primary)' }}>🕐 Nyakati: {times}</p>}
        </div>
      </div>
    </Link>
  );
}
