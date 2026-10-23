import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { shareContent } from '../../lib/share';
import Header from '../../components/Header';
import ActionButtons from '../../components/ActionButtons';
import MediaPlayer from '../../components/MediaPlayer';
import { SkeletonText } from '../../components/Skeleton';

export default function LiveDetail() {
  const { jina, tarehe } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: fresh } = await supabase
        .from('live')
        .select('*')
        .ilike('head', jina.replace(/-/g, ' '))
        .maybeSingle();
      setData(fresh);
      setLoading(false);
    }
    load();
  }, [jina]);

  if (loading) return <SkeletonText />;
  if (!data) return <p style={{ padding: 20 }}>Haipo</p>;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Live" />
      <button onClick={handleBack} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>
      
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{data.head}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>{data.description}</p>
        
        {data.url && <MediaPlayer url={data.url} title={data.head} />}
      </div>

      <ActionButtons 
        type="content" 
        onShare={() => shareContent('live', data)} 
      />
    </div>
  );
}
