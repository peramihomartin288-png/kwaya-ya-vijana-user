import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function Feedback() {
  const navigate = useNavigate();
  const [ujumbe, setUjumbe] = useState('');
  const [jina, setJina] = useState('');
  const [sending, setSending] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('app_settings').select('whatsapp_number').maybeSingle();
      if (data) setWhatsappNumber(data.whatsapp_number);
    }
    loadSettings();
  }, []);

  function getVisitorId() {
    let id = localStorage.getItem('kmca_visitor_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('kmca_visitor_id', id);
    }
    return id;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!ujumbe.trim()) return alert('Tafadhali andika maoni yako.');
    
    setSending(true);
    const { error } = await supabase.from('feedback').insert({
      ujumbe,
      jina: jina || null,
      visitor_id: getVisitorId(),
    });

    setSending(false);
    if (error) {
      alert('Kosa la kutuma: ' + error.message);
    } else {
      alert('Asante! Maoni yako yamepokelewa. ✅');
      setUjumbe('');
      setJina('');
      navigate(-1);
    }
  }

  function handleWhatsApp() {
    // Ondoa alama ya + na nafasi yoyote
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Habari KMCA, nina maoni kuhusu app yenu:\n\n${ujumbe}\n\nJina: ${jina || 'Bila jina'}`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  }

  return (
    <div style={{ paddingBottom: 80, minHeight: '100vh' }}>
      <Header title="Maoni" />
      <button onClick={() => navigate(-1)} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>

      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: 8 }}>Tuma Maoni</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Maoni yako yatatusaidia kuboresha App. Unaweza kutuma hapa au kupitia WhatsApp.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input 
            type="text" 
            placeholder="Jina lako (hiari)" 
            value={jina} 
            onChange={(e) => setJina(e.target.value)}
            style={{ padding: 12, borderRadius: 8, background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          />
          <textarea 
            placeholder="Andika maoni yako hapa..." 
            value={ujumbe} 
            onChange={(e) => setUjumbe(e.target.value)}
            rows={5}
            style={{ padding: 12, borderRadius: 8, background: 'var(--color-card)', color: 'var(--color-text)', border: '1px solid var(--color-border)', resize: 'none' }}
          />
          
          <button type="submit" disabled={sending} style={{ background: 'var(--color-primary)', color: 'white', padding: 14, borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {sending ? 'Inatuma...' : '📤 Tuma Maoni'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>Au tuma kupitia WhatsApp:</p>
          <button onClick={handleWhatsApp} style={{ background: '#25D366', color: 'white', padding: 14, borderRadius: 8, border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
            💬 Tuma kwa WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
