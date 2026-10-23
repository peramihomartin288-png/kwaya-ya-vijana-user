import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/share';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { SkeletonList } from '../components/Skeleton';

export default function Matukio() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function load() {
      const { data: fresh } = await supabase
        .from('matukio')
        .select('*')
        .eq('published', true)
        .order('tarehe_kuanza', { ascending: true });
      setData(fresh || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Matukio" />
      
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', borderBottom: '1px solid var(--color-border)' }}>
        {['all', 'upcoming', 'past'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 12px', borderRadius: 20, border: 'none', fontSize: '0.85rem', cursor: 'pointer',
            background: filter === f ? 'var(--color-primary)' : 'var(--color-card)',
            color: filter === f ? 'white' : 'var(--color-text)'
          }}>
            {f === 'all' ? 'Zote' : f === 'upcoming' ? 'Zinazokuja' : 'Zilizopita'}
          </button>
        ))}
      </div>
      
      <div style={{ padding: '16px' }}>
        {loading ? (
          <><SkeletonList /><SkeletonList /><SkeletonList /></>
        ) : data.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Hakuna matukio bado</p>
        ) : (
          data
            .filter((item) => {
              if (filter === 'all') return true;
              const now = new Date();
              const start = new Date(item.tarehe_kuanza);
              const end = new Date(item.tarehe_kumaliza);
              if (filter === 'upcoming') return end >= now;
              if (filter === 'past') return end < now;
              return true;
            })
            .map((item) => (
            <Link key={item.id} to={`/matukio/${slugify(item.jina)}`} style={{ display: 'block', textDecoration: 'none', color: 'var(--color-text)', marginBottom: 16 }}>
              <div style={{ background: 'var(--color-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                {item.picha && <img src={item.picha} alt={item.jina} style={{ width: '100%', height: 160, objectFit: 'cover' }} />}
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{item.jina}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>📍 {item.mahali}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>📅 {new Date(item.tarehe_kuanza).toLocaleDateString('sw-TZ')}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
