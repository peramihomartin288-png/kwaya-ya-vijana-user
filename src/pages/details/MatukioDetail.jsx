import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { shareContent } from '../../lib/share';
import Header from '../../components/Header';
import ActionButtons from '../../components/ActionButtons';
import { toggleLike, getLikeCount, getVisitorId } from '../../lib/interactions';
import CommentsModal from '../../components/CommentsModal';
import { SkeletonText } from '../../components/Skeleton';

export default function MatukioDetail() {
  const { jina } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: fresh } = await supabase
        .from('matukio')
        .select('*')
        .ilike('jina', jina.replace(/-/g, ' '))
        .maybeSingle();
      setData(fresh);
      if (fresh) setReminder(localStorage.getItem(`kmca_reminder_${fresh.id}`) === 'true');
      setLoading(false);
    }
    load();
  }, [jina]);

  if (loading) return <SkeletonText />;
  if (!data) return <p style={{ padding: 20 }}>Haipo</p>;

  const handleAddToCalendar = () => {
    if (!data) return;
    
    const start = new Date(data.tarehe_kuanza).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(data.tarehe_kumaliza).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KMCA//Matukio//SW
BEGIN:VEVENT
UID:${data.id}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${data.jina}
DESCRIPTION:${data.maelezo?.replace(/\n/g, '\\n') || ''}
LOCATION:${data.mahali}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.jina}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReminder = () => {
    if (!data) return;
    const key = `kmca_reminder_${data.id}`;
    if (reminder) {
      localStorage.removeItem(key);
      setReminder(false);
      alert('Kumbusho limeondolewa.');
    } else {
      localStorage.setItem(key, 'true');
      setReminder(true);
      alert('Tukio limehifadhiwa. Utakumbushwa siku moja kabla.');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Tukio" />
      <button onClick={handleBack} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>
      <button onClick={handleReminder} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '0.9rem' }}>
        {reminder ? '🔔 Kumbusho Limewekwa' : '🔕 Weka Kumbusho'}
      </button>
      <button onClick={handleAddToCalendar} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '0.9rem' }}>📅 Ongeza kwenye Kalenda</button>
      
      <div style={{ padding: 16 }}>
        {data.picha && <img src={data.picha} alt={data.jina} style={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }} />}
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{data.jina}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>📍 {data.mahali}</p>
        <p style={{ color: 'var(--color-primary)', marginBottom: 16 }}>📅 {new Date(data.tarehe_kuanza).toLocaleDateString('sw-TZ')} - {new Date(data.tarehe_kumaliza).toLocaleDateString('sw-TZ')}</p>
        
        <p className="detail-text" style={{ lineHeight: 1.6 }}>{data.maelezo}</p>
        
        {data.video_url && (
          <div style={{ marginTop: 16 }}>
            <a href={data.video_url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>🎥 Tazama Video</a>
          </div>
        )}
      </div>

      <ActionButtons 
        type="matukio" 
        liked={liked}
        likeCount={likeCount}
        onLike={async () => {
          const newLiked = await toggleLike('matukio', data.id, getVisitorId());
          setLiked(newLiked);
          setLikeCount(await getLikeCount(data.id));
        }}
        onComment={() => setShowComments(true)}
        onShare={() => shareContent('matukio', data)} 
      />

      {showComments && (
        <CommentsModal 
          tableName="matukio" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
