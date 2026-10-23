import { useState, useEffect } from 'react';
import { slugify } from '../lib/share';
import { shareContent } from '../lib/share';
import ActionButtons from './ActionButtons';
import CommentsModal from './CommentsModal';
import { toggleLike, getLikeCount, getVisitorId } from '../lib/interactions';

export default function ContentCard({ content }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (content?.id) {
      getLikeCount(content.id).then(setLikeCount);
    }
  }, [content]);

  if (!content) return null;

  const media = content.media || {};
  const isVideo = media.type === 'video' || content.content_type === 'video';
  const hasImages = media.images && media.images.length > 0;

  const handleLike = async () => {
    // 1. Onyesha papo hapo (Optimistic)
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    // 2. Tuma kwa Supabase nyuma ya pazia
    await toggleLike('content', content.id, getVisitorId());
  };

  return (
    <div style={{ background: 'var(--color-card)', marginBottom: 16, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      {/* Logo & Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px' }}>
        <img src="/icons/icon.svg" alt="KMCA" style={{ width: 32, height: 32 }} />
        <span style={{ fontWeight: 700, fontSize: '1rem' }}>KMCA</span>
      </div>

      {/* Title & Description */}
      <div style={{ padding: '0 16px 12px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>{content.head}</h3>
        {content.description && <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{content.description}</p>}
      </div>

      {/* Media (Picha/Video) */}
      <div>
        {isVideo && media.url ? (
          <div style={{ position: 'relative', background: '#000', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: '2rem' }}>▶️</span>
            <p style={{ position: 'absolute', bottom: 8, left: 8, color: 'white', fontSize: '0.8rem' }}>Bonyeza kutazama</p>
          </div>
        ) : hasImages ? (
          <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', gap: 4 }}>
            {media.images.map((img, i) => (
              <img key={i} src={img} alt="" style={{ width: '100%', height: 250, objectFit: 'cover', scrollSnapAlign: 'start', flex: '0 0 100%' }} />
            ))}
          </div>
        ) : media.url ? (
          <img src={media.url} alt={content.head} style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
        ) : null}
      </div>

      {/* Action Buttons */}
      <ActionButtons 
        type="post" 
        liked={liked}
        likeCount={likeCount}
        onLike={handleLike}
        onComment={() => setShowComments(true)}
        onShare={() => shareContent('post', content)}
      />

      {showComments && (
        <CommentsModal 
          tableName="content" 
          contentId={content.id} 
          onClose={() => setShowComments(false)} 
        />
      )}
    </div>
  );
}
