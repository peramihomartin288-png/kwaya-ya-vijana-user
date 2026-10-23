import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/share';
import { isRead, markAsRead } from '../lib/readStatus';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { SkeletonList } from '../components/Skeleton';

export default function History() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const location = useLocation();

  const months = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'];

  useEffect(() => {
    async function load() {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), selectedMonth, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(today.getFullYear(), selectedMonth + 1, 0).toISOString().split('T')[0];

      // Vuta kadi zote za mwezi uliochaguliwa (na zilizopita)
      const [w, m, s, t] = await Promise.all([
        supabase.from('watakatifu').select('*').gte('tarehe', startOfMonth).lte('tarehe', endOfMonth).eq('published', true).order('tarehe', { ascending: false }),
        supabase.from('masomo_dominika').select('*').gte('tarehe', startOfMonth).lte('tarehe', endOfMonth).eq('published', true).order('tarehe', { ascending: false }),
        supabase.from('wimbo_wa_siku').select('*').gte('tarehe', startOfMonth).lte('tarehe', endOfMonth).eq('published', true).order('tarehe', { ascending: false }),
        supabase.from('tafakari').select('*').gte('tarehe', startOfMonth).lte('tarehe', endOfMonth).eq('published', true).order('tarehe', { ascending: false }),
      ]);

      const items = [];
      if (w.data) w.data.forEach((d) => items.push({ type: 'watakatifu', data: d }));
      if (m.data) m.data.forEach((d) => items.push({ type: 'masomo', data: d }));
      if (s.data) s.data.forEach((d) => items.push({ type: 'wimbo', data: d }));
      if (t.data) t.data.forEach((d) => items.push({ type: 'tafakari', data: d }));

      items.sort((a, b) => new Date(b.data.tarehe) - new Date(a.data.tarehe));

      setData(items);
      setLoading(false);
    }
    load();
  }, [selectedMonth, location.key]);

  const filtered = activeTab === 'all' ? data : data.filter((d) => d.type === activeTab);

  const tabs = [
    { key: 'all', label: 'Zote' },
    { key: 'watakatifu', label: 'Watakatifu', color: '#ffffff' },
    { key: 'masomo', label: 'Masomo', color: '#ef4444' },
    { key: 'wimbo', label: 'Wimbo', color: '#9333ea' },
    { key: 'tafakari', label: 'Tafakari', color: '#16a34a' },
  ];

  // Rangi kwa kila aina
  const getTypeColor = (type) => {
    if (type === 'watakatifu') return '#ffffff';
    if (type === 'masomo') return '#ef4444';
    if (type === 'wimbo') return '#9333ea';
    if (type === 'tafakari') return '#16a34a';
    return 'var(--color-primary)';
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Historia" />
      <div style={{ padding: '8px 16px', textAlign: 'right' }}>
        <button onClick={() => {
          data.forEach((item) => markAsRead(item.type, item.data.id));
          setData([...data]); // Refresh
        }} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', color: 'var(--color-text)', padding: '6px 12px', borderRadius: 8, fontSize: '0.8rem' }}>
          ✅ Soma Zote
        </button>
      </div>
      
      {/* Kichujio cha Mwezi */}
      <div style={{ padding: '12px 16px 0' }}>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{ width: '100%', padding: 8, borderRadius: 8, background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
        >
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
      </div>

      {/* Tabs za Aina */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', borderBottom: '1px solid var(--color-border)' }}>
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: '6px 12px', borderRadius: 20, border: 'none', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            background: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-card)',
            color: activeTab === tab.key ? 'white' : 'var(--color-text)'
          }}>
            {tab.color && <span style={{ width: 10, height: 10, borderRadius: '50%', background: tab.color, display: 'inline-block' }} />}
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {loading ? (
          <><SkeletonList /><SkeletonList /><SkeletonList /><SkeletonList /></>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Hakuna historia kwa mwezi huu</p>
        ) : (
          filtered.map((item) => {
            const d = item.data;
            let url = '';
            let label = '';
            let icon = '📌';

            if (item.type === 'watakatifu') { url = `/mtakatifu/${slugify(d.jina)}/${d.tarehe}`; label = d.jina; icon = d.picha ? <img src={d.picha} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '✝️'; }
            if (item.type === 'masomo') { url = `/masomo-ya-dominika/${slugify(d.dominika)}/${d.tarehe}`; label = `${d.dominika} - ${d.juma}`; const domNumber = d.dominika?.match(/\d+/)?.[0] || '?'; icon = d.picha ? <img src={d.picha} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : domNumber; }
            if (item.type === 'wimbo') { url = `/wimbo/${slugify(d.jina)}/${d.tarehe}`; label = d.jina; const ytId = d.media_url?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]; icon = ytId ? <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🎵'; }
            if (item.type === 'tafakari') { url = `/tafakari/${slugify(d.jina)}/${d.tarehe}`; label = d.jina; icon = '💭'; }

            return (
              <Link key={d.id} to={url} style={{ display: 'block', textDecoration: 'none', color: 'var(--color-text)', marginBottom: 12 }}>
                <div style={{ background: 'var(--color-card)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${getTypeColor(item.type)}` }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '1.2rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{label}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {d.tarehe} {isRead(item.type, d.id) ? '✅' : ' 🆕'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
