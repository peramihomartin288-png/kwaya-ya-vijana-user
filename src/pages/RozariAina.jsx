import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../lib/share';
import Header from '../components/Header';

const AINA_ZA_MAFUNGU = ['Mafungu ya Furaha', 'Mafungu ya Mwanga', 'Mafungu ya Uchungu', 'Mafungu ya Utukufu'];

export default function RozariAina() {
  const navigate = useNavigate();
  const { rozari_jina } = useParams();

  return (
    <div style={{ paddingBottom: 80, minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Header title="Aina za Mafungu" />
      <button onClick={() => navigate(-1)} style={{ padding: 16, background: 'none', border: 'none', color: 'var(--color-text)' }}>← Rudi</button>

      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>{rozari_jina.replace(/-/g, ' ')}</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Chagua aina ya mafungu unayotaka kusali:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {AINA_ZA_MAFUNGU.map((aina) => (
            <button 
              key={aina}
              onClick={() => navigate(`/rozari/${rozari_jina}/mafungu/${slugify(aina)}`)}
              style={{ background: 'var(--color-card)', padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', color: 'var(--color-text)', textAlign: 'left', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {aina}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
