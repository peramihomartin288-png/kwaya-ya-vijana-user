import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/share';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { SkeletonList } from '../components/Skeleton';

export default function Sala() {
  const navigate = useNavigate();
  const [sala, setSala] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('sala')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      setSala(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Sala" />
      <button onClick={() => navigate(-1)} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>

      <div style={{ padding: '0 16px 16px' }}>
        {loading ? (
          <><SkeletonList /><SkeletonList /><SkeletonList /></>
        ) : sala.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Hakuna sala bado.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sala.map((s) => (
              <Link key={s.id} to={`/sala/${slugify(s.jina)}`} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--color-card)', padding: 16, borderRadius: 8, textDecoration: 'none', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '1.5rem' }}>🙏</span>
                <div>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem', display: 'block' }}>{s.jina}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{s.maelezo?.substring(0, 50)}...</span>
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
