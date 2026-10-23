import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstallApp() {
  const navigate = useNavigate();
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Angalia kama browser inaruhusu install
    const handler = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Kama tayari ni PWA, mpeleke Home
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isPWA) navigate('/home', { replace: true });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [navigate]);

  async function handleInstall() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') navigate('/home', { replace: true });
      window.deferredPrompt = null;
    } else {
      alert('Bonyeza mistari mitatu (⋮) kisha chagua "Install app" au "Add to Home Screen".');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      
      <img src="/icons/icon.svg" alt="KMCA" style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 24 }} />
      
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>Karibu KMCA</h1>
      
      <div style={{ color: 'var(--color-text-muted)', marginBottom: 24, maxWidth: 320, lineHeight: 1.6, textAlign: 'left' }}>
        <p style={{ marginBottom: 12 }}>
          KMCA ni App ya Kikatoliki iliyoundwa kwa ajili yako. Hapa utapata kila kitu unachohitaji ili kuimarisha safari yako ya kiroho kila siku.
        </p>
        
        <p style={{ fontWeight: 'bold', color: 'var(--color-text)', marginBottom: 8 }}>Utapata:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 6 }}>✝️ <strong>Watakatifu wa Kila Siku:</strong> Jifunze maisha na miujiza yao.</li>
          <li style={{ marginBottom: 6 }}>📖 <strong>Masomo ya Dominika:</strong> Soma masomo ya kila siku.</li>
          <li style={{ marginBottom: 6 }}>💭 <strong>Tafakari:</strong> Pata neno la kutafakari kila siku.</li>
          <li style={{ marginBottom: 6 }}>🎵 <strong>Nyimbo za Kikatoliki:</strong> Sikiliza nyimbo za kiroho za kwaya.</li>
          <li style={{ marginBottom: 6 }}>🔴 <strong>Misa Live:</strong> Tazama misa na ibada zikiwa zinaendelea.</li>
          <li style={{ marginBottom: 6 }}>🙏 <strong>Sala:</strong> Pata sala mbalimbali za Kikatoliki.</li>
        </ul>

        <p style={{ marginTop: 16 }}>
          Sakinisha App hii kwenye simu yako ili uweze kufungua haraka, kutumia bila internet, na kupata taarifa mpya papo hapo. Bonyeza kitufe hapa chini kuanza.
        </p>
      </div>

      <button onClick={handleInstall} 
        style={{ 
          background: 'var(--color-primary)', color: 'white', border: 'none', 
          padding: '14px 32px', borderRadius: 8, fontSize: '1rem', fontWeight: 'bold', 
          cursor: 'pointer', width: '100%', maxWidth: 300 
        }}
      >
        ⬇️ Install App
      </button>

      <button 
        onClick={() => navigate('/home')} 
        style={{ 
          background: 'none', border: 'none', color: 'var(--color-text-muted)', 
          marginTop: 16, cursor: 'pointer', fontSize: '0.9rem' 
        }}
      >
        Endelea kwenye Browser
      </button>

    </div>
  );
}
