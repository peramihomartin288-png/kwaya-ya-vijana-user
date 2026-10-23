import { LikeIcon, CommentIcon, ShareIcon } from './Icons';

export default function ActionButtons({ type, liked, onLike, onComment, onShare, likeCount }) {
  const showLike = ['post', 'wimbo', 'content'].includes(type);
  const showComment = ['post', 'wimbo', 'mtakatifu', 'content'].includes(type);
  const showShare = true;

  return (
    <div style={{ display: 'flex', gap: 16, padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
      {showLike && (
        <button onClick={onLike} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: liked ? '#ef4444' : 'var(--color-text)', cursor: 'pointer', fontSize: '0.9rem' }}>
          <LikeIcon filled={liked} /> {likeCount || 0}
        </button>
      )}
      
      {showComment && (
        <button onClick={onComment} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '0.9rem' }}>
          <CommentIcon /> Comment
        </button>
      )}

      {showShare && (
        <button onClick={onShare} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: '0.9rem' }}>
          <ShareIcon /> Share
        </button>
      )}
    </div>
  );
}
