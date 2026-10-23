import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('footer').select('*').maybeSingle();
      setFooter(data);
    }
    load();
  }, []);

  if (!footer) return null;

  return (
    <footer style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--color-text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--color-border)' }}>
      
      {/* Logo (Kutoka Code) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <img src="/icons/icon.svg" alt="KMCA" style={{ width: 32, height: 32, borderRadius: '50%' }} />
      </div>

      {/* Jina la Kwaya (Kutoka Supabase) */}
      <h3 style={{ color: 'var(--color-text)', marginBottom: 4, fontSize: '1rem' }}>{footer.jina}</h3>
      
      {/* Maelezo (Kutoka Supabase) */}
      <p style={{ marginBottom: 12, maxWidth: 300, margin: '0 auto 12px' }}>{footer.maelezo}</p>

      {/* Mitandao ya Kijamii (Kutoka Supabase) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
        {footer.facebook && <a href={footer.facebook} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text)' }}>FB</a>}
        {footer.instagram && <a href={footer.instagram} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text)' }}>IG</a>}
        {footer.youtube && <a href={footer.youtube} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text)' }}>YT</a>}
        {footer.tiktok && <a href={footer.tiktok} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text)' }}>TT</a>}
        {footer.whatsapp && <a href={footer.whatsapp} target="_blank" rel="noreferrer" style={{ color: 'var(--color-text)' }}>WA</a>}
      </div>

      {/* Copyright */}
      <p style={{ fontSize: '0.75rem' }}>© {new Date().getFullYear()} {footer.jina} — Haki zote zimehifadhiwa</p>
    </footer>
  );
}
