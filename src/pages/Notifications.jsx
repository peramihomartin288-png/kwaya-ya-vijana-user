import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { SkeletonList } from '../components/Skeleton';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const visitorId = localStorage.getItem('kmca_visitor_id');
      if (!visitorId) { setLoading(false); return; }

      const { data } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: false });
      
      setNotifs(data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function markAllRead() {
    const visitorId = localStorage.getItem('kmca_visitor_id');
    if (!visitorId) return;
    await supabase.from('user_notifications').update({ read: true }).eq('visitor_id', visitorId);
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Arifa" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>
        <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--color-primary)' }}>Soma Zote</button>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {loading ? (
          <><SkeletonList /><SkeletonList /><SkeletonList /></>
        ) : notifs.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Hakuna arifa bado.</p>
        ) : (
          notifs.map((n) => (
            <div key={n.id} style={{ background: 'var(--color-card)', padding: 16, borderRadius: 8, marginBottom: 12, borderLeft: n.read ? '4px solid var(--color-border)' : '4px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{n.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{n.body}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
}
