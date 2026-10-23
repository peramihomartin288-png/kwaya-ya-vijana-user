import { useEffect, useState } from 'react';

export default function InstallSlides() {
  const [show, setShow] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slides, setSlides] = useState([]);

  // 1. Hifadhi event ya install
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 2. Angalia slides zipi zionyeshwe
  useEffect(() => {
    const startTimer = setTimeout(() => setShow(true), 2000);

    const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const hasNotifAPI = typeof Notification !== 'undefined';
    const hasNotifPermission = hasNotifAPI && Notification.permission === 'granted';

    const availableSlides = [];
    if (!isPWA) availableSlides.push('install');
    if (hasNotifAPI && !hasNotifPermission) availableSlides.push('notification');

    setSlides(availableSlides);
    return () => clearTimeout(startTimer);
  }, []);

  // 3. Badilisha slide
  useEffect(() => {
    if (!show || slides.length <= 1) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [show, slides]);

  if (!show || slides.length === 0) return null;

  const currentSlide = slides[slideIndex];

  // 4. Kazi ya Install (Native)
  const handleInstall = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('Install imekubaliwa');
      }
      window.deferredPrompt = null;
    } else {
      // Kama browser haitoi Native Prompt, onyesha maelekezo mafupi (kwenye console)
      console.log('Native install prompt haipo. Tumia menu ya browser kusakinisha.');
    }
  };

  // 5. Kazi ya Notification (Native)
  const handleNotification = async () => {
    if (typeof Notification !== 'undefined') {
      try {
        const permission = await Notification.requestPermission();
        console.log('Notification permission:', permission);
      } catch (e) {
        console.error('Kosa la notification:', e);
      }
    }
  };

  return (
    <div style={{
      margin: '8px 16px',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }}>
      {currentSlide === 'install' ? (
        <>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.85rem', marginBottom: 2, fontWeight: 600 }}>📱 Weka App</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Tumia bila internet.</p>
          </div>
          <button onClick={handleInstall} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Install
          </button>
        </>
      ) : (
        <>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '0.85rem', marginBottom: 2, fontWeight: 600 }}>🔔 Ruhusu Arifa</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Pata taarifa za live.</p>
          </div>
          <button onClick={handleNotification} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Ruhusu
          </button>
        </>
      )}
    </div>
  );
}
