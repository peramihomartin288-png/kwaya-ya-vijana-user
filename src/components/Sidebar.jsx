import { Link } from 'react-router-dom';

export default function Sidebar({ onClose }) {
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  const links = [
    { to: '/masomo-yote', label: '📖 Masomo Yote' },
    { to: '/watakatifu-wote', label: '✝️ Watakatifu Wote' },
    { to: '/notifications', label: '🔔 Arifa' },
    { to: '/about', label: 'ℹ️ Kuhusu' },
  ];

  if (!isPWA) {
    links.push({ to: '/install', label: '📱 Install App' });
  }

  return (
    <>
      {/* Background overlay (Kufunga Sidebar ukibonyeza nje) */}
      <div 
        onClick={onClose} 
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 998 
        }} 
      />

      {/* Sidebar yenyewe */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 250, 
        background: 'var(--color-card)', zIndex: 999, padding: 16, 
        borderRight: '1px solid var(--color-border)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--color-primary)' }}>KMCA</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--color-text)' }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={onClose} style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '1rem', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
