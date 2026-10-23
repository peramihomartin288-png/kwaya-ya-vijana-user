import { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Header({ title }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--color-card)', borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button onClick={() => setShowSidebar(true)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.5rem', cursor: 'pointer' }}>
          ☰
        </button>
        <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--color-text)' }}>
          <img src="/icons/icon.svg" alt="KMCA" style={{ width: 32, height: 32, borderRadius: '50%' }} />
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{title || 'KMCA'}</span>
        </Link>
        <Link to="/notifications" style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', textDecoration: 'none' }}>🔔</Link>
      </header>

      {showSidebar && <Sidebar onClose={() => setShowSidebar(false)} />}
    </>
  );
}
