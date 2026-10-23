import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { SkeletonText } from '../components/Skeleton';

export default function About() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: fresh } = await supabase
        .from('about')
        .select('*')
        .eq('published', true)
        .maybeSingle();
      setData(fresh);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <SkeletonText />;

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Kuhusu" />
      
      <button onClick={() => navigate(-1)} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>

      <div style={{ padding: 16, textAlign: 'center' }}>
        {/* Logo ya App */}
        <img src="/icons/icon.svg" alt="KMCA Logo" style={{ width: 100, height: 100, objectFit: 'contain', margin: '0 auto 16px' }} />

        {/* Picha ya About (Kama ipo) */}
        {data?.picha && (
          <img src={data.picha} alt={data.kichwa} style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }} />
        )}
        
        <h1 style={{ fontSize: '1.5rem', marginBottom: 16 }}>{data?.kichwa || 'Kuhusu KMCA'}</h1>
        
        <p className="detail-text" style={{ lineHeight: 1.6, color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {data?.maelezo}
        </p>

        {data?.video_url && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 8 }}>🎥 Tazama Video</h3>
            <a href={data.video_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>Fungua Video</a>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
