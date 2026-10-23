import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/share';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { SkeletonCard } from '../components/Skeleton';

export default function WatakatifuWote() {
  const [watakatifu, setWatakatifu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const months = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'];

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('watakatifu')
        .select('*')
        .eq('published', true)
        .order('tarehe', { ascending: false });
      setWatakatifu(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  };

  // Chuja kwa mwezi
  const filtered = watakatifu.filter((w) => {
    // Chuja kwa mwezi
    if (selectedMonth !== 'all') {
      const monthIndex = new Date(w.tarehe).getMonth();
      if (monthIndex !== Number(selectedMonth)) return false;
    }
    // Chuja kwa search (jina na tarehe)
    if (search) {
      const text = `${w.jina} ${w.tarehe}`.toLowerCase();
      if (!text.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg)' }}>
        <Header title="Watakatifu Wote" />
        <button onClick={handleBack} style={{ padding: '8px 16px', background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>

        <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
          <input 
            type="text" 
            placeholder="Tafuta jina au tarehe..." 
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
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Hakuna watakatifu kwa kipindi hiki.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((w) => (
              <Link 
                key={w.id} 
                to={`/mtakatifu/${slugify(w.jina)}/${w.tarehe}`}
                style={{ 
                  background: 'var(--color-card)', padding: 16, borderRadius: 'var(--radius-md)', 
                  textDecoration: 'none', color: 'var(--color-text)', border: '1px solid var(--color-border)',
                  borderLeft: '4px solid var(--color-primary)', display: 'flex', alignItems: 'center', gap: 12
                }}
              >
                {w.picha && (
                  <img src={w.picha} alt={w.jina} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{w.jina}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{w.tarehe}</p>
                </div>
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
