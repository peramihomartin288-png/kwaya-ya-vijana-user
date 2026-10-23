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

export default function MasomoDetail() {
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
        .from('masomo_dominika')
        .select('*')
        .ilike('dominika', jina.replace(/-/g, ' '))
        
        .limit(1).maybeSingle();
      setData(fresh);
      if (fresh) markAsRead('masomo', fresh.id);
      if (fresh) setBookmarked(isBookmarked('masomo', fresh.id));
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
      <Header title="Masomo" />
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
        <button onClick={() => { toggleBookmark('masomo', data.id, data); setBookmarked(!bookmarked); }} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.2rem' }}>
          {bookmarked ? '🔖' : '📑'}
        </button>
      )}
      
      <div style={{ padding: 16 }}>
        {/* Picha (Kama ipo) */}
        {data.picha && (
          <img src={data.picha} alt={data.dominika} style={{ width: '100%', borderRadius: 8, marginBottom: 16 }} />
        )}

        {/* Kichwa & Tarehe */}
        <h1 style={{ fontSize: '1.5rem', marginBottom: 4 }}>{data.dominika}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 4 }}>{data.juma} · {data.tarehe}</p>
        {data.mwaka_liturujia && <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: 16 }}>{data.mwaka_liturujia}</p>}
        
        {data.description && <p style={{ lineHeight: 1.6, marginBottom: 24 }}>{data.description}</p>}

        {/* Somo la Kwanza */}
        {data.somo_1_maneno && (
          <div className="somo-frame">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>📖 Somo la Kwanza</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: 8 }}>{data.somo_1_kitabu}</p>
            <p className="detail-text">{data.somo_1_maneno}</p>
          </div>
        )}

        {/* Wimbo wa Katikati */}
        {data.wimbo_katikati_maneno && (
          <div className="somo-frame">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>🎵 Wimbo wa Katikati</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: 8 }}>{data.wimbo_katikati_kitabu}</p>
            <p className="detail-text">{data.wimbo_katikati_maneno}</p>
          </div>
        )}

        {/* Somo la Pili */}
        {data.somo_2_maneno && (
          <div className="somo-frame">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>📖 Somo la Pili</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: 8 }}>{data.somo_2_kitabu}</p>
            <p className="detail-text">{data.somo_2_maneno}</p>
          </div>
        )}

        {/* Shangilio */}
        {data.shangilio_maneno && (
          <div className="somo-frame">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>🙏 Shangilio</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: 8 }}>{data.shangilio_kitabu}</p>
            <p className="detail-text">{data.shangilio_maneno}</p>
          </div>
        )}

        {/* Injili */}
        {data.injili_maneno && (
          <div className="somo-frame">
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>📖 Injili</h3>
            <p style={{ fontWeight: 'bold', color: 'var(--color-primary)', marginBottom: 8 }}>{data.injili_kitabu}</p>
            <p className="detail-text">{data.injili_maneno}</p>
          </div>
        )}
      </div>

      <ActionButtons 
        type="masomo" 
        liked={liked}
        likeCount={likeCount}
        onLike={async () => {
          const newLiked = await toggleLike('masomo', data.id, getVisitorId());
          setLiked(newLiked);
          setLikeCount(await getLikeCount(data.id));
        }}
        onComment={() => setShowComments(true)}
        onShare={() => shareContent('masomo', data)} 
      />

      {showComments && (
        <CommentsModal 
          tableName="masomo_dominika" 
          contentId={data.id} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
