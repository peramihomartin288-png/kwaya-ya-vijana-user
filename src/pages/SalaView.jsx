import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import ActionButtons from '../components/ActionButtons';
import { SkeletonText } from '../components/Skeleton';
import { shareContent } from '../lib/share';

export default function SalaView() {
  const { jina } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchJina, setSearchJina] = useState('');

  useEffect(() => {
    async function load() {
      const sj = jina.replace(/-/g, ' ');
      setSearchJina(sj);
      
      const { data: fresh, error } = await supabase
        .from('sala')
        .select('*')
        .ilike('jina', `%${sj}%`)
        .maybeSingle();
      
      if (error) {
        setErrorMsg(error.message);
      }
      setData(fresh);
      setLoading(false);
    }
    load();
  }, [jina]);

  if (loading) return <SkeletonText />;

  // Kama kuna kosa au hakuna data, onyesha kwenye screen
  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <Header title="Sala" />
        <h2 style={{ color: 'red' }}>Sala Haipatikani</h2>
        <p><b>Jina lililotafutwa:</b> {searchJina}</p>
        <p><b>Kosa:</b> {errorMsg || 'Hakuna kosa la mtandao, lakini data haipo kwenye database.'}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: 10, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 8 }}>← Rudi</button>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Sala" />
      <button 
        onClick={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/home');
        }} 
        style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}
      >
        ← Rudi
      </button>
      
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{data.jina}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>{data.maelezo}</p>
        
        <div className="somo-frame">
          <p className="detail-text">{data.maneno}</p>
        </div>

        {data.sala_inayofuata && data.sala_inayofuata_url && (
          <button 
            onClick={() => navigate(`/sala/${data.sala_inayofuata_url}`)}
            style={{ marginTop: 24, width: '100%', background: 'var(--color-primary)', color: 'white', padding: 16, borderRadius: 8, border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Endelea na: {data.sala_inayofuata} →
          </button>
        )}

        {/* Action Buttons */}
        <div style={{ marginTop: 24 }}>
          <ActionButtons 
            type="sala" 
            onShare={() => shareContent('sala', data)} 
          />
        </div>
      </div>
    </div>
  );
}
