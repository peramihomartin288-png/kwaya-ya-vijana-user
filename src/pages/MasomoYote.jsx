import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/share';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/Skeleton';

export default function MasomoYote() {
  const [masomo, setMasomo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const months = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'];

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('masomo_dominika')
        .select('*')
        .eq('published', true)
        .order('tarehe', { ascending: false });
      setMasomo(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  };

  // Chuja kwa mwezi
  const filtered = masomo.filter((m) => {
    // Chuja kwa mwezi
    if (selectedMonth !== 'all') {
      const monthIndex = new Date(m.tarehe).getMonth();
      if (monthIndex !== Number(selectedMonth)) return false;
    }
    // Chuja kwa search
    if (search) {
      const text = `${m.dominika} ${m.juma} ${m.tarehe}`.toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg)' }}>
        <Header title="Masomo Yote" />
        <button onClick={handleBack} style={{ padding: '8px 16px', background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>

        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
          <input 
            type="text" 
            placeholder="Tafuta somo..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: 8, borderRadius: 8, background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          />
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: '40%', padding: 8, borderRadius: 8, background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          >
            <option value="all">Miezi Yote</option>
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Hakuna masomo kwa kipindi hiki.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((m) => (
              <Link 
                key={m.id} 
                to={`/masomo-ya-dominika/${slugify(m.dominika)}/${m.tarehe}`}
                style={{ 
                  background: 'var(--color-card)', padding: 16, borderRadius: 'var(--radius-md)', 
                  textDecoration: 'none', color: 'var(--color-text)', border: '1px solid var(--color-border)',
                  borderLeft: '4px solid var(--color-primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>{m.dominika} - {m.juma}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Fungua →</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{m.tarehe}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
