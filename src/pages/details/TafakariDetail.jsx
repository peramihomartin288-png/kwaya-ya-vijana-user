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

export default function TafakariDetail() {
  const { jina, tarehe } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: fresh } = await supabase
        .from('tafakari')
        .select('*')
        .ilike('jina', jina.replace(/-/g, ' '))
        
        .limit(1).maybeSingle();
      setData(fresh);
      if (fresh) markAsRead('tafakari', fresh.id);
      if (fresh) setBookmarked(isBookmarked('tafakari', fresh.id));
      setLoading(false);
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
      <Header title="Tafakari" />
      <button 
        onClick={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/home');
        }} 
        style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}
      >
        ← Rudi
      </button>
      {data && (
        <button onClick={() => { toggleBookmark('tafakari', data.id, data); setBookmarked(!bookmarked); }} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.2rem' }}>
          {bookmarked ? '🔖' : '📑'}
        </button>
      )}
      
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{data.jina}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>{data.tarehe}</p>
        <p className="detail-text">{data.maneno}</p>
      </div>

      <ActionButtons 
        type="tafakari" 
        liked={liked}
        likeCount={likeCount}
        onLike={async () => {
          const newLiked = await toggleLike('tafakari', data.id, getVisitorId());
          setLiked(newLiked);
          setLikeCount(await getLikeCount(data.id));
        }}
        onComment={() => setShowComments(true)}
        onShare={() => shareContent('tafakari', data)} 
      />

      {showComments && (
        <CommentsModal 
          tableName="tafakari" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}

      {showComments && (
        <CommentsModal 
          tableName="tafakari" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
