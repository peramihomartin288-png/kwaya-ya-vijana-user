import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { shareContent } from '../../lib/share';
import Header from '../../components/Header';
import ActionButtons from '../../components/ActionButtons';
import { toggleLike, getLikeCount, getVisitorId } from '../../lib/interactions';
import CommentsModal from '../../components/CommentsModal';
import { toggleBookmark, isBookmarked } from '../../lib/bookmarks';
import { markAsRead } from '../../lib/readStatus';
import { SkeletonText } from '../../components/Skeleton';

export default function WimboDetail() {
  const { jina, tarehe } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: fresh } = await supabase
        .from('wimbo_wa_siku')
        .select('*')
        .ilike('jina', jina.replace(/-/g, ' '))
        .eq('tarehe', tarehe)
        .maybeSingle();
      setData(fresh);
      setLoading(false);
      if (fresh) {
        setBookmarked(isBookmarked('wimbo', fresh.id));
        markAsRead('wimbo', fresh.id);
      }
    }
    load();
  }, [jina, tarehe]);

  if (loading) return <SkeletonText />;
  if (!data) return <p style={{ padding: 20 }}>Haipo</p>;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/home');
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="Wimbo" />
      <button onClick={handleBack} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>
      
      {data && (
        <button onClick={() => { toggleBookmark('wimbo', data.id, data); setBookmarked(!bookmarked); }} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.2rem' }}>
          {bookmarked ? '🔖' : '📑'}
        </button>
      )}
      
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{data.jina}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>{data.tarehe}</p>
        
        {data.media_url && (
          <div style={{ marginBottom: 16 }}>
            {(data.media_url.includes('youtube.com') || data.media_url.includes('youtu.be')) ? (
              <iframe 
                width="100%" 
                height="200" 
                src={`https://www.youtube.com/embed/${data.media_url.split('v=')[1]?.split('&')[0] || data.media_url.split('/').pop()}`} 
                title="YouTube video" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            ) : (
              <audio controls src={data.media_url} style={{ width: '100%' }} />
            )}
          </div>
        )}
        <p style={{ lineHeight: 1.6 }}>{data.description}</p>
      </div>

      <ActionButtons 
        type="wimbo" 
        liked={liked}
        likeCount={likeCount}
        onLike={async () => {
          const newLiked = await toggleLike('wimbo_wa_siku', data.id, getVisitorId());
          setLiked(newLiked);
          setLikeCount(await getLikeCount(data.id));
        }}
        onComment={() => setShowComments(true)}
        onShare={() => shareContent('wimbo', data)} 
      />

      {showComments && (
        <CommentsModal 
          tableName="wimbo_wa_siku" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}

      {showComments && (
        <CommentsModal 
          tableName="wimbo_wa_siku" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
