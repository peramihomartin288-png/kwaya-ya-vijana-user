import { useState, useEffect } from 'react';
import { addComment, getComments, getVisitorId } from '../lib/interactions';
import { supabase } from '../lib/supabase';

export default function CommentsModal({ tableName, contentId, onClose }) {
  const [comments, setComments] = useState([]);
  const [maoni, setMaoni] = useState('');
  const [jina, setJina] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getComments(tableName, contentId);
      setComments(data);
    }
    load();
  }, [tableName, contentId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!maoni.trim()) return;
    setSending(true);
    const visitorId = getVisitorId();
    await addComment(tableName, contentId, visitorId, jina, maoni);
    setMaoni('');
    setJina('');
    const data = await getComments(tableName, contentId);
    setComments(data);
    setSending(false);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ background: 'var(--color-card)', padding: 16, borderRadius: '16px 16px 0 0', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1.1rem' }}>Maoni ({comments.length})</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text)', fontSize: '1.2rem' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
          {comments.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Hakuna maoni bado.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={{ background: 'var(--color-bg)', padding: 12, borderRadius: 8, marginBottom: 8 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: 4 }}>{c.jina || 'Mtumiaji'}</p>
                <p style={{ fontSize: '0.9rem' }}>{c.maoni}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input 
            type="text" 
            placeholder="Jina lako (hiari)" 
            value={jina} 
            onChange={(e) => setJina(e.target.value)}
            style={{ padding: 10, borderRadius: 8, background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          />
          <textarea 
            placeholder="Andika maoni yako..." 
            value={maoni} 
            onChange={(e) => setMaoni(e.target.value)}
            rows={2}
            style={{ padding: 10, borderRadius: 8, background: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', resize: 'none' }}
          />
          <button type="submit" disabled={sending} style={{ background: 'var(--color-primary)', color: 'white', padding: 12, borderRadius: 8, border: 'none', fontWeight: 'bold' }}>
            {sending ? 'Inatuma...' : 'Tuma'}
          </button>
        </form>
      </div>
    </div>
  );
}
