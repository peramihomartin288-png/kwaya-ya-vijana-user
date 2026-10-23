import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { slugify } from '../lib/share';
import { isRead } from '../lib/readStatus';

// Kazi ya kupata YouTube ID
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
}

export default function StoryBar() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0];
      
      const [w, m, s, t] = await Promise.all([
        supabase.from('watakatifu').select('*').eq('tarehe', today).eq('published', true).maybeSingle(),
        supabase.from('masomo_dominika').select('*').eq('tarehe', today).eq('published', true).maybeSingle(),
        supabase.from('wimbo_wa_siku').select('*').eq('tarehe', today).eq('published', true).maybeSingle(),
        supabase.from('tafakari').select('*').eq('tarehe', today).eq('published', true).maybeSingle(),
      ]);

      const items = [];
      const addCard = (type, data, label, image, fallbackIcon, url) => {
        const read = isRead(type, data.id);
        items.push({ type, data, label, image, fallbackIcon, url, read });
      };
      
      // Mtakatifu
      if (w.data) {
        addCard('mtakatifu', w.data, w.data.jina, w.data.picha, '✝️', `/mtakatifu/${slugify(w.data.jina)}/${today}`);
      }

      // Masomo
      if (m.data) {
        // Chukua namba ya dominika (mfano "29" kutoka "Dominika ya 29")
        const domNumber = m.data.dominika?.match(/\d+/)?.[0] || '?';
        addCard('masomo', m.data, `Masomo ya ${new Date(m.data.tarehe).toLocaleDateString('sw-TZ', { weekday: 'long' })}`, m.data.picha, domNumber, `/masomo-yote`);
      }

      // Wimbo
      if (s.data) {
        const ytId = getYouTubeId(s.data.media_url);
        addCard('wimbo', s.data, s.data.jina, ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null, '🎵', `/wimbo/${slugify(s.data.jina)}`);
      }

      // Tafakari
      if (t.data) {
        addCard('tafakari', t.data, t.data.jina, null, '💭', `/tafakari/${slugify(t.data.jina)}/${today}`);
      }

      setCards(items);
    }
    load();
  }, []);

  if (cards.length === 0) return null;

  return (
    <div style={{ display: 'flex', gap: 16, padding: '16px', overflowX: 'auto', borderBottom: '1px solid var(--color-border)' }}>
      {cards.map((card) => (
        <Link key={card.type} to={card.url} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: 'var(--color-text)', minWidth: 75 }}>
          <div style={{ 
            width: 68, height: 68, borderRadius: '50%', 
            border: card.read ? '2px solid var(--color-success)' : '2px solid var(--color-border)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '1.5rem', background: 'var(--color-card)', marginBottom: 8, 
            padding: 2, // Nafasi kati ya ring na picha
            position: 'relative'
          }}>
            {card.image ? (
              <img src={card.image} alt={card.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              card.fallbackIcon
            )}
            {!card.read && <div style={{ position: 'absolute', top: 0, right: 0, width: 12, height: 12, background: '#ef4444', borderRadius: '50%', border: '2px solid var(--color-card)' }} />}
          </div>
          <span style={{ fontSize: '0.75rem', textAlign: 'center', fontWeight: 500, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', lineHeight: 1.2, height: '2.4em' }}>
            {card.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
