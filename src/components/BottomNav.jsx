import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { isRead } from '../lib/readStatus';

const items = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/matukio', label: 'Matukio', icon: '📅' },
  { to: '/sala', label: 'Sala', icon: '🙏' },
  { to: '/history', label: 'History', icon: '📜' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function BottomNav() {
  const location = useLocation();
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadBadge() {
      const today = new Date().toISOString().split('T')[0];
      
      const [w, m, s, t] = await Promise.all([
        supabase.from('watakatifu').select('id, tarehe').lt('tarehe', today).eq('published', true),
        supabase.from('masomo_dominika').select('id, tarehe').lt('tarehe', today).eq('published', true),
        supabase.from('wimbo_wa_siku').select('id, tarehe').lt('tarehe', today).eq('published', true),
        supabase.from('tafakari').select('id, tarehe').lt('tarehe', today).eq('published', true),
      ]);

      let count = 0;
      const all = [
        ...(w.data || []).map((d) => ({ ...d, type: 'mtakatifu' })),
        ...(m.data || []).map((d) => ({ ...d, type: 'masomo' })),
        ...(s.data || []).map((d) => ({ ...d, type: 'wimbo' })),
        ...(t.data || []).map((d) => ({ ...d, type: 'tafakari' })),
      ];

      all.forEach((item) => {
        if (!isRead(item.type, item.id)) count++;
      });

      if (isMounted) setHistoryCount(count);
    }

    loadBadge();
    
    // Sasisha kila sekunde 3
    const interval = setInterval(loadBadge, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      background: 'var(--color-card)', borderTop: '1px solid var(--color-border)',
      padding: '8px 0', zIndex: 100,
    }}>
      {items.map((item) => {
        const active = location.pathname === item.to;
        const showBadge = item.to === '/history' && historyCount > 0;

        return (
          <Link key={item.to} to={item.to} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textDecoration: 'none', color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontSize: '0.7rem', gap: 2, position: 'relative'
          }}>
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.label}</span>
            {showBadge && (
              <div style={{
                position: 'absolute', top: -2, right: 4,
                background: '#ef4444', color: 'white',
                fontSize: '0.6rem', fontWeight: 'bold',
                padding: '1px 5px', borderRadius: 10, minWidth: 16, textAlign: 'center'
              }}>
                {historyCount}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
