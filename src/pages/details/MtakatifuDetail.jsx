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

export default function MtakatifuDetail() {
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
        .from('watakatifu')
        .select('*')
        .eq('tarehe', tarehe)
        .maybeSingle();
      setData(fresh);
      if (fresh) markAsRead('mtakatifu', fresh.id);
      if (fresh) setBookmarked(isBookmarked('mtakatifu', fresh.id));
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
      <Header title="Mtakatifu" />
      <button onClick={handleBack} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>
      {data && (
        <button onClick={() => { toggleBookmark('mtakatifu', data.id, data); setBookmarked(!bookmarked); }} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.2rem' }}>
          {bookmarked ? '🔖' : '📑'}
        </button>
      )}
      
      <div style={{ padding: 16 }}>
        {data.picha && <img src={data.picha} alt={data.jina} style={{ width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }} />}
        <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{data.jina}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>{data.tarehe}</p>
        
        {data.history && (
          <div className="somo-frame">
            <h3>Historia</h3>
            <p className="detail-text">{data.history}</p>
          </div>
        )}
        {data.miujiza && (
          <div className="somo-frame">
            <h3>Miujiza</h3>
            <p className="detail-text">{data.miujiza}</p>
          </div>
        )}
        {data.sala && (
          <div className="somo-frame">
            <h3>Sala</h3>
            <p className="detail-text">{data.sala}</p>
          </div>
        )}
      </div>

      <ActionButtons 
        type="mtakatifu" 
        liked={liked}
        likeCount={likeCount}
        onLike={async () => {
          const newLiked = await toggleLike('watakatifu', data.id, getVisitorId());
          setLiked(newLiked);
          setLikeCount(await getLikeCount(data.id));
        }}
        onComment={() => setShowComments(true)}
        onShare={() => shareContent('mtakatifu', data)} 
      />

      {showComments && (
        <CommentsModal 
          tableName="watakatifu" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}

      {showComments && (
        <CommentsModal 
          tableName="watakatifu" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
