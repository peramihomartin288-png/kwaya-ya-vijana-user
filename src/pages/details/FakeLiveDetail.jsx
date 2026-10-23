import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { shareContent } from '../../lib/share';
import Header from '../../components/Header';
import ActionButtons from '../../components/ActionButtons';
import MediaPlayer from '../../components/MediaPlayer';
import { SkeletonText } from '../../components/Skeleton';

export default function FakeLiveDetail() {
  const { jina, saa } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: fresh } = await supabase
        .from('fake_live')
        .select('*')
        .ilike('head', jina.replace(/-/g, ' '))
        .maybeSingle();
      setData(fresh);
      setLoading(false);
    }
    load();
  }, [jina]);

  // Countdown logic (kama data ipo)
  useEffect(() => {
    if (!data || !data.start_date || !data.play_times) return;

    // Chukua muda wa kwanza kutoka play_times (mfano ["18:00"])
    const firstTime = Array.isArray(data.play_times) ? data.play_times[0] : null;
    if (!firstTime) return;

    const [hours, minutes] = firstTime.split(':').map(Number);
    const startDateTime = new Date(`${data.start_date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);

    const updateCountdown = () => {
      const now = new Date();
      const diff = startDateTime - now;

      if (diff <= 0) {
        setIsLive(true);
        setCountdown(null);
      } else {
        const diffMin = Math.floor(diff / 60000);
        const diffSec = Math.floor((diff % 60000) / 1000);
        setCountdown(`${diffMin}:${String(diffSec).padStart(2, '0')}`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [data]);

  if (loading) return <SkeletonText />;
  if (!data) return <p style={{ padding: 20 }}>Haipo</p>;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Sala Maalumu" />
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
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{data.head}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>{data.description}</p>
        
        {/* Countdown au MediaPlayer */}
        {isLive ? (
          <div style={{ marginBottom: 16 }}>
            {data.url ? (
              <MediaPlayer url={data.url} title={data.head} />
            ) : (
              <p style={{ textAlign: 'center', padding: 20, background: 'var(--color-card)', borderRadius: 8 }}>
                🔴 Live imeanza! (Hakuna video/audio iliyowekwa)
              </p>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: 16, padding: 16, background: 'var(--color-card)', borderRadius: 8, textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', marginBottom: 8 }}>Inaanza baada ya:</p>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', marginBottom: 8 }}>{countdown || '...'}</h2>
            {data.play_times && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Nyakati: {Array.isArray(data.play_times) ? data.play_times.join(', ') : ''}</p>}
          </div>
        )}
      </div>

      <ActionButtons 
        type="content" 
        onShare={() => shareContent('fake-live', data)} 
      />
    </div>
  );
}
