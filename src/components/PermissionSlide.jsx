import { useState, useEffect } from 'react';
import { getVisitorId, track } from '../lib/tracker';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PermissionSlide({ onDone }) {
  // Hali ya PWA na Notifications
  const [pwaInstalled, setPwaInstalled] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches || localStorage.getItem('kmca_pwa_installed') === '1';
  });
  const [notifGranted, setNotifGranted] = useState(() => {
    return (typeof Notification !== 'undefined' && Notification.permission === 'granted') || localStorage.getItem('kmca_notif_granted') === '1';
  });

  const [loadingInstall, setLoadingInstall] = useState(false);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState('');

  // Sikiliza kama browser haitoi prompt ya install
  useEffect(() => {
    function onManual() { setShowManual(true); }
    window.addEventListener('pwa-install-manual', onManual);
    return () => window.removeEventListener('pwa-install-manual', onManual);
  }, []);

  // Kama zote mbili zimekamilika, funga kabisa (onDone)
  useEffect(() => {
    if (pwaInstalled && notifGranted) {
      onDone?.();
    }
  }, [pwaInstalled, notifGranted, onDone]);

  // Kazi ya kusakinisha
  function handleInstall() {
    setLoadingInstall(true);
    window.dispatchEvent(new Event('trigger-install'));
    try { track('pwa'); } catch {}

    setTimeout(() => {
      setLoadingInstall(false);
      // Kama baada ya sekunde 1.5 haijasakinishwa, onyesha maelekezo
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowManual(true);
      } else {
        localStorage.setItem('kmca_pwa_installed', '1');
        setPwaInstalled(true);
      }
    }, 1500);
  }

  // Kazi ya kuruhusu notifications
  async function handleAllowNotif() {
    setError('');
    setLoadingNotif(true);

    if (!('Notification' in window)) {
      setError('Browser yako haiunga mkono notifications');
      setLoadingNotif(false);
      return;
    }

    try {
      const perm = await Notification.requestPermission();

      if (perm === 'granted') {
        localStorage.setItem('kmca_notif_granted', '1');
        setNotifGranted(true);
        setLoadingNotif(false);

        // Subscription kwa background
        setTimeout(async () => {
          try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY),
            });
            const json = sub.toJSON();
            const visitor_id = getVisitorId();

            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscribe-push`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                endpoint: json.endpoint,
                p256dh: json.keys.p256dh,
                auth: json.keys.auth,
                visitor_id,
              }),
            });
            await track('notifications', true);
          } catch (e) { console.error(e); }
        }, 100);
        return;
      }

      if (perm === 'denied') {
        setError('Ulikataa. Nenda browser settings kuruhusu.');
        setLoadingNotif(false);
        return;
      }
    } catch (e) {
      setError('Kosa: ' + e.message);
    }

    setLoadingNotif(false);
  }

  // Kama zote mbili zimekamilika, usionyeshe kitu
  if (pwaInstalled && notifGranted) return null;

  return (
    <div className="permission-slide-overlay">
      {/* Slide 1: Install (Inaonekana tu kama PWA haijasakinishwa) */}
      {!pwaInstalled && (
        <div className="permission-slide">
          <div className="permission-slide-content">
            <div className="permission-slide-icon">📱</div>
            <h2>Sakinisha App</h2>
            <p>Itumike kama app ya kawaida kwenye simu yako — bila browser.</p>

            {!showManual ? (
              <>
                <button onClick={handleInstall} disabled={loadingInstall} style={{ width: '100%', padding: 12, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>{loadingInstall ? 'Inasakinisha...' : 'Sakinisha'}</button>
                <button className="permission-skip" onClick={() => {
                  localStorage.setItem('kmca_pwa_installed', '1');
                  setPwaInstalled(true);
                }}>Baadaye</button>
              </>
            ) : (
              <div style={{ background: 'var(--color-bg-light)', padding: 16, borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.85rem', marginTop: 8 }}>
                <strong>📌 Jinsi ya Kusakinisha:</strong>
                <p style={{ marginTop: 8, color: 'var(--color-text-muted)' }}>Kama kitufe hakitokei, tumia menu ya browser:</p>
                <ol style={{ paddingLeft: 20, marginTop: 8, color: 'var(--color-text)' }}>
                  <li>Bonyeza menu ya browser (⋮).</li>
                  <li>Chagua <b>"Install App"</b> / <b>"Add to Home Screen"</b>.</li>
                  <li>Bonyeza <b>"Install"</b>.</li>
                </ol>
                <Button onClick={() => {
                  localStorage.setItem('kmca_pwa_installed', '1');
                  setPwaInstalled(true);
                }} fullWidth style={{ marginTop: 12 }}>Nimeelewa, Endelea</Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slide 2: Notifications (Inaonekana tu kama Notif haijaruhusiwa) */}
      {pwaInstalled && !notifGranted && (
        <div className="permission-slide">
          <div className="permission-slide-content">
            <div className="permission-slide-icon">🔔</div>
            <h2>Ruhusu Notifications</h2>
            <p>Pata taarifa za haraka kuhusu daily cards, sala maalumu, na matukio mapya.</p>

            {error && <div className="input-error" style={{ fontSize: '0.75rem' }}>{error}</div>}

            <button onClick={handleAllowNotif} disabled={loadingNotif} style={{ width: '100%', padding: 12, background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>{loadingNotif ? 'Inatuma...' : 'Ruhusu Notifications'}</button>
            <button className="permission-skip" onClick={() => {
              localStorage.setItem('kmca_notif_granted', '1');
              setNotifGranted(true);
            }}>Baadaye</button>
          </div>
        </div>
      )}
    </div>
  );
}
