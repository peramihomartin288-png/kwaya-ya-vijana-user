import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function RozariView() {
  const { rozari_jina, sehemu, aina } = useParams();
  const navigate = useNavigate();
  const [beads, setBeads] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1. Tafuta rozari_aina
      const { data: ainaData } = await supabase
        .from('rozari_aina')
        .select('id')
        .ilike('jina', rozari_jina.replace(/-/g, ' '))
        .maybeSingle();

      if (ainaData) {
        // 2. Vuta mafungu
        const { data } = await supabase
          .from('rozari_sehemu')
          .select('*')
          .eq('rozari_id', ainaData.id)
          .eq('sehemu_type', 'fungu')
          .order('urutan', { ascending: true });
        setBeads(data || []);
      }
      setLoading(false);
    }
    load();
  }, [rozari_jina]);

  if (loading) return <p style={{ padding: 20 }}>Inapakia...</p>;
  if (beads.length === 0) return <p style={{ padding: 20 }}>Hakuna mafungu yaliyowekwa.</p>;

  const currentFungu = beads[currentStep];
  const lines = currentFungu?.kichwa?.split('\n') || [];

  const handleNext = () => {
    if (currentStep < beads.length - 1) setCurrentStep(currentStep + 1);
    else { alert('Umekamilisha Rozari!'); navigate('/sala'); }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate(-1);
  };

  return (
    <div style={{ paddingBottom: 80, minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
      <Header title={aina.replace(/-/g, ' ')} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 16 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16, textAlign: 'center' }}>Tendo la {currentStep + 1}</h2>

        <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 24 }}>
          {Array.from({ length: 11 }).map((_, i) => {
            const angle = (i / 11) * (2 * Math.PI) - (Math.PI / 2);
            const x = 100 + 80 * Math.cos(angle);
            const y = 100 + 80 * Math.sin(angle);
            const isActive = i === 0;

            return (
              <div key={i} style={{ position: 'absolute', left: x - (i === 0 ? 20 : 10), top: y - (i === 0 ? 20 : 10), width: i === 0 ? 40 : 20, height: i === 0 ? 40 : 20, borderRadius: '50%', background: isActive ? 'var(--color-primary)' : 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {i === 0 && '🤎'}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', maxWidth: 300, marginBottom: 32 }}>
          {lines.map((line, idx) => (
            <p key={idx} style={{ marginBottom: 8, fontSize: idx === 0 ? '1rem' : '0.95rem', fontWeight: idx === 0 ? 'bold' : 'normal', color: idx === 0 ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
              {line}
            </p>
          ))}
        </div>

        <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          <button onClick={handlePrev} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--color-text)' }}>←</button>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{currentStep + 1}/{beads.length}</span>
          <button onClick={handleNext} style={{ background: 'var(--color-card)', color: 'var(--color-primary)', padding: '10px 24px', borderRadius: 20, border: '1px solid var(--color-primary)', fontWeight: 'bold', cursor: 'pointer' }}>
            Ifuatayo
          </button>
        </div>
      </div>
    </div>
  );
}
