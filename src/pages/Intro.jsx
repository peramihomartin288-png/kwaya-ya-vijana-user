import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prefetchHomeData } from '../lib/prefetch';

export default function Intro() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function start() {
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (currentProgress < 90) {
          currentProgress += 5;
          setProgress(currentProgress);
        }
      }, 200);

      await prefetchHomeData();

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 500);
    }
    start();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', padding: 24, textAlign: 'center'
    }}>
      {/* Kundi la Logo na Maandishi */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <img 
          src="/icons/icon.svg" 
          alt="KMCA" 
          style={{ width: 160, height: 160, objectFit: 'contain' }} 
        />
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Karibu KMCA</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Kwaya ya Vijana</p>
      </div>

      {/* Loading Bar (Iliyopunguzwa ukubwa) */}
      <div style={{ width: '100%', maxWidth: 200, marginTop: 24 }}>
        <div style={{ width: '100%', height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: 'var(--color-primary)', 
            borderRadius: 2,
            transition: 'width 0.2s ease-out'
          }} />
        </div>
      </div>
    </div>
  );
}
